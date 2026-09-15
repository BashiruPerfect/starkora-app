import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";
import { db } from "@/lib/db";
import dns from "dns/promises";

export async function POST(req: Request) {
  try {
    const session = await getAuthenticatedUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { siteId, domain } = await req.json();
    if (!siteId || !domain) {
      return NextResponse.json({ error: "Site ID and domain are required." }, { status: 400 });
    }

    const cleanDomain = domain
      .replace(/^(?:https?:\/\/)?/i, "")
      .replace(/\/.*$/, "")
      .trim()
      .toLowerCase();

    let isVerified = false;
    let detectedTarget = "None detected";

    try {
      // 1. Check CNAME record
      const cnames = await dns.resolveCname(cleanDomain);
      if (cnames && cnames.length > 0) {
        detectedTarget = cnames[0].toLowerCase();
        if (
          detectedTarget.includes("starkora") ||
          detectedTarget.includes("vercel") ||
          detectedTarget === "fallback.starkora.com"
        ) {
          isVerified = true;
        }
      }
    } catch {
      // 2. Fallback: Check A records (apex IPs)
      try {
        const ips = await dns.resolve4(cleanDomain);
        if (ips && ips.length > 0) {
          detectedTarget = ips.join(", ");
          if (ips.includes("76.76.21.21")) {
            isVerified = true;
          }
        }
      } catch {
        isVerified = false;
      }
    }

    await db.updateDomainVerification(siteId, session.userId, isVerified);

    return NextResponse.json({
      success: true,
      verified: isVerified,
      detectedTarget,
      message: isVerified
        ? "Domain successfully pointed and verified."
        : `DNS check completed: No active CNAME pointing to starkora detected for "${cleanDomain}". Please allow DNS propagation time.`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Internal DNS check failure" },
      { status: 500 }
    );
  }
}