import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const challenges = await prisma.challenge.findMany({
      where: { conceptId: id },
      orderBy: { stage: "asc" },
      select: {
        id: true,
        title: true,
        description: true,
        language: true,
        stage: true,
        difficulty: true,
      },
    });

    return NextResponse.json({ challenges });
  } catch (error) {
    console.error("Failed to fetch challenges:", error);
    return NextResponse.json(
      { error: "Failed to fetch challenges" },
      { status: 500 }
    );
  }
}
