import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "../../../../lib/auth";
import { db } from "../../../../lib/db";

export async function GET() {
  const session = await getAuthenticatedUser();
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const user = await db.findUserById(session.userId);
  if (!user) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user: { id: user.id, email: user.email, name: user.name },
  });
}