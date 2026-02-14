import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const challenge = await prisma.challenge.findUnique({
      where: { id },
      include: {
        concept: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!challenge) {
      return NextResponse.json(
        { error: "Challenge not found" },
        { status: 404 }
      );
    }

    // Parse JSON fields
    const formattedChallenge = {
      ...challenge,
      testCases: JSON.parse(challenge.testCases as string),
      hints: JSON.parse(challenge.hints as string),
    };

    return NextResponse.json({ challenge: formattedChallenge });
  } catch (error) {
    console.error("Failed to fetch challenge:", error);
    return NextResponse.json(
      { error: "Failed to fetch challenge" },
      { status: 500 }
    );
  }
}
