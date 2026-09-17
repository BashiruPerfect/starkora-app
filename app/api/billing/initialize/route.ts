import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await getAuthenticatedUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { siteId, interval, currency = "NGN" } = await req.json();

    if (!siteId || !["monthly", "annual"].includes(interval)) {
      return NextResponse.json(
        { error: "Site ID and valid billing interval are required." },
        { status: 400 }
      );
    }

    const site = await db.findSiteById(siteId, session.userId);
    if (!site) {
      return NextResponse.json({ error: "Site not found" }, { status: 404 });
    }

    // minor unit conversion: NGN in kobo (x100) or USD in cents (x100)
    const amountInMinorUnits =
      currency === "USD"
        ? interval === "annual"
          ? 11000
          : 1000
        : interval === "annual"
        ? 16500000
        : 1500000;

    const reference = `stk_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    // Sanitize key: strip accidental quotation marks, newlines, and trailing whitespace
    const rawSecretKey = process.env.PAYSTACK_SECRET_KEY || "";
    const paystackSecretKey = rawSecretKey.replace(/["']/g, "").trim();

    // 1. Live Paystack initialization if valid secret key (sk_test_ or sk_live_) is present
    if (paystackSecretKey && paystackSecretKey.startsWith("sk_")) {
      const response = await fetch("https://api.paystack.co/transaction/initialize", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${paystackSecretKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: session.email,
          amount: amountInMinorUnits,
          currency,
          reference,
          callback_url: `${new URL(req.url).origin}/api/billing/verify?siteId=${siteId}&plan=${interval}`,
          metadata: {
            userId: session.userId,
            siteId,
            interval,
          },
        }),
      });

      const paystackData = await response.json();
      if (!paystackData.status) {
        return NextResponse.json(
          { error: paystackData.message || "Paystack initialization failed" },
          { status: 400 }
        );
      }

      return NextResponse.json({
        authorizationUrl: paystackData.data.authorization_url,
        reference,
      });
    }

    // 2. Fallback simulation mode if key is missing or improperly configured
    const simulatedRedirect = `/api/billing/verify?reference=${reference}&siteId=${siteId}&plan=${interval}&simulated=true`;

    return NextResponse.json({
      authorizationUrl: simulatedRedirect,
      reference,
      simulated: true,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to initialize billing" },
      { status: 500 }
    );
  }
}