import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/mongodb";
import Question from "@/models/Question";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const competency = searchParams.get("competency");
    const level = searchParams.get("level");
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

    // Verify JWT token
    try {
      jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    } catch (error) {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    await connectDB();

    // Build query filters
    const filters: any = {};
    if (competency) filters.competency = competency;
    if (level) filters.level = level;

    // Get questions based on filters
    const questions = await Question.find(filters).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: questions,
    });
  } catch (error) {
    console.error("Get questions API error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const body = await request.json();

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

    if (decoded.role !== "admin") {
      return NextResponse.json(
        { message: "Admin access required" },
        { status: 403 }
      );
    }

    await connectDB();

    // Create new question
    const question = new Question(body);
    await question.save();

    return NextResponse.json({
      success: true,
      data: question,
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
