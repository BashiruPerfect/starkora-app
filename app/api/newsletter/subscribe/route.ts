import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { siteId: identifier, email } = await req.json();

    if (!identifier || !email) {
      return NextResponse.json(
        { error: "Site identifier and valid email are required." },
        { status: 400 }
      );
    }

    const site = await db.findSiteByIdentifier(identifier);
    if (!site) {
      return NextResponse.json({ error: "Active site not found." }, { status: 404 });
    }

    await db.addSubscriber(site.id, email);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to record subscription." },
      { status: 500 }
    );
  }
}