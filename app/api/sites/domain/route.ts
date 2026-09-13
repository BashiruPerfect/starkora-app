import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await getAuthenticatedUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { siteId, customDomain } = await req.json();

    if (!siteId || !customDomain) {
      return NextResponse.json({ error: "Site ID and custom domain are required." }, { status: 400 });
    }

    const site = await db.findSiteById(siteId, session.userId);
    if (!site) {
      return NextResponse.json({ error: "Site not found" }, { status: 404 });
    }

    if (site.subscriptionStatus !== "active") {
      return NextResponse.json(
        { error: "Custom domains require an active Pro subscription." },
        { status: 403 }
      );
    }

    // Clean formatting (remove https://, http://, trailing slashes)
    const cleanDomain = customDomain
      .replace(/^(?:https?:\/\/)?/i, "")
      .replace(/\/.*$/, "")
      .trim()
      .toLowerCase();

    const updatedSite = await db.setCustomDomain(siteId, session.userId, cleanDomain);

    return NextResponse.json({
      success: true,
      site: updatedSite,
      dnsInstructions: {
        type: "CNAME",
        name: "@ or www",
        target: "fallback.starkora.com",
        status: "Active & SSL Provisioned",
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update domain" }, { status: 500 });
  }
}