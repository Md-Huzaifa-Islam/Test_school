import { NextRequest, NextResponse } from "next/server";
import { seedComprehensiveQuestions } from "@/scripts/seedComprehensiveQuestions";

export async function POST(request: NextRequest) {
  try {
    // In production, you might want to add authentication here
    const result = await seedComprehensiveQuestions();

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${result.count} questions across ${result.competencies} competencies and ${result.levels} levels`,
      data: result,
    });
  } catch (error) {
    console.error("Error in comprehensive seed endpoint:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to seed comprehensive questions",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
