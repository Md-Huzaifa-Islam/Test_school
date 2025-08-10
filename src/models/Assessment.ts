import mongoose, { Document, Schema } from "mongoose";
import { CompetencyLevel } from "@/types/api";

export interface IAssessment extends Document {
  _id: string;
  userId: string;
  step: 1 | 2 | 3;
  levels: CompetencyLevel[];
  questions: string[];
  answers: {
    questionId: string;
    selectedAnswer: number;
    isCorrect: boolean;
  }[];
  score: number;
  percentage: number;
  achievedLevel?: CompetencyLevel;
  status: "pending" | "in_progress" | "completed" | "expired";
  startedAt?: Date;
  completedAt?: Date;
  timeLimit: number; // in minutes
  remainingTime?: number; // in seconds
  canProceedToNext: boolean;
  certificateGenerated: boolean;
  supervisorReview?: {
    reviewedBy: string;
    reviewedAt: Date;
    approved: boolean;
    comments: string;
    certificateIssued: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const assessmentSchema = new Schema<IAssessment>(
  {
    userId: {
      type: String,
      required: true,
      ref: "User",
    },
    step: {
      type: Number,
      required: true,
      enum: [1, 2, 3],
    },
    levels: [
      {
        type: String,
        enum: ["A1", "A2", "B1", "B2", "C1", "C2"],
        required: true,
      },
    ],
    questions: [
      {
        type: String,
        ref: "Question",
        required: true,
      },
    ],
    answers: [
      {
        questionId: {
          type: String,
          required: true,
        },
        selectedAnswer: {
          type: Number,
          required: true,
        },
        isCorrect: {
          type: Boolean,
          required: true,
        },
      },
    ],
    score: {
      type: Number,
      default: 0,
    },
    percentage: {
      type: Number,
      default: 0,
    },
    achievedLevel: {
      type: String,
      enum: ["A1", "A2", "B1", "B2", "C1", "C2"],
    },
    status: {
      type: String,
      enum: ["pending", "in_progress", "completed", "expired"],
      default: "pending",
    },
    startedAt: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
    timeLimit: {
      type: Number,
      default: 44, // 44 minutes for 44 questions (1 minute per question)
    },
    remainingTime: {
      type: Number,
    },
    canProceedToNext: {
      type: Boolean,
      default: false,
    },
    certificateGenerated: {
      type: Boolean,
      default: false,
    },
    supervisorReview: {
      reviewedBy: {
        type: String,
        ref: "User",
      },
      reviewedAt: {
        type: Date,
      },
      approved: {
        type: Boolean,
      },
      comments: {
        type: String,
      },
      certificateIssued: {
        type: Boolean,
        default: false,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
assessmentSchema.index({ userId: 1, step: 1 });
assessmentSchema.index({ status: 1 });
assessmentSchema.index({ createdAt: -1 });

export default mongoose.models.Assessment ||
  mongoose.model<IAssessment>("Assessment", assessmentSchema);
