import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();

    const { email } = await request.json();

    // Delete user
    const result = await User.deleteOne({ email });

    return NextResponse.json({
      success: true,
      message: `User deleted. Deleted count: ${result.deletedCount}`,
      data: { deletedCount: result.deletedCount },
    });
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete user",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
