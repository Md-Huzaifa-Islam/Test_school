import { NextRequest, NextResponse } from "next/server";
import { seedQuestions } from "@/scripts/seedQuestions";

export async function POST(request: NextRequest) {
  try {
    // In production, you might want to add authentication here
    const result = await seedQuestions();

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${result.count} questions`,
      data: result,
    });
  } catch (error) {
    console.error("Error in seed endpoint:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to seed questions",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
