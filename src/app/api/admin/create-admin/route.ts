import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const {
      email,
      password,
      firstName = "Admin",
      lastName = "User",
    } = await request.json();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists with this email" },
        { status: 400 }
      );
    }

    // Create admin user (password will be hashed by the pre-save hook)
    const adminUser = new User({
      firstName,
      lastName,
      email,
      password, // Don't hash here, let the model do it
      role: "admin",
      isEmailVerified: true,
      currentStep: 1,
      completedSteps: [],
      canRetake: true,
      assessmentHistory: [],
    });

    await adminUser.save();

    return NextResponse.json({
      success: true,
      message: "Admin user created successfully",
      data: {
        id: adminUser._id,
        email: adminUser.email,
        role: adminUser.role,
        firstName: adminUser.firstName,
        lastName: adminUser.lastName,
      },
    });
  } catch (error) {
    console.error("Create admin error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create admin user",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
