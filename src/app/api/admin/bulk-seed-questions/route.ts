import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Question from "@/models/Question";
import User from "@/models/User";

const competencies = [
  "Reading Comprehension",
  "Grammar",
  "Vocabulary",
  "Listening",
  "Speaking",
  "Writing",
  "Critical Thinking",
  "Problem Solving",
  "Communication",
  "Digital Literacy",
];

export async function POST() {
  try {
    await connectDB();

    // Find or create admin user
    let adminUser = await User.findOne({ role: "admin" });
    if (!adminUser) {
      adminUser = new User({
        name: "System Admin",
        email: "admin@testschool.com",
        password: "hashed_password",
        role: "admin",
        currentLevel: "C2",
        completedSteps: [1, 2, 3],
        canRetake: true,
      });
      await adminUser.save();
    }

    // Clear existing questions
    await Question.deleteMany({});

    // Generate questions for each step and level
    const questions: any[] = [];

    // Step 1: A1-A2 (20 questions)
    for (let i = 0; i < 10; i++) {
      questions.push({
        competency: competencies[i % competencies.length],
        level: "A1",
        step: 1,
        question: `A1 Level Question ${
          i + 1
        }: This is a basic level question about ${competencies[
          i % competencies.length
        ].toLowerCase()}. What is the correct answer?`,
        options: ["Option A", "Option B", "Option C", "Option D"],
        correctAnswer: i % 4,
        explanation: `This tests basic ${competencies[
          i % competencies.length
        ].toLowerCase()} skills.`,
        difficulty: "easy",
        category: competencies[i % competencies.length],
        isActive: true,
        createdBy: adminUser._id,
      });
    }

    for (let i = 0; i < 10; i++) {
      questions.push({
        competency: competencies[i % competencies.length],
        level: "A2",
        step: 1,
        question: `A2 Level Question ${
          i + 1
        }: This is an elementary level question about ${competencies[
          i % competencies.length
        ].toLowerCase()}. What is the correct answer?`,
        options: ["Option A", "Option B", "Option C", "Option D"],
        correctAnswer: i % 4,
        explanation: `This tests elementary ${competencies[
          i % competencies.length
        ].toLowerCase()} skills.`,
        difficulty: "easy",
        category: competencies[i % competencies.length],
        isActive: true,
        createdBy: adminUser._id,
      });
    }

    // Step 2: B1-B2 (25 questions)
    for (let i = 0; i < 13; i++) {
      questions.push({
        competency: competencies[i % competencies.length],
        level: "B1",
        step: 2,
        question: `B1 Level Question ${
          i + 1
        }: This is an intermediate level question about ${competencies[
          i % competencies.length
        ].toLowerCase()}. What is the correct answer?`,
        options: ["Option A", "Option B", "Option C", "Option D"],
        correctAnswer: i % 4,
        explanation: `This tests intermediate ${competencies[
          i % competencies.length
        ].toLowerCase()} skills.`,
        difficulty: "medium",
        category: competencies[i % competencies.length],
        isActive: true,
        createdBy: adminUser._id,
      });
    }

    for (let i = 0; i < 12; i++) {
      questions.push({
        competency: competencies[i % competencies.length],
        level: "B2",
        step: 2,
        question: `B2 Level Question ${
          i + 1
        }: This is an upper intermediate level question about ${competencies[
          i % competencies.length
        ].toLowerCase()}. What is the correct answer?`,
        options: ["Option A", "Option B", "Option C", "Option D"],
        correctAnswer: i % 4,
        explanation: `This tests upper intermediate ${competencies[
          i % competencies.length
        ].toLowerCase()} skills.`,
        difficulty: "medium",
        category: competencies[i % competencies.length],
        isActive: true,
        createdBy: adminUser._id,
      });
    }

    // Step 3: C1-C2 (30 questions)
    for (let i = 0; i < 15; i++) {
      questions.push({
        competency: competencies[i % competencies.length],
        level: "C1",
        step: 3,
        question: `C1 Level Question ${
          i + 1
        }: This is an advanced level question about ${competencies[
          i % competencies.length
        ].toLowerCase()}. What is the correct answer?`,
        options: ["Option A", "Option B", "Option C", "Option D"],
        correctAnswer: i % 4,
        explanation: `This tests advanced ${competencies[
          i % competencies.length
        ].toLowerCase()} skills.`,
        difficulty: "hard",
        category: competencies[i % competencies.length],
        isActive: true,
        createdBy: adminUser._id,
      });
    }

    for (let i = 0; i < 15; i++) {
      questions.push({
        competency: competencies[i % competencies.length],
        level: "C2",
        step: 3,
        question: `C2 Level Question ${
          i + 1
        }: This is a proficient level question about ${competencies[
          i % competencies.length
        ].toLowerCase()}. What is the correct answer?`,
        options: ["Option A", "Option B", "Option C", "Option D"],
        correctAnswer: i % 4,
        explanation: `This tests proficient ${competencies[
          i % competencies.length
        ].toLowerCase()} skills.`,
        difficulty: "hard",
        category: competencies[i % competencies.length],
        isActive: true,
        createdBy: adminUser._id,
      });
    }

    // Insert all questions
    await Question.insertMany(questions);

    // Get final statistics
    const totalQuestions = await Question.countDocuments();
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

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${totalQuestions} questions`,
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
    console.error("Bulk seed questions error:", error);
    return NextResponse.json(
      {
        message: "Failed to seed questions",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
