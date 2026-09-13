import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "../../../../lib/auth";
import { db } from "../../../../lib/db";

export async function POST(req: Request) {
  try {
    const session = await getAuthenticatedUser();
    if (!session) {
      return NextResponse.json(
        { error: "You must be logged in to save to the database." },
        { status: 401 }
      );
    }

    const { siteId, name, layoutData } = await req.json();
    if (!layoutData) {
      return NextResponse.json({ error: "Layout data is required." }, { status: 400 });
    }

    const serializedData = typeof layoutData === "string" ? layoutData : JSON.stringify(layoutData);
    const site = await db.saveSite(session.userId, name || "My Site", serializedData, siteId);

    return NextResponse.json({ success: true, site });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to persist site." }, { status: 500 });
  }
}