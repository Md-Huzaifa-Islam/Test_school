import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/mongodb";
import Certificate from "@/models/Certificate";
import User from "@/models/User";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    const { id } = await params;

    // Find certificate by ID, certificate number, or assessment ID
    let certificate;
    if (id.length === 24) {
      // Could be ObjectId format - try all possibilities
      certificate =
        (await Certificate.findById(id)) ||
        (await Certificate.findOne({ assessmentId: id }));
    } else {
      // Certificate number format
      certificate = await Certificate.findOne({ certificateNumber: id });
    }

    if (!certificate) {
      return NextResponse.json(
        { message: "Certificate not found" },
        { status: 404 }
      );
    }

    // Check if user owns this certificate or is admin/supervisor
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const canView =
      certificate.userId === decoded.userId ||
      user.role === "admin" ||
      user.role === "supervisor";

    if (!canView) {
      return NextResponse.json({ message: "Access denied" }, { status: 403 });
    }

    // Get certificate owner info
    const certificateOwner = await User.findById(certificate.userId);

    return NextResponse.json({
      success: true,
      data: {
        _id: certificate._id,
        certificateNumber: certificate.certificateNumber,
        userId: certificate.userId,
        level: certificate.level,
        assessmentId: certificate.assessmentId,
        issuedDate: certificate.issuedDate,
        validUntil: certificate.validUntil,
        status: certificate.status,
        user: {
          name: certificateOwner?.name || "Unknown",
          email: certificateOwner?.email || "Unknown",
        },
      },
    });
  } catch (error) {
    console.error("Get certificate API error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
