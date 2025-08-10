import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Assessment from "@/models/Assessment";

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
    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        userId: string;
      };
    } catch (error) {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    await connectDB();

    // Get user details
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Get all assessments for this user
    const assessments = await Assessment.find({ userId: decoded.userId }).sort({
      createdAt: -1,
    });

    return NextResponse.json({
      success: true,
      data: {
        user: {
          email: user.email,
          currentLevel: user.currentLevel,
          completedSteps: user.completedSteps,
          assessmentHistory: user.assessmentHistory,
          canRetake: user.canRetake,
        },
        assessments: assessments.map((a) => ({
          _id: a._id,
          step: a.step,
          status: a.status,
          score: a.score,
          percentage: a.percentage,
          achievedLevel: a.achievedLevel,
          canProceedToNext: a.canProceedToNext,
          createdAt: a.createdAt,
          completedAt: a.completedAt,
        })),
      },
    });
  } catch (error) {
    console.error("Debug user progress error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
