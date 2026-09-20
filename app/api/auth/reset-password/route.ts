import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    if (!token || !password || password.length < 6) {
      return NextResponse.json(
        { error: "A valid reset token and a password of at least 6 characters are required." },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const success = await db.verifyAndConsumeResetToken(token, passwordHash);

    if (!success) {
      return NextResponse.json(
        { error: "This password reset link is invalid or has expired. Please request a new one." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Your password has been updated successfully. You can now log in.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to reset password." },
      { status: 500 }
    );
  }
}