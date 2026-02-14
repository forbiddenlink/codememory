import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const flashcards = await prisma.flashcard.findMany({
      where: { conceptId: id },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ flashcards });
  } catch (error) {
    console.error("Failed to fetch flashcards:", error);
    return NextResponse.json(
      { error: "Failed to fetch flashcards" },
      { status: 500 }
    );
  }
}
