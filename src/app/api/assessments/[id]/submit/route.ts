import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/mongodb";
import Assessment from "@/models/Assessment";
import Question from "@/models/Question";
import User from "@/models/User";
import Certificate from "@/models/Certificate";

// Assessment scoring logic based on Test_School framework
const calculateLevelAndCertification = (step: number, percentage: number) => {
  let achievedLevel: string | null = null;
  let canProceedToNext = false;
  let certificateLevel: string | null = null;

  switch (step) {
    case 1: // A1 & A2 levels
      if (percentage < 25) {
        // Fail - no retake allowed, no certificate
        achievedLevel = null;
        canProceedToNext = false;
        certificateLevel = null;
      } else if (percentage >= 25 && percentage < 50) {
        // A1 certified
        achievedLevel = "A1";
        canProceedToNext = false;
        certificateLevel = "A1";
      } else if (percentage >= 50 && percentage < 75) {
        // A2 certified
        achievedLevel = "A2";
        canProceedToNext = false;
        certificateLevel = "A2";
      } else {
        // A2 certified + proceed to Step 2
        achievedLevel = "A2";
        canProceedToNext = true;
        certificateLevel = "A2";
      }
      break;

    case 2: // B1 & B2 levels
      if (percentage < 25) {
        // Remain at A2
        achievedLevel = "A2";
        canProceedToNext = false;
        certificateLevel = null;
      } else if (percentage >= 25 && percentage < 50) {
        // B1 certified
        achievedLevel = "B1";
        canProceedToNext = false;
        certificateLevel = "B1";
      } else if (percentage >= 50 && percentage < 75) {
        // B2 certified
        achievedLevel = "B2";
        canProceedToNext = false;
        certificateLevel = "B2";
      } else {
        // B2 certified + proceed to Step 3
        achievedLevel = "B2";
        canProceedToNext = true;
        certificateLevel = "B2";
      }
      break;

    case 3: // C1 & C2 levels
      if (percentage < 25) {
        // Remain at B2
        achievedLevel = "B2";
        canProceedToNext = false;
        certificateLevel = null;
      } else if (percentage >= 25 && percentage < 50) {
        // C1 certified
        achievedLevel = "C1";
        canProceedToNext = false;
        certificateLevel = "C1";
      } else {
        // C2 certified
        achievedLevel = "C2";
        canProceedToNext = false;
        certificateLevel = "C2";
      }
      break;

    default:
      throw new Error("Invalid step number");
  }

  return { achievedLevel, canProceedToNext, certificateLevel };
};

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = request.headers.get("authorization");
    const { answers } = await request.json();

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

    if (assessment.status === "completed") {
      return NextResponse.json(
        { message: "Assessment already completed" },
        { status: 400 }
      );
    }

    // Get all questions for this assessment
    const questions = await Question.find({
      _id: { $in: assessment.questions },
    });

    if (questions.length === 0) {
      return NextResponse.json(
        { message: "No questions found for this assessment" },
        { status: 400 }
      );
    }

    // Calculate score
    let correctAnswers = 0;
    const processedAnswers = [];

    console.log("Scoring assessment:", {
      assessmentId: id,
      totalQuestions: questions.length,
      answersReceived: answers.length,
    });

    for (const answer of answers) {
      const question = questions.find(
        (q) => q._id.toString() === answer.questionId
      );
      if (question) {
        const isCorrect = question.correctAnswer === answer.selectedAnswer;
        if (isCorrect) correctAnswers++;

        console.log("Answer check:", {
          questionId: answer.questionId,
          selectedAnswer: answer.selectedAnswer,
          correctAnswer: question.correctAnswer,
          isCorrect: isCorrect,
        });

        processedAnswers.push({
          questionId: answer.questionId,
          selectedAnswer: answer.selectedAnswer,
          isCorrect: isCorrect,
        });
      } else {
        console.log("Question not found for answer:", answer.questionId);
      }
    }

    const score = correctAnswers;
    const percentage = (correctAnswers / questions.length) * 100;

    console.log("Final score calculation:", {
      correctAnswers,
      totalQuestions: questions.length,
      percentage,
    });

    // Calculate level and certification based on step and percentage
    const { achievedLevel, canProceedToNext, certificateLevel } =
      calculateLevelAndCertification(assessment.step, percentage);

    console.log("Assessment result calculation:", {
      assessmentId: id,
      step: assessment.step,
      percentage,
      achievedLevel,
      canProceedToNext,
      certificateLevel,
    });

    // Update assessment
    assessment.answers = processedAnswers;
    assessment.score = score;
    assessment.percentage = percentage;
    assessment.achievedLevel = achievedLevel;
    assessment.status = "completed";
    assessment.completedAt = new Date();
    assessment.canProceedToNext = canProceedToNext;

    // Handle retake restrictions for Step 1 failure
    if (assessment.step === 1 && percentage < 25) {
      const user = await User.findById(decoded.userId);
      if (user) {
        user.canRetake = false;
        await user.save();
      }
    }

    await assessment.save();

    // Update user's current level and assessment history
    const user = await User.findById(decoded.userId);
    if (user && achievedLevel) {
      user.currentLevel = achievedLevel;
      user.lastAssessmentDate = new Date();

      if (!user.completedSteps.includes(assessment.step)) {
        user.completedSteps.push(assessment.step);
      }

      // Add to assessment history
      user.assessmentHistory.push({
        step: assessment.step,
        score: percentage,
        level: achievedLevel,
        date: new Date(),
      });

      await user.save();
    }

    // Create certificate if user achieved a level
    let certificateId = null;
    if (certificateLevel) {
      console.log("Creating certificate for level:", certificateLevel);

      // Generate certificate number
      const certificateNumber = `TS-${certificateLevel}-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 5)
        .toUpperCase()}`;

      const certificate = new Certificate({
        certificateNumber,
        userId: decoded.userId,
        level: certificateLevel,
        assessmentId: assessment._id,
        issuedDate: new Date(),
        status: "active",
      });

      await certificate.save();
      certificateId = certificate._id;

      console.log("Certificate created:", {
        certificateId: certificate._id,
        certificateNumber,
        level: certificateLevel,
        userId: decoded.userId,
      });
    } else {
      console.log("No certificate created - certificateLevel is null");
    }

    return NextResponse.json({
      success: true,
      data: {
        assessmentId: assessment._id,
        score: score,
        percentage: percentage,
        totalQuestions: questions.length,
        correctAnswers: correctAnswers,
        achievedLevel: achievedLevel,
        canProceedToNext: canProceedToNext,
        certificateLevel: certificateLevel,
        certificateId: certificateId,
        requiresSupervisorApproval: false, // Certificates are now auto-generated
      },
      message: "Assessment completed successfully",
    });
  } catch (error) {
    console.error("Submit assessment API error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
