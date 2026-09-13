import { NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const paystackSignature = req.headers.get("x-paystack-signature");
    const secretKey = process.env.PAYSTACK_SECRET_KEY;

    // 1. Verify Cryptographic Signature
    if (secretKey && paystackSignature) {
      const hash = crypto
        .createHmac("sha512", secretKey)
        .update(rawBody)
        .digest("hex");

      if (hash !== paystackSignature) {
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
      }
    }

    const payload = JSON.parse(rawBody);
    const { event, data } = payload;

    // 2. Handle Specific Paystack Subscription Events
    switch (event) {
      case "charge.success": {
        // Recurring charge succeeded: extend subscription
        const siteId = data.metadata?.siteId;
        const userId = data.metadata?.userId;
        const plan = (data.metadata?.interval as "monthly" | "annual") || "monthly";

        if (siteId && userId) {
          await db.recordSubscription({
            userId,
            siteId,
            reference: data.reference,
            plan,
            amount: data.amount / 100, // Convert minor kobo back to standard unit
            currency: data.currency || "NGN",
            status: "success",
          });
        }
        break;
      }

      case "invoice.payment_failed": {
        // Recurring card charge failed (expired card / insufficient funds)
        const siteId = data.metadata?.siteId;
        if (siteId) {
          // You can downgrade or flag the site in the database
          console.warn(`Payment failed for site ID: ${siteId}. Card debited unsuccessfully.`);
        }
        break;
      }

      case "subscription.disable": {
        // Customer manually cancelled subscription via bank or Paystack portal
        console.info(`Subscription disabled: ${data.subscription_code}`);
        break;
      }

      default:
        // Ignore unhandled informational events
        break;
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Webhook processing failed" },
      { status: 500 }
    );
  }
}