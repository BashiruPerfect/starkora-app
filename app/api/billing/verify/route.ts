import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthenticatedUser } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const reference = searchParams.get("reference");
    const siteId = searchParams.get("siteId");
    const plan = (searchParams.get("plan") as "monthly" | "annual") || "monthly";
    const isSimulated = searchParams.get("simulated") === "true";

    if (!reference || !siteId) {
      return NextResponse.redirect(new URL("/dashboard?error=invalid_payment_params", req.url));
    }

    const session = await getAuthenticatedUser();
    if (!session) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    let isSuccess = false;

    if (isSimulated) {
      isSuccess = true;
    } else {
      const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;
      if (paystackSecretKey) {
        const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
          headers: { Authorization: `Bearer ${paystackSecretKey}` },
        });
        const verifyData = await verifyRes.json();
        isSuccess = verifyData.status && verifyData.data.status === "success";
      }
    }

    if (isSuccess) {
      await db.recordSubscription({
        userId: session.userId,
        siteId,
        reference,
        plan,
        amount: plan === "annual" ? 110 : 10,
        currency: "USD",
        status: "success",
      });

      return NextResponse.redirect(new URL("/dashboard?billing=success", req.url));
    }

    return NextResponse.redirect(new URL("/dashboard?billing=failed", req.url));
  } catch (error) {
    return NextResponse.redirect(new URL("/dashboard?billing=error", req.url));
  }
}