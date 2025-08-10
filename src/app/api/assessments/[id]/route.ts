import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/mongodb";
import Assessment from "@/models/Assessment";
import Question from "@/models/Question";
import User from "@/models/User";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    // Await params before using properties (Next.js 15 requirement)
    const { id } = await params;

    // Validate ObjectId
    if (!id || id === "undefined" || id.length !== 24) {
      return NextResponse.json(
        { message: "Invalid assessment ID" },
        { status: 400 }
      );
    }

    const assessment = await Assessment.findById(id);
    if (!assessment) {
      return NextResponse.json(
        { message: "Assessment not found" },
        { status: 404 }
      );
    }

    // Check if user owns this assessment
    if (assessment.userId !== decoded.userId) {
      return NextResponse.json(
        { message: "Unauthorized access to assessment" },
        { status: 403 }
      );
    }

    // Populate questions
    const populatedAssessment = await Assessment.findById(id).populate(
      "questions"
    );

    return NextResponse.json({
      success: true,
      data: {
        assessment: populatedAssessment,
        questions: populatedAssessment.questions,
      },
    });
  } catch (error) {
    console.error("Get assessment API error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = request.headers.get("authorization");
    const { action } = await request.json();

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

    // Await params before using properties (Next.js 15 requirement)
    const { id } = await params;

    // Validate ObjectId
    if (!id || id === "undefined" || id.length !== 24) {
      return NextResponse.json(
        { message: "Invalid assessment ID" },
        { status: 400 }
      );
    }

    const assessment = await Assessment.findById(id);
    if (!assessment) {
      return NextResponse.json(
        { message: "Assessment not found" },
        { status: 404 }
      );
    }

    // Check if user owns this assessment
    if (assessment.userId !== decoded.userId) {
      return NextResponse.json(
        { message: "Unauthorized access to assessment" },
        { status: 403 }
      );
    }

    if (action === "start") {
      // Start the assessment
      if (assessment.status !== "pending") {
        return NextResponse.json(
          { message: "Assessment already started or completed" },
          { status: 400 }
        );
      }

      assessment.status = "in_progress";
      assessment.startedAt = new Date();
      assessment.remainingTime = assessment.timeLimit * 60; // Convert to seconds
      await assessment.save();

      // Get questions for this assessment
      const questions = await Question.find({
        _id: { $in: assessment.questions },
      });

      return NextResponse.json({
        success: true,
        data: {
          assessment: assessment.toObject(),
          questions: questions,
        },
        message: "Assessment started successfully",
      });
    }

    return NextResponse.json({ message: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Assessment action API error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
