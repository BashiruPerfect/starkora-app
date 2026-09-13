import { NextResponse } from "next/server";
import { db } from "../../../../lib/db";
import bcrypt from "bcryptjs";
import { createSessionToken } from "../../../../lib/auth";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const existingUser = await db.findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await db.createUser({
      email,
      passwordHash,
      name: name || email.split("@")[0],
    });

    const token = await createSessionToken({ userId: user.id, email: user.email });
    const cookieStore = await cookies();
    cookieStore.set("starkora_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    return NextResponse.json({ user: { id: user.id, email: user.email, name: user.name } });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Registration failed." }, { status: 500 });
  }
}