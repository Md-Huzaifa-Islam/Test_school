import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import { CompetencyLevel } from "@/types/api";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "admin" | "student" | "supervisor";
  currentLevel?: CompetencyLevel;
  completedSteps: number[];
  canRetake: boolean;
  lastAssessmentDate?: Date;
  assessmentHistory: {
    step: number;
    score: number;
    level: CompetencyLevel;
    date: Date;
    certificateId?: string;
  }[];
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  emailVerificationOTP?: string;
  emailVerificationOTPExpires?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  refreshTokens: string[];
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      maxlength: [50, "First name cannot exceed 50 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      maxlength: [50, "Last name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },
    role: {
      type: String,
      enum: ["admin", "student", "supervisor"],
      default: "student",
    },
    currentLevel: {
      type: String,
      enum: ["A1", "A2", "B1", "B2", "C1", "C2"],
    },
    completedSteps: {
      type: [Number],
      default: [],
    },
    canRetake: {
      type: Boolean,
      default: true,
    },
    lastAssessmentDate: {
      type: Date,
    },
    assessmentHistory: [
      {
        step: {
          type: Number,
          required: true,
        },
        score: {
          type: Number,
          required: true,
        },
        level: {
          type: String,
          enum: ["A1", "A2", "B1", "B2", "C1", "C2"],
          required: true,
        },
        date: {
          type: Date,
          default: Date.now,
        },
        certificateId: {
          type: String,
        },
      },
    ],
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    emailVerificationOTP: String,
    emailVerificationOTPExpires: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    refreshTokens: [
      {
        type: String,
      },
    ],
    lastLogin: Date,
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.refreshTokens;
  delete userObject.emailVerificationToken;
  delete userObject.emailVerificationOTP;
  delete userObject.emailVerificationOTPExpires;
  delete userObject.passwordResetToken;
  delete userObject.passwordResetExpires;
  return userObject;
};

const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
