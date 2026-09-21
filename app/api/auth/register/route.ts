import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { createSessionToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { sendWelcomeEmail, sendAdminNewUserAlert } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    const { email, password, name, phone } = await req.json();

    if (!email || !password || password.length < 6) {
      return NextResponse.json(
        { error: "A valid email and a password of at least 6 characters are required." },
        { status: 400 }
      );
    }

    const existingUser = await db.findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: "An account with that email address already exists." },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await db.createUser({
      email,
      passwordHash,
      name: name || undefined,
      phone: phone || undefined,
    });

    const token = await createSessionToken({
      userId: user.id,
      email: user.email,
    });

    const cookieStore = await cookies();
    cookieStore.set("starkora_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    // 1. Send founder welcome email to the newly registered customer
    sendWelcomeEmail(user.email, user.name || "");

    // 2. Send admin alert with email, name, and phone (clears compiler warning)
    sendAdminNewUserAlert(user.email, user.name || "", user.phone || "");

    return NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, name: user.name, phone: user.phone },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Registration failed." },
      { status: 500 }
    );
  }
}