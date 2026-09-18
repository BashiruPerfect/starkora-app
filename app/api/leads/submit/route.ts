import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthenticatedUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { siteId: siteIdentifier, name, phone, email, message } = await req.json();

    if (!name || !phone) {
      return NextResponse.json(
        { error: "Name and Phone number are required." },
        { status: 400 }
      );
    }

    let site = null;

    // 1. Direct identifier lookup (if not the root platform hostname)
    if (
      siteIdentifier &&
      siteIdentifier !== "starkora-app.vercel.app" &&
      siteIdentifier !== "localhost" &&
      !siteIdentifier.includes("localhost:")
    ) {
      site = await db.findSiteByIdentifier(siteIdentifier);
    }

    // 2. Fallback: If submitted from editor/preview on starkora-app.vercel.app, resolve via session
    if (!site) {
      const session = await getAuthenticatedUser();
      if (session) {
        const userSites = await db.findSitesByUserId(session.userId);
        if (userSites.length > 0) {
          site = userSites[0];
        }
      }
    }

    // 3. Fallback: Resolve to the latest active site in the database
    if (!site) {
      site = await db.findLatestSite();
    }

    if (!site) {
      return NextResponse.json(
        { error: "Could not associate lead with an active website." },
        { status: 404 }
      );
    }

    // TIER ENFORCEMENT: Free tier is capped at 10 leads per calendar month
    if (site.subscriptionStatus !== "active") {
      const currentMonthlyLeads = await db.countMonthlyLeadsBySiteId(site.id);
      if (currentMonthlyLeads >= 10) {
        return NextResponse.json(
          {
            error:
              "This business has reached its monthly inquiry limit on the Free Plan. Please reach out to them directly via WhatsApp or phone.",
          },
          { status: 429 }
        );
      }
    }

    const lead = await db.createLead({
      siteId: site.id,
      name,
      phone,
      email: email || "",
      message: message || "General inquiry from website",
    });

    return NextResponse.json({ success: true, lead });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to record inquiry." },
      { status: 500 }
    );
  }
}