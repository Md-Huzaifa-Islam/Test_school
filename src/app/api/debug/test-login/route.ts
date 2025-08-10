import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

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

    // Test password comparison
    const isPasswordValid = await user.comparePassword(password);

    return NextResponse.json({
      success: true,
      data: {
        userFound: true,
        hasPassword: !!user.password,
        passwordLength: user.password.length,
        isPasswordValid,
        isVerified: user.isEmailVerified,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Test login error:", error);
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
