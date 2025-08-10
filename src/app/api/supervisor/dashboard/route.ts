import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/mongodb";
import Assessment from "@/models/Assessment";
import User from "@/models/User";
import Certificate from "@/models/Certificate";

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
        role: string;
      };
    } catch (error) {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // Check if user is supervisor or admin
    if (!["supervisor", "admin"].includes(decoded.role)) {
      return NextResponse.json(
        { message: "Supervisor or admin access required" },
        { status: 403 }
      );
    }

    await connectDB();

    // Get completed assessments pending supervisor review
    const pendingAssessments = await Assessment.find({
      status: "completed",
      achievedLevel: { $ne: null },
      certificateGenerated: false,
    })
      .populate("userId", "firstName lastName email")
      .sort({ completedAt: -1 });

    // Get all users with their assessment history for reporting
    const allUsers = await User.find({ role: "student" })
      .select(
        "firstName lastName email currentLevel completedSteps assessmentHistory canRetake"
      )
      .sort({ lastName: 1 });

    // Get certificate statistics
    const certificateStats = await Certificate.aggregate([
      {
        $group: {
          _id: "$level",
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Get assessment statistics
    const assessmentStats = await Assessment.aggregate([
      {
        $match: { status: "completed" },
      },
      {
        $group: {
          _id: { step: "$step", level: "$achievedLevel" },
          count: { $sum: 1 },
          avgScore: { $avg: "$percentage" },
        },
      },
      { $sort: { "_id.step": 1, "_id.level": 1 } },
    ]);

    return NextResponse.json({
      success: true,
      data: {
        pendingAssessments,
        allUsers,
        statistics: {
          certificates: certificateStats,
          assessments: assessmentStats,
          totalStudents: allUsers.length,
          pendingReviews: pendingAssessments.length,
        },
      },
    });
  } catch (error) {
    console.error("Supervisor dashboard API error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
