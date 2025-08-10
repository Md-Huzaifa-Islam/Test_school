import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Question from "@/models/Question";

export async function GET() {
  try {
    await connectDB();

    // Get count of questions by step and level
    const questionStats = await Question.aggregate([
      {
        $group: {
          _id: { step: "$step", level: "$level" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.step": 1, "_id.level": 1 },
      },
    ]);

    const totalQuestions = await Question.countDocuments();

    return NextResponse.json({
      success: true,
      data: {
        totalQuestions,
        questionsByStepAndLevel: questionStats,
        breakdown: {
          step1: {
            A1:
              questionStats.find(
                (q) => q._id.step === 1 && q._id.level === "A1"
              )?.count || 0,
            A2:
              questionStats.find(
                (q) => q._id.step === 1 && q._id.level === "A2"
              )?.count || 0,
          },
          step2: {
            B1:
              questionStats.find(
                (q) => q._id.step === 2 && q._id.level === "B1"
              )?.count || 0,
            B2:
              questionStats.find(
                (q) => q._id.step === 2 && q._id.level === "B2"
              )?.count || 0,
          },
          step3: {
            C1:
              questionStats.find(
                (q) => q._id.step === 3 && q._id.level === "C1"
              )?.count || 0,
            C2:
              questionStats.find(
                (q) => q._id.step === 3 && q._id.level === "C2"
              )?.count || 0,
          },
        },
      },
    });
  } catch (error) {
    console.error("Question stats error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
