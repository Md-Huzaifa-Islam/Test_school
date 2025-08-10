import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/mongodb";
import Assessment from "@/models/Assessment";
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

    // Get user to check current progress
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Get user's assessments
    const assessments = await Assessment.find({ userId: decoded.userId })
      .populate("questions")
      .sort({ createdAt: -1 });

    // Determine next available step
    let nextStep = 1;
    if (user.completedSteps.includes(1)) {
      // Check if user can proceed to step 2
      const step1Assessment = assessments.find(
        (a) => a.step === 1 && a.status === "completed"
      );
      if (step1Assessment?.canProceedToNext) {
        nextStep = 2;
      }
    }
    if (user.completedSteps.includes(2)) {
      // Check if user can proceed to step 3
      const step2Assessment = assessments.find(
        (a) => a.step === 2 && a.status === "completed"
      );
      if (step2Assessment?.canProceedToNext) {
        nextStep = 3;
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        assessments,
        userProgress: {
          currentLevel: user.currentLevel,
          completedSteps: user.completedSteps,
          canRetake: user.canRetake,
          nextAvailableStep: nextStep,
          assessmentHistory: user.assessmentHistory,
        },
      },
    });
  } catch (error) {
    console.error("Get assessments API error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const { step } = await request.json();

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

    if (!step || ![1, 2, 3].includes(step)) {
      return NextResponse.json(
        { message: "Valid step (1, 2, or 3) is required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Get user to check eligibility
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Check if user can take this step
    if (step === 1 && !user.canRetake && user.completedSteps.includes(1)) {
      return NextResponse.json(
        { message: "Retakes not allowed for Step 1 after failure" },
        { status: 403 }
      );
    }

    if (step === 2) {
      // Check if user completed step 1 and can proceed
      const step1Assessment = await Assessment.findOne({
        userId: decoded.userId,
        step: 1,
        status: "completed",
      });

      if (!step1Assessment || !step1Assessment.canProceedToNext) {
        return NextResponse.json(
          {
            message: "Must complete Step 1 with 75% or higher to access Step 2",
          },
          { status: 403 }
        );
      }
    }

    if (step === 3) {
      // Check if user completed step 2 and can proceed
      const step2Assessment = await Assessment.findOne({
        userId: decoded.userId,
        step: 2,
        status: "completed",
      });

      if (!step2Assessment || !step2Assessment.canProceedToNext) {
        return NextResponse.json(
          {
            message: "Must complete Step 2 with 75% or higher to access Step 3",
          },
          { status: 403 }
        );
      }
    }

    // Define levels for each step
    const stepLevels = {
      1: ["A1", "A2"],
      2: ["B1", "B2"],
      3: ["C1", "C2"],
    };

    const levels = stepLevels[step as keyof typeof stepLevels];

    // Get questions for this step (22 questions from each level = 44 total)
    const questionsQuery = {
      step: step,
      level: { $in: levels },
    };

    const allQuestions = await Question.find(questionsQuery);

    if (allQuestions.length === 0) {
      return NextResponse.json(
        { message: "No questions available for this step" },
        { status: 400 }
      );
    }

    // Define target question counts for each step
    const stepQuestionCounts = {
      1: 20, // Step 1: A1-A2
      2: 25, // Step 2: B1-B2
      3: 30, // Step 3: C1-C2
    };

    const targetCount =
      stepQuestionCounts[step as keyof typeof stepQuestionCounts];

    // Select questions proportionally from each level, up to available questions
    const selectedQuestions: any[] = [];
    const questionsPerLevel = Math.ceil(targetCount / levels.length);

    for (const level of levels) {
      const levelQuestions = allQuestions.filter((q) => q.level === level);
      const questionsToTake = Math.min(
        questionsPerLevel,
        levelQuestions.length
      );

      // Randomly select questions
      const shuffled = levelQuestions.sort(() => 0.5 - Math.random());
      selectedQuestions.push(...shuffled.slice(0, questionsToTake));
    }

    // If we don't have enough questions, use all available questions
    if (selectedQuestions.length < targetCount) {
      console.log(
        `Warning: Only ${selectedQuestions.length} questions available for step ${step}, target was ${targetCount}`
      );
    }

    // Shuffle the final question set
    const finalQuestions = selectedQuestions.sort(() => 0.5 - Math.random());

    // Create new assessment
    const assessment = new Assessment({
      userId: decoded.userId,
      step: step,
      levels: levels,
      questions: finalQuestions.map((q) => q._id),
      timeLimit: finalQuestions.length, // 1 minute per question
      status: "pending",
    });

    await assessment.save();

    console.log("Created assessment:", {
      assessmentId: assessment._id,
      step: step,
      levels: levels,
      questionCount: finalQuestions.length,
    });

    return NextResponse.json({
      success: true,
      data: {
        assessmentId: assessment._id,
        step: step,
        levels: levels,
        questionCount: finalQuestions.length,
        timeLimit: assessment.timeLimit,
      },
      message: `Step ${step} assessment created successfully`,
    });
  } catch (error) {
    console.error("Create assessment API error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
