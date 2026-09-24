import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans p-6 sm:p-12">
      <div className="max-w-3xl mx-auto space-y-8 text-left">
        <Link href="/" className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold">
          ← Back to STARKORA
        </Link>
        <h1 className="text-3xl font-extrabold text-white">Terms of Service</h1>
        <p className="text-xs text-slate-500 font-mono">Last updated: September 2026</p>

        <section className="space-y-3 text-sm leading-relaxed">
          <h2 className="text-base font-bold text-white">1. Service Overview</h2>
          <p>
            STARKORA provides an autonomous, multi-page website creation, hosting, and edge distribution platform. By accessing or using our platform, you agree to comply with and be bound by these Terms of Service.
          </p>
        </section>

        <section className="space-y-3 text-sm leading-relaxed">
          <h2 className="text-base font-bold text-white">2. Subscription & Payments</h2>
          <p>
            Paid subscriptions (Pro Monthly at $10.00 / ₦15,000 and Pro Annual at $110.00 / ₦165,000) are billed in advance on a recurring basis via Paystack. You may cancel your subscription at any time through your account dashboard.
          </p>
        </section>

        <section className="space-y-3 text-sm leading-relaxed">
          <h2 className="text-base font-bold text-white">3. Acceptable Use</h2>
          <p>
            You agree not to use STARKORA to publish fraudulent, unlawful, deceptive, or infringing content. We reserve the right to suspend or terminate any website that violates local or international laws.
          </p>
        </section>

        <section className="space-y-3 text-sm leading-relaxed">
          <h2 className="text-base font-bold text-white">4. Contact Information</h2>
          <p>
            Inquiries regarding these terms should be directed to: <strong className="text-white">bashiru@starkora.website</strong>.
          </p>
        </section>
      </div>
    </div>
  );
}