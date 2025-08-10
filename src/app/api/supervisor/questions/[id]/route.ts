import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/mongodb";
import Question from "@/models/Question";
import User from "@/models/User";

// Get single question
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
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

    // Check if user is supervisor or admin
    const user = await User.findById(decoded.userId);
    if (!user || !["supervisor", "admin"].includes(user.role)) {
      return NextResponse.json(
        { message: "Access denied. Supervisor or Admin role required." },
        { status: 403 }
      );
    }

    const { id } = await params;

    if (!id || id === "undefined" || id.length !== 24) {
      return NextResponse.json(
        { message: "Invalid question ID" },
        { status: 400 }
      );
    }

    const question = await Question.findById(id);
    if (!question) {
      return NextResponse.json(
        { message: "Question not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: question,
    });
  } catch (error) {
    console.error("Get question API error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// Update question
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
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

    // Check if user is supervisor or admin
    const user = await User.findById(decoded.userId);
    if (!user || !["supervisor", "admin"].includes(user.role)) {
      return NextResponse.json(
        { message: "Access denied. Supervisor or Admin role required." },
        { status: 403 }
      );
    }

    const { id } = await params;

    if (!id || id === "undefined" || id.length !== 24) {
      return NextResponse.json(
        { message: "Invalid question ID" },
        { status: 400 }
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
    if (options && (!Array.isArray(options) || options.length < 2)) {
      return NextResponse.json(
        { message: "At least 2 options are required" },
        { status: 400 }
      );
    }

    if (options && correctAnswer && !options.includes(correctAnswer)) {
      return NextResponse.json(
        { message: "Correct answer must be one of the options" },
        { status: 400 }
      );
    }

    const updateData: any = {
      updatedBy: decoded.userId,
      updatedAt: new Date(),
    };

    if (competency) updateData.competency = competency;
    if (level) updateData.level = level;
    if (step) updateData.step = step;
    if (question) updateData.question = question;
    if (options) updateData.options = options;
    if (correctAnswer) updateData.correctAnswer = correctAnswer;
    if (difficulty) updateData.difficulty = difficulty;
    if (tags) updateData.tags = tags;

    const updatedQuestion = await Question.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedQuestion) {
      return NextResponse.json(
        { message: "Question not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedQuestion,
      message: "Question updated successfully",
    });
  } catch (error) {
    console.error("Update question API error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// Delete question
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
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

    // Check if user is supervisor or admin
    const user = await User.findById(decoded.userId);
    if (!user || !["supervisor", "admin"].includes(user.role)) {
      return NextResponse.json(
        { message: "Access denied. Supervisor or Admin role required." },
        { status: 403 }
      );
    }

    const { id } = await params;

    if (!id || id === "undefined" || id.length !== 24) {
      return NextResponse.json(
        { message: "Invalid question ID" },
        { status: 400 }
      );
    }

    const deletedQuestion = await Question.findByIdAndDelete(id);

    if (!deletedQuestion) {
      return NextResponse.json(
        { message: "Question not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Question deleted successfully",
    });
  } catch (error) {
    console.error("Delete question API error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
