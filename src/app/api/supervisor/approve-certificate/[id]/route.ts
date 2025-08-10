import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/mongodb";
import Assessment from "@/models/Assessment";
import User from "@/models/User";
import Certificate from "@/models/Certificate";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get("authorization");
    const { approved, comments } = await request.json();

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
        role: string;
      };
    } catch (error) {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // Check if user is supervisor or admin
    if (!["supervisor", "admin"].includes(decoded.role)) {
      return NextResponse.json(
        { message: "Supervisor or admin access required" },
        { status: 403 }
      );
    }

    if (typeof approved !== "boolean") {
      return NextResponse.json(
        { message: "Approved status (boolean) is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const assessment = await Assessment.findById(params.id).populate("userId");
    if (!assessment) {
      return NextResponse.json(
        { message: "Assessment not found" },
        { status: 404 }
      );
    }

    if (assessment.status !== "completed" || !assessment.achievedLevel) {
      return NextResponse.json(
        { message: "Assessment must be completed with achieved level" },
        { status: 400 }
      );
    }

    if (assessment.certificateGenerated) {
      return NextResponse.json(
        { message: "Certificate already processed for this assessment" },
        { status: 400 }
      );
    }

    // Update assessment with supervisor review
    assessment.supervisorReview = {
      reviewedBy: decoded.userId,
      reviewedAt: new Date(),
      approved: approved,
      comments: comments || "",
      certificateIssued: approved,
    };
    assessment.certificateGenerated = true;

    await assessment.save();

    let certificate = null;

    if (approved) {
      // Generate certificate
      const user = assessment.userId as any;

      certificate = new Certificate({
        userId: user._id,
        assessmentId: assessment._id,
        level: assessment.achievedLevel,
        step: assessment.step,
        score: assessment.percentage,
        competencies: ["Digital Competency"], // This could be expanded
        supervisorApproval: {
          approvedBy: decoded.userId,
          approvedAt: new Date(),
          comments: comments || "",
        },
      });

      await certificate.save();

      // Update user's assessment history with certificate ID
      const userDoc = await User.findById(user._id);
      if (userDoc) {
        const historyEntry = userDoc.assessmentHistory.find(
          (h: any) =>
            h.step === assessment.step && h.level === assessment.achievedLevel
        );
        if (historyEntry) {
          historyEntry.certificateId = certificate._id.toString();
          await userDoc.save();
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        assessmentId: assessment._id,
        approved: approved,
        certificateGenerated: approved,
        certificateId: certificate?._id,
        reviewedBy: decoded.userId,
        reviewedAt: new Date(),
      },
      message: `Assessment ${
        approved ? "approved and certificate issued" : "rejected"
      }`,
    });
  } catch (error) {
    console.error("Certificate approval API error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
