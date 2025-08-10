import mongoose, { Document, Schema } from "mongoose";
import { CompetencyLevel, AssessmentStep } from "@/types/api";

export interface IQuestion extends Document {
  competency: string;
  level: CompetencyLevel;
  step: AssessmentStep;
  question: string;
  options: string[];
  correctAnswer: number | string; // Support both index and string answers
  explanation?: string;
  difficulty: "easy" | "medium" | "hard";
  category?: string;
  tags?: string[];
  isActive: boolean;
  createdBy: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const questionSchema = new Schema<IQuestion>(
  {
    competency: {
      type: String,
      required: [true, "Competency is required"],
      trim: true,
    },
    level: {
      type: String,
      required: [true, "Level is required"],
      enum: ["A1", "A2", "B1", "B2", "C1", "C2"],
    },
    step: {
      type: Number,
      required: [true, "Step is required"],
      enum: [1, 2, 3],
    },
    question: {
      type: String,
      required: [true, "Question text is required"],
      trim: true,
      maxlength: [1000, "Question cannot exceed 1000 characters"],
    },
    options: {
      type: [String],
      required: [true, "Options are required"],
      validate: {
        validator: function (options: string[]) {
          return options.length >= 2 && options.length <= 6;
        },
        message: "Question must have between 2 and 6 options",
      },
    },
    correctAnswer: {
      type: Schema.Types.Mixed, // Support both number and string
      required: [true, "Correct answer is required"],
      validate: {
        validator: function (value: any) {
          if (typeof value === "number") {
            return value >= 0 && value < this.options.length;
          }
          if (typeof value === "string") {
            return this.options.includes(value);
          }
          return false;
        },
        message: "Correct answer must be a valid option index or option text",
      },
    },
    explanation: {
      type: String,
      trim: true,
      maxlength: [500, "Explanation cannot exceed 500 characters"],
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
    category: {
      type: String,
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
questionSchema.index({ competency: 1, level: 1, step: 1 });
questionSchema.index({ difficulty: 1 });
questionSchema.index({ category: 1 });
questionSchema.index({ isActive: 1 });

// Ensure correct answer is within bounds
questionSchema.pre("save", function (next) {
  if (typeof this.correctAnswer === "number") {
    if (this.correctAnswer >= this.options.length) {
      next(new Error("Correct answer index is out of bounds"));
    } else {
      next();
    }
  } else if (typeof this.correctAnswer === "string") {
    if (!this.options.includes(this.correctAnswer)) {
      next(new Error("Correct answer text not found in options"));
    } else {
      next();
    }
  } else {
    next(new Error("Correct answer must be a number or string"));
  }
});

const Question =
  mongoose.models.Question ||
  mongoose.model<IQuestion>("Question", questionSchema);

export default Question;
