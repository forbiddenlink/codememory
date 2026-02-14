import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

/**
 * Check if the current user is an admin
 */
async function isAdmin(email: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { isAdmin: true },
  });
  return user?.isAdmin ?? false;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify admin privileges
    if (!(await isAdmin(session.user.email))) {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const body = await request.json();
    const { name, category, description, difficulty, language } = body;

    // Validate required fields
    if (!name || !category || !description || !difficulty) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate difficulty range
    const difficultyNum = parseInt(difficulty);
    if (isNaN(difficultyNum) || difficultyNum < 1 || difficultyNum > 5) {
      return NextResponse.json(
        { error: "Difficulty must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Create concept
    const concept = await prisma.concept.create({
      data: {
        name,
        category,
        description,
        difficulty: difficultyNum,
        language: language || null,
      },
    });

    return NextResponse.json({ concept }, { status: 201 });
  } catch (error) {
    console.error("Error creating concept:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify admin privileges
    if (!(await isAdmin(session.user.email))) {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

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

    return NextResponse.json({ concepts });
  } catch (error) {
    console.error("Error fetching concepts:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
