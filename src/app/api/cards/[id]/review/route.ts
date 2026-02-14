import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { FSRSScheduler, Rating } from "@/lib/fsrs-scheduler";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: cardId } = await context.params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get request body
    const body = await request.json();
    const { rating } = body;

    // Validate rating (1=Again, 2=Hard, 3=Good, 4=Easy)
    if (![1, 2, 3, 4].includes(rating)) {
      return NextResponse.json({ error: "Invalid rating" }, { status: 400 });
    }

    // Get current card progress
    const progress = await prisma.userCardProgress.findUnique({
      where: {
        userId_flashcardId: {
          userId: user.id,
          flashcardId: cardId,
        },
      },
    });

    if (!progress) {
      return NextResponse.json(
        { error: "Card progress not found" },
        { status: 404 }
      );
    }

    // Use FSRS to calculate next review
    const scheduler = new FSRSScheduler();
    const cardData = {
      stability: progress.stability,
      difficulty: progress.difficulty,
      elapsedDays: progress.elapsedDays,
      scheduledDays: progress.scheduledDays,
      reps: progress.reps,
      lapses: progress.lapses,
      state: progress.state,
      lastReview: progress.lastReview,
    };

    const updatedCard = scheduler.reviewCard(cardData, rating as Rating);

    // Update database
    const updated = await prisma.userCardProgress.update({
      where: {
        userId_flashcardId: {
          userId: user.id,
          flashcardId: cardId,
        },
      },
      data: {
        stability: updatedCard.stability,
        difficulty: updatedCard.difficulty,
        elapsedDays: updatedCard.elapsedDays,
        scheduledDays: updatedCard.scheduledDays,
        reps: updatedCard.reps,
        lapses: updatedCard.lapses,
        state: updatedCard.state,
        lastReview: updatedCard.lastReview,
        nextReview: updatedCard.nextReview,
      },
    });

    // Log event
    await prisma.event.create({
      data: {
        userId: user.id,
        eventType: "card_reviewed",
        eventData: {
          flashcardId: cardId,
          rating,
          nextReview: updatedCard.nextReview,
        },
      },
    });

    // Update concept mastery
    const flashcard = await prisma.flashcard.findUnique({
      where: { id: cardId },
    });

    if (flashcard) {
      await updateConceptMastery(user.id, flashcard.conceptId);
    }

    return NextResponse.json({
      success: true,
      nextReview: updatedCard.nextReview,
      card: updated,
    });
  } catch (error) {
    console.error("Error reviewing card:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Helper function to update concept mastery
async function updateConceptMastery(userId: string, conceptId: string) {
  // Get all cards for this concept
  const allCards = await prisma.userCardProgress.findMany({
    where: {
      userId,
      flashcard: {
        conceptId,
      },
    },
  });

  if (allCards.length === 0) return;

  // Calculate average retention and mastery
  const avgStability = allCards.reduce((sum, c) => sum + c.stability, 0) / allCards.length;
  const avgReps = allCards.reduce((sum, c) => sum + c.reps, 0) / allCards.length;
  
  // Simple mastery calculation: based on stability and reps
  // Stability ranges from 0 to ~100+ after many reviews
  // Normalize to 0-100 scale
  const masteryLevel = Math.min(100, (avgStability / 2) + (avgReps * 5));
  const retentionRate = Math.min(100, avgStability);

  // Upsert concept mastery
  await prisma.userConceptMastery.upsert({
    where: {
      userId_conceptId: {
        userId,
        conceptId,
      },
    },
    create: {
      userId,
      conceptId,
      masteryLevel,
      retentionRate,
      totalReviews: 1,
      lastReviewed: new Date(),
    },
    update: {
      masteryLevel,
      retentionRate,
      totalReviews: {
        increment: 1,
      },
      lastReviewed: new Date(),
    },
  });
}
