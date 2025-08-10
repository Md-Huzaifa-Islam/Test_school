import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const password = "admin123";

    // Test different hashing methods
    const salt = await bcrypt.genSalt(10);
    const hash1 = await bcrypt.hash(password, salt);
    const hash2 = await bcrypt.hash(password, 10);
    const hash3 = await bcrypt.hash(password, 12);

    // Test comparisons
    const test1 = await bcrypt.compare(password, hash1);
    const test2 = await bcrypt.compare(password, hash2);
    const test3 = await bcrypt.compare(password, hash3);

    return NextResponse.json({
      success: true,
      data: {
        password,
        hash1: hash1.substring(0, 20) + "...",
        hash2: hash2.substring(0, 20) + "...",
        hash3: hash3.substring(0, 20) + "...",
        test1,
        test2,
        test3,
        bcryptVersion: "bcryptjs@3.0.2",
      },
    });
  } catch (error) {
    console.error("Hash test error:", error);
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
