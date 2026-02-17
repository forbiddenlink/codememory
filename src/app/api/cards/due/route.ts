import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
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

    // Get cards due for review
    const dueCards = await prisma.userCardProgress.findMany({
      where: {
        userId: user.id,
        nextReview: {
          lte: new Date(),
        },
      },
      include: {
        flashcard: {
          include: {
            concept: true,
          },
        },
      },
      orderBy: {
        nextReview: "asc",
      },
    });

    return NextResponse.json({ cards: dueCards });
  } catch (error) {
    console.error("Error fetching due cards:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
