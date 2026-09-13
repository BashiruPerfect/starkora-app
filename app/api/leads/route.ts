import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await getAuthenticatedUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const leads = await db.findLeadsByUserId(session.userId);
    return NextResponse.json({ leads });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to retrieve leads" },
      { status: 500 }
    );
  }
}