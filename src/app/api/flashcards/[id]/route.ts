import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const flashcard = await prisma.flashcard.findUnique({
      where: { id },
      include: {
        concept: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!flashcard) {
      return NextResponse.json(
        { error: "Flashcard not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ flashcard });
  } catch (error) {
    console.error("Failed to fetch flashcard:", error);
    return NextResponse.json(
      { error: "Failed to fetch flashcard" },
      { status: 500 }
    );
  }
}
