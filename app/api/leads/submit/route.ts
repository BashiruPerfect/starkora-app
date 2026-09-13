import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { siteId: siteIdentifier, name, phone, email, message } = await req.json();

    if (!siteIdentifier || !name || !phone) {
      return NextResponse.json(
        { error: "Site identifier, Name, and Phone number are required." },
        { status: 400 }
      );
    }

    // 1. Resolve domain/subdomain/ID to the canonical database site record
    const site = await db.findSiteByIdentifier(siteIdentifier);
    if (!site) {
      return NextResponse.json(
        { error: `Could not associate lead with active site: ${siteIdentifier}` },
        { status: 404 }
      );
    }

    // 2. Persist the inquiry using the canonical site.id
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