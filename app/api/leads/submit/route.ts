import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthenticatedUser } from "@/lib/auth";
import { sendNewLeadAlertToOwner } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    const { siteId: siteIdentifier, name, email, phone, message } = await req.json();

    if (!name || (!email && !phone)) {
      return NextResponse.json(
        { error: "Name and at least one contact method (Email or Phone) are required." },
        { status: 400 }
      );
    }

    let site = null;

    if (
      siteIdentifier &&
      siteIdentifier !== "starkora-app.vercel.app" &&
      siteIdentifier !== "starkora.website" &&
      siteIdentifier !== "localhost" &&
      !siteIdentifier.includes("localhost:")
    ) {
      site = await db.findSiteByIdentifier(siteIdentifier);
    }

    if (!site) {
      const session = await getAuthenticatedUser();
      if (session) {
        const userSites = await db.findSitesByUserId(session.userId);
        if (userSites.length > 0) {
          site = userSites[0];
        }
      }
    }

    if (!site) {
      site = await db.findLatestSite();
    }

    if (!site) {
      return NextResponse.json(
        { error: "Could not associate inquiry with an active website." },
        { status: 404 }
      );
    }

    // Lead quota enforcement for free tier
    if (site.subscriptionStatus !== "active") {
      const currentMonthlyLeads = await db.countMonthlyLeadsBySiteId(site.id);
      if (currentMonthlyLeads >= 10) {
        return NextResponse.json(
          {
            error:
              "This business has reached its monthly inquiry limit on the Free Plan. Please reach out to them directly.",
          },
          { status: 429 }
        );
      }
    }

    const lead = await db.createLead({
      siteId: site.id,
      name,
      phone: phone || "",
      email: email || "",
      message: message || "General inquiry from website",
    });

    // Notify site owner via email with direct Reply-To configuration
    const owner = await db.findUserById(site.userId);
    if (owner && owner.email) {
      sendNewLeadAlertToOwner({
        ownerEmail: owner.email,
        siteName: site.name,
        leadName: name,
        leadEmail: email || undefined,
        leadPhone: phone || undefined,
        message: message || "Interested in your services",
      });
    }

    return NextResponse.json({ success: true, lead });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to record inquiry." },
      { status: 500 }
    );
  }
}