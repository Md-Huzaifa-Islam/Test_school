import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Question from "@/models/Question";

export async function GET() {
  try {
    await connectDB();

    // Get first few questions for step 1 to see their structure
    const questions = await Question.find({ step: 1 }).limit(5);

    return NextResponse.json({
      success: true,
      data: {
        questions: questions.map((q) => ({
          _id: q._id,
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
          level: q.level,
          step: q.step,
        })),
      },
    });
  } catch (error) {
    console.error("Sample questions error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
