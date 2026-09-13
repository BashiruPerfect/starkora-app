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
      return NextResponse.json({ error: "Site ID and valid billing interval are required." }, { status: 400 });
    }

    const site = await db.findSiteById(siteId, session.userId);
    if (!site) {
      return NextResponse.json({ error: "Site not found" }, { status: 404 });
    }

    // Pricing calculation:
    // Monthly: $10 USD or ₦15,000 NGN (1,500,000 kobo)
    // Annual: $110 USD or ₦165,000 NGN (16,500,000 kobo) — 1 Month Free Discount
    const amountInMinorUnits =
      currency === "USD"
        ? interval === "annual" ? 11000 : 1000
        : interval === "annual" ? 16500000 : 1500000;

    const reference = `stk_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;

    // 1. If Paystack API key is configured, initialize live transaction with Paystack
    if (paystackSecretKey) {
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
        return NextResponse.json({ error: paystackData.message || "Paystack initialization failed" }, { status: 400 });
      }

      return NextResponse.json({
        authorizationUrl: paystackData.data.authorization_url,
        reference,
      });
    }

    // 2. Local Simulation Mode (when PAYSTACK_SECRET_KEY is not set)
    // Allows instant local verification and testing without network payment gateway requirements
    const simulatedRedirect = `/api/billing/verify?reference=${reference}&siteId=${siteId}&plan=${interval}&simulated=true`;

    return NextResponse.json({
      authorizationUrl: simulatedRedirect,
      reference,
      simulated: true,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to initialize billing" }, { status: 500 });
  }
}