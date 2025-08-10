import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Certificate from "@/models/Certificate";

export async function GET() {
  try {
    await connectDB();

    // Get count of certificates
    const totalCertificates = await Certificate.countDocuments();

    // Get all certificates
    const certificates = await Certificate.find({})
      .limit(10)
      .populate("userId", "name email");

    return NextResponse.json({
      success: true,
      data: {
        totalCertificates,
        certificates: certificates.map((cert) => ({
          _id: cert._id,
          certificateNumber: cert.certificateNumber,
          level: cert.level,
          userId: cert.userId,
          assessmentId: cert.assessmentId,
          issuedDate: cert.issuedDate,
          status: cert.status,
        })),
      },
    });
  } catch (error) {
    console.error("Check certificates error:", error);
    return NextResponse.json(
      {
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
