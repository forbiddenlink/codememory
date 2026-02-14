import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * Public endpoint to list all concepts
 * Used by guest users to browse available content
 */
export async function GET() {
  try {
    const concepts = await prisma.concept.findMany({
      include: {
        _count: {
          select: {
            flashcards: true,
            challenges: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Map to include counts with simpler names
    const conceptsWithCounts = concepts.map((concept) => ({
      id: concept.id,
      name: concept.name,
      description: concept.description,
      category: concept.category,
      language: concept.language,
      difficulty: concept.difficulty,
      flashcardCount: concept._count.flashcards,
      challengeCount: concept._count.challenges,
    }));

    return NextResponse.json({ concepts: conceptsWithCounts });
  } catch (error) {
    console.error("Error fetching concepts:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
