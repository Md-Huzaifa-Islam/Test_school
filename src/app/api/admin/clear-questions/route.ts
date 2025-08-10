import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Question from "@/models/Question";

export async function DELETE() {
  try {
    await connectDB();

    // Delete all existing questions
    const deleteResult = await Question.deleteMany({});

    console.log(`Deleted ${deleteResult.deletedCount} questions from database`);

    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${deleteResult.deletedCount} questions`,
      deletedCount: deleteResult.deletedCount,
    });
  } catch (error) {
    console.error("Clear questions error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to clear questions",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
