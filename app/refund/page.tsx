import Link from "next/link";

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans p-6 sm:p-12">
      <div className="max-w-3xl mx-auto space-y-8 text-left">
        <Link href="/" className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold">
          ← Back to STARKORA
        </Link>
        <h1 className="text-3xl font-extrabold text-white">Cancellation & Refund Policy</h1>
        <p className="text-xs text-slate-500 font-mono">Last updated: September 2026</p>

        <section className="space-y-3 text-sm leading-relaxed">
          <h2 className="text-base font-bold text-white">1. Subscription Cancellation</h2>
          <p>
            You can cancel your recurring STARKORA subscription at any time directly through your dashboard. Upon cancellation, your site remains active on the Pro plan until the end of your paid billing cycle.
          </p>
        </section>

        <section className="space-y-3 text-sm leading-relaxed">
          <h2 className="text-base font-bold text-white">2. Refund Eligibility</h2>
          <p>
            We provide a 7-day money-back guarantee for first-time annual subscriptions if technical failure prevents your website from going live. Due to the immediate allocation of AI compute and domain costs, monthly subscription renewals are non-refundable once charged.
          </p>
        </section>

        <section className="space-y-3 text-sm leading-relaxed">
          <h2 className="text-base font-bold text-white">3. Requesting a Refund</h2>
          <p>
            To request a refund review, contact our support team at <strong className="text-white">bashiru@starkora.website</strong> with your account email and transaction reference.
          </p>
        </section>
      </div>
    </div>
  );
}