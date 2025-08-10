import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { generateTokens } from "@/lib/jwt";
import { RegisterRequest, AuthResponse } from "@/types/api";
import emailService from "@/lib/email";
import { generateVerificationCode, hashToken } from "@/lib/auth-utils";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body: RegisterRequest = await request.json();
    const { firstName, lastName, email, password, role = "student" } = body;

    // Validate input
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        {
          success: false,
          message: "Password must be at least 8 characters long",
        },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Generate email verification OTP
    const { code: verificationOTP, expiresAt: otpExpires } =
      generateVerificationCode(6, 10); // 6-digit OTP, expires in 10 minutes

    // Create new user (not verified initially)
    const user = new User({
      firstName,
      lastName,
      email,
      password,
      role,
      isEmailVerified: false,
      emailVerificationOTP: verificationOTP,
      emailVerificationOTPExpires: otpExpires,
    });

    await user.save();

    // Send verification email
    try {
      await emailService.sendOTP(email, verificationOTP);
      console.log(`Verification OTP sent to ${email}: ${verificationOTP}`);
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);
      // Continue with registration even if email fails
    }

    // Generate tokens (user can still get tokens but won't be able to access protected routes until verified)
    const { accessToken, refreshToken } = generateTokens({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    // Save refresh token to user
    user.refreshTokens.push(refreshToken);
    await user.save();

    const response: AuthResponse = {
      success: true,
      user: {
        id: user._id.toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        currentLevel: user.currentLevel,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      },
      accessToken,
      refreshToken,
      message:
        "Registration successful! Please check your email for verification code.",
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error: any) {
    console.error("Register API error:", error);

    // Handle MongoDB validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(
        (err: any) => err.message
      );
      return NextResponse.json(
        { success: false, message: messages.join(", ") },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
