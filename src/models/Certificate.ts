import mongoose, { Document, Schema } from "mongoose";
import { CompetencyLevel } from "@/types/api";

export interface ICertificate extends Document {
  userId: mongoose.Types.ObjectId;
  level: CompetencyLevel;
  certificateNumber: string;
  competencies: string[];
  score: number;
  assessmentId: mongoose.Types.ObjectId;
  step: number;
  issuedAt: Date;
  validUntil?: Date;
  isRevoked: boolean;
  revokedAt?: Date;
  revokedReason?: string;
  supervisorApproval: {
    approvedBy: mongoose.Types.ObjectId;
    approvedAt: Date;
    comments?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const certificateSchema = new Schema<ICertificate>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    level: {
      type: String,
      required: [true, "Level is required"],
      enum: ["A1", "A2", "B1", "B2", "C1", "C2"],
    },
    certificateNumber: {
      type: String,
      required: true,
      unique: true,
    },
    competencies: [
      {
        type: String,
        required: true,
      },
    ],
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    assessmentId: {
      type: Schema.Types.ObjectId,
      ref: "Assessment",
      required: true,
    },
    step: {
      type: Number,
      required: true,
      enum: [1, 2, 3],
    },
    issuedAt: {
      type: Date,
      default: Date.now,
    },
    validUntil: Date,
    isRevoked: {
      type: Boolean,
      default: false,
    },
    revokedAt: Date,
    revokedReason: String,
    supervisorApproval: {
      approvedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      approvedAt: {
        type: Date,
        required: true,
        default: Date.now,
      },
      comments: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
certificateSchema.index({ userId: 1 });
certificateSchema.index({ level: 1 });
certificateSchema.index({ certificateNumber: 1 });
certificateSchema.index({ issuedAt: -1 });
certificateSchema.index({ isRevoked: 1 });

// Generate certificate number before saving
certificateSchema.pre("save", function (next) {
  if (!this.certificateNumber) {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    this.certificateNumber =
      `TS-${this.level}-${timestamp}-${random}`.toUpperCase();
  }
  next();
});

// Virtual to check if certificate is valid
certificateSchema.virtual("isValid").get(function () {
  if (this.isRevoked) return false;
  if (this.validUntil && this.validUntil < new Date()) return false;
  return true;
});

const Certificate =
  mongoose.models.Certificate ||
  mongoose.model<ICertificate>("Certificate", certificateSchema);

export default Certificate;
