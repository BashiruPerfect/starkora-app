import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await getAuthenticatedUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { siteId, name, metaPixelId, googleAnalyticsId, faviconUrl } = await req.json();

    if (!siteId) {
      return NextResponse.json({ error: "Site ID is required." }, { status: 400 });
    }

    const updated = await db.updateSiteSettings(siteId, session.userId, {
      name,
      metaPixelId,
      googleAnalyticsId,
      faviconUrl,
    });

    if (!updated) {
      return NextResponse.json({ error: "Site not found or access denied." }, { status: 404 });
    }

    return NextResponse.json({ success: true, site: updated });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to update site settings." },
      { status: 500 }
    );
  }
}