import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/mongodb";
import Question from "@/models/Question";
import User from "@/models/User";

// Get all questions (Supervisor/Admin only)
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

    // Check if user is supervisor or admin
    const user = await User.findById(decoded.userId);
    if (!user || !["supervisor", "admin"].includes(user.role)) {
      return NextResponse.json(
        { message: "Access denied. Supervisor or Admin role required." },
        { status: 403 }
      );
    }

    const url = new URL(request.url);
    const step = url.searchParams.get("step");
    const level = url.searchParams.get("level");
    const competency = url.searchParams.get("competency");
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "20");

    // Build filter query
    const filter: any = {};
    if (step) filter.step = parseInt(step);
    if (level) filter.level = level;
    if (competency) filter.competency = competency;

    // Get questions with pagination
    const questions = await Question.find(filter)
      .sort({ step: 1, level: 1, competency: 1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Question.countDocuments(filter);

    // Get summary statistics
    const stats = await Question.aggregate([
      { $match: filter },
      {
        $group: {
          _id: { step: "$step", level: "$level" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.step": 1, "_id.level": 1 } },
    ]);

    return NextResponse.json({
      success: true,
      data: {
        questions,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
        stats,
      },
    });
  } catch (error) {
    console.error("Get questions API error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// Create new question (Supervisor/Admin only)
export async function POST(request: NextRequest) {
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

    // Check if user is supervisor or admin
    const user = await User.findById(decoded.userId);
    if (!user || !["supervisor", "admin"].includes(user.role)) {
      return NextResponse.json(
        { message: "Access denied. Supervisor or Admin role required." },
        { status: 403 }
      );
    }

    const {
      competency,
      level,
      step,
      question,
      options,
      correctAnswer,
      difficulty,
      tags,
    } = await request.json();

    // Validation
    if (
      !competency ||
      !level ||
      !step ||
      !question ||
      !options ||
      !correctAnswer
    ) {
      return NextResponse.json(
        { message: "All required fields must be provided" },
        { status: 400 }
      );
    }

    if (!Array.isArray(options) || options.length < 2) {
      return NextResponse.json(
        { message: "At least 2 options are required" },
        { status: 400 }
      );
    }

    if (!options.includes(correctAnswer)) {
      return NextResponse.json(
        { message: "Correct answer must be one of the options" },
        { status: 400 }
      );
    }

    // Create new question
    const newQuestion = new Question({
      competency,
      level,
      step,
      question,
      options,
      correctAnswer,
      difficulty: difficulty || "medium",
      tags: tags || [],
      createdBy: decoded.userId,
    });

    await newQuestion.save();

    return NextResponse.json({
      success: true,
      data: newQuestion,
      message: "Question created successfully",
    });
  } catch (error) {
    console.error("Create question API error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
