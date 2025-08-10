import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { generateTokens } from "@/lib/jwt";
import { LoginRequest, AuthResponse } from "@/types/api";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body: LoginRequest = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find user and include password
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    // Save refresh token to user
    user.refreshTokens.push(refreshToken);
    user.lastLogin = new Date();
    await user.save();

    // Remove password from response
    const userResponse = user.toJSON();

    const response: AuthResponse = {
      success: true,
      user: {
        id: userResponse._id,
        firstName: userResponse.firstName,
        lastName: userResponse.lastName,
        email: userResponse.email,
        role: userResponse.role,
        currentLevel: userResponse.currentLevel,
        createdAt: userResponse.createdAt,
        updatedAt: userResponse.updatedAt,
      },
      accessToken,
      refreshToken,
      message: "Login successful",
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
