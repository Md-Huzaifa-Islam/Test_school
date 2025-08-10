import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Find users with invalid roles and fix them
    const result = await User.updateMany(
      { role: { $in: ["Student", "Admin", "Supervisor"] } },
      [
        {
          $set: {
            role: {
              $switch: {
                branches: [
                  { case: { $eq: ["$role", "Student"] }, then: "student" },
                  { case: { $eq: ["$role", "Admin"] }, then: "admin" },
                  {
                    case: { $eq: ["$role", "Supervisor"] },
                    then: "supervisor",
                  },
                ],
                default: "$role",
              },
            },
          },
        },
      ]
    );

    return NextResponse.json({
      success: true,
      message: "User roles fixed successfully",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Fix roles error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
