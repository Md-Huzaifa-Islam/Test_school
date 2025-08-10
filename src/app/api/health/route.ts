import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";

export async function GET(request: NextRequest) {
  try {
    // Test database connection
    await connectDB();

    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      version: process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0",
      database: "connected",
    });
  } catch (error) {
    console.error("Health check failed:", error);
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: "Database connection failed",
      },
      { status: 500 }
    );
  }
}
