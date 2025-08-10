import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { email, password } = await request.json();

    // Find user with password
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return NextResponse.json({
        success: false,
        message: "User not found",
      });
    }

    // Test direct bcrypt comparison
    const directComparison = await bcrypt.compare(password, user.password);

    // Test method comparison
    const methodComparison = await user.comparePassword(password);

    return NextResponse.json({
      success: true,
      data: {
        userFound: true,
        hasPassword: !!user.password,
        passwordLength: user.password.length,
        directBcryptComparison: directComparison,
        methodComparison: methodComparison,
        passwordHash: user.password.substring(0, 20) + "...",
        testPassword: password,
      },
    });
  } catch (error) {
    console.error("Debug login error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Test failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
