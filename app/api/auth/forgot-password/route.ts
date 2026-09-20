import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendPasswordResetEmail } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const user = await db.findUserByEmail(email);
    if (user) {
      const resetToken = await db.createPasswordResetToken(user.id);
      await sendPasswordResetEmail(user.email, resetToken);
    }

    // Always return success to prevent email enumeration attacks
    return NextResponse.json({
      success: true,
      message: "If that email address is registered, a password reset link has been dispatched.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to process password reset." },
      { status: 500 }
    );
  }
}