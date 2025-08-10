import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/mongodb";
import Question from "@/models/Question";
import User from "@/models/User";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Authorization header required" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return NextResponse.json(
        { message: "Access token required" },
        { status: 401 }
      );
    }

    // Verify JWT token and check if user is admin
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        userId: string;
        role: string;
      };
    } catch (error) {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    await connectDB();

    // Check if user is admin
    const user = await User.findById(decoded.userId);
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { message: "Admin access required" },
        { status: 403 }
      );
    }

    // Get all questions with full details
    const questions = await Question.find({}).sort({ createdAt: -1 });

    // Get count of questions by step and level for stats
    const questionStats = await Question.aggregate([
      {
        $group: {
          _id: { step: "$step", level: "$level", competency: "$competency" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.step": 1, "_id.level": 1 },
      },
    ]);

    const totalQuestions = questions.length;
    const step1Questions = questions.filter((q) => q.step === 1).length;
    const step2Questions = questions.filter((q) => q.step === 2).length;
    const step3Questions = questions.filter((q) => q.step === 3).length;

    // Count by competency
    const competencyCount: { [key: string]: number } = {};
    questions.forEach((q) => {
      competencyCount[q.competency] = (competencyCount[q.competency] || 0) + 1;
    });

    return NextResponse.json({
      success: true,
      data: {
        questions,
        stats: {
          totalQuestions,
          step1Questions,
          step2Questions,
          step3Questions,
          competencyCount,
        },
        breakdown: questionStats,
      },
    });
  } catch (error) {
    console.error("Admin questions API error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
