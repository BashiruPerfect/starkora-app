import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";
import { db } from "@/lib/db";

// GET /api/sites -> Fetch all sites for current logged-in user
export async function GET(req: Request) {
  try {
    const session = await getAuthenticatedUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const siteId = searchParams.get("id");

    if (siteId) {
      const site = await db.findSiteById(siteId, session.userId);
      if (!site) {
        return NextResponse.json({ error: "Site not found" }, { status: 404 });
      }
      return NextResponse.json({ site });
    }

    const sites = await db.findSitesByUserId(session.userId);
    return NextResponse.json({ sites });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to load sites" }, { status: 500 });
  }
}