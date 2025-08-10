import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Check if admin user exists
    const adminUser = await User.findOne({ email: "admin@testschool.com" });

    if (adminUser) {
      return NextResponse.json({
        success: true,
        message: "Admin user exists",
        admin: {
          email: adminUser.email,
          firstName: adminUser.firstName,
          lastName: adminUser.lastName,
          role: adminUser.role,
          isEmailVerified: adminUser.isEmailVerified,
          createdAt: adminUser.createdAt,
        },
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "Admin user does not exist",
        admin: null,
      });
    }
  } catch (error) {
    console.error("Admin check error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: "admin@testschool.com" });

    if (existingAdmin) {
      return NextResponse.json({
        success: true,
        message: "Admin user already exists",
        admin: {
          email: existingAdmin.email,
          firstName: existingAdmin.firstName,
          lastName: existingAdmin.lastName,
          role: existingAdmin.role,
        },
      });
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash("admin123", 12);

    const adminUser = new User({
      firstName: "System",
      lastName: "Admin",
      email: "admin@testschool.com",
      password: hashedPassword,
      role: "admin",
      isEmailVerified: true,
    });

    await adminUser.save();

    return NextResponse.json({
      success: true,
      message: "Admin user created successfully",
      admin: {
        email: adminUser.email,
        firstName: adminUser.firstName,
        lastName: adminUser.lastName,
        role: adminUser.role,
      },
    });
  } catch (error) {
    console.error("Admin creation error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
