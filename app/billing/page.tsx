"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function BillingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const siteId = searchParams.get("siteId");

  const [interval, setInterval] = useState<"monthly" | "annual">("annual");
  const [loading, setLoading] = useState(false);
  const [siteName, setSiteName] = useState<string>("Your Website");

  useEffect(() => {
    if (!siteId) {
      router.push("/dashboard");
      return;
    }

    fetch(`/api/sites?id=${siteId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.site) setSiteName(data.site.name);
      });
  }, [siteId, router]);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/billing/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siteId, interval, currency: "NGN" }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed");

      if (data.authorizationUrl) {
        window.location.href = data.authorizationUrl;
      }
    } catch (err: any) {
      alert(err.message || "Failed to proceed to payment");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white font-sans flex flex-col items-center justify-center p-6">
      <div className="max-w-3xl w-full space-y-8">
        <div className="text-center space-y-3">
          <Link href="/dashboard" className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold">
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Upgrade <span className="text-indigo-400">{siteName}</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-lg mx-auto">
            Connect your custom domain, get automated SSL edge routing, and unlock high-converting AI marketing workflows.
          </p>

          {/* Billing Cycle Selector */}
          <div className="inline-flex items-center bg-slate-900 border border-slate-800 p-1.5 rounded-xl gap-2 mt-4">
            <button
              onClick={() => setInterval("monthly")}
              className={`px-5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition ${
                interval === "monthly" ? "bg-indigo-600 text-white shadow" : "text-slate-400 hover:text-white"
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setInterval("annual")}
              className={`px-5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition flex items-center gap-2 ${
                interval === "annual" ? "bg-indigo-600 text-white shadow" : "text-slate-400 hover:text-white"
              }`}
            >
              <span>Annual Billing</span>
              <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2 py-0.5 rounded-full">
                Save $10
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <div
            onClick={() => setInterval("monthly")}
            className={`cursor-pointer rounded-2xl p-6 border transition space-y-6 ${
              interval === "monthly"
                ? "bg-slate-900 border-indigo-500 shadow-xl ring-2 ring-indigo-500/20"
                : "bg-slate-900/50 border-slate-800 hover:border-slate-700"
            }`}
          >
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Pro Monthly</span>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black">$10</span>
                <span className="text-slate-400 text-sm">/ month (₦15,000)</span>
              </div>
              <p className="text-xs text-slate-400">Flexible monthly subscription. Cancel anytime.</p>
            </div>

            <ul className="text-xs text-slate-300 space-y-2.5">
              <li className="flex items-center gap-2">✓ Custom Domain Connectivity</li>
              <li className="flex items-center gap-2">✓ Global Anycast Edge Routing (&lt; 50ms TTFB)</li>
              <li className="flex items-center gap-2">✓ Automated SSL / TLS Certificates</li>
              <li className="flex items-center gap-2">✓ WhatsApp & Email Lead Integrations</li>
            </ul>
          </div>

          <div
            onClick={() => setInterval("annual")}
            className={`cursor-pointer rounded-2xl p-6 border transition space-y-6 relative ${
              interval === "annual"
                ? "bg-slate-900 border-indigo-500 shadow-xl ring-2 ring-indigo-500/20"
                : "bg-slate-900/50 border-slate-800 hover:border-slate-700"
            }`}
          >
            <span className="absolute -top-3 right-6 bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow">
              Most Popular
            </span>

            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Pro Annual</span>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black">$110</span>
                <span className="text-slate-400 text-sm">/ year (₦165,000)</span>
              </div>
              <p className="text-xs text-emerald-400">Includes 1 Month Free discount!</p>
            </div>

            <ul className="text-xs text-slate-300 space-y-2.5">
              <li className="flex items-center gap-2">✓ Everything in Pro Monthly</li>
              <li className="flex items-center gap-2">✓ Free Domain Registration (.com or .com.ng)</li>
              <li className="flex items-center gap-2">✓ Priority Edge Compute Allocation</li>
              <li className="flex items-center gap-2">✓ Generative SEO & Meta Optimization</li>
            </ul>
          </div>
        </div>

        <div className="pt-4 flex flex-col items-center space-y-3">
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full sm:w-auto min-w-[300px] py-4 px-8 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg transition disabled:opacity-50 text-sm"
          >
            {loading ? "Connecting to Payment Gateway..." : `Proceed with ${interval === "annual" ? "$110 Annual" : "$10 Monthly"} Plan →`}
          </button>
          <p className="text-xs text-slate-500">
            Secured via Paystack. Supports Nigerian Cards (Verve/Mastercard/Visa), Bank Transfers, and International Cards.
          </p>
        </div>
      </div>
    </main>
  );
}

export default function BillingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 font-sans">
          Loading checkout...
        </div>
      }
    >
      <BillingContent />
    </Suspense>
  );
}