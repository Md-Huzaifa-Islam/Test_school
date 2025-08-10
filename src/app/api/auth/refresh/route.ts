import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { generateTokens, verifyRefreshToken } from "@/lib/jwt";
import { RefreshTokenRequest, AuthResponse } from "@/types/api";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body: RefreshTokenRequest = await request.json();
    const { refreshToken } = body;

    if (!refreshToken) {
      return NextResponse.json(
        { success: false, message: "Refresh token is required" },
        { status: 400 }
      );
    }

    // Verify refresh token
    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch (error) {
      return NextResponse.json(
        { success: false, message: "Invalid refresh token" },
        { status: 401 }
      );
    }

    // Find user and check if refresh token exists
    const user = await User.findById(payload.userId);
    if (!user || !user.refreshTokens.includes(refreshToken)) {
      return NextResponse.json(
        { success: false, message: "Invalid refresh token" },
        { status: 401 }
      );
    }

    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = generateTokens({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    // Remove old refresh token and add new one
    user.refreshTokens = user.refreshTokens.filter(
      (token: string) => token !== refreshToken
    );
    user.refreshTokens.push(newRefreshToken);
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
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      },
      accessToken,
      refreshToken: newRefreshToken,
      message: "Token refreshed successfully",
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Refresh token API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
