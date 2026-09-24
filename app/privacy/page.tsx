import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans p-6 sm:p-12">
      <div className="max-w-3xl mx-auto space-y-8 text-left">
        <Link href="/" className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold">
          ← Back to STARKORA
        </Link>
        <h1 className="text-3xl font-extrabold text-white">Privacy Policy</h1>
        <p className="text-xs text-slate-500 font-mono">Last updated: September 2026</p>

        <section className="space-y-3 text-sm leading-relaxed">
          <h2 className="text-base font-bold text-white">1. Information We Collect</h2>
          <p>
            We collect the name, email address, and billing details provided during registration. For published merchant websites, we process and store visitor inquiry leads (name, email, phone, message) strictly to deliver them to the site owner.
          </p>
        </section>

        <section className="space-y-3 text-sm leading-relaxed">
          <h2 className="text-base font-bold text-white">2. Data Security & Storage</h2>
          <p>
            All user authentication tokens and website data are stored in an encrypted serverless PostgreSQL database. Billing details are processed directly by Paystack; STARKORA never stores full card credentials.
          </p>
        </section>

        <section className="space-y-3 text-sm leading-relaxed">
          <h2 className="text-base font-bold text-white">3. Third-Party Services</h2>
          <p>
            We utilize OpenAI for generative layout synthesis, Resend for transactional emails, and Vercel for Anycast edge routing. We do not sell user data to advertising brokers.
          </p>
        </section>
      </div>
    </div>
  );
}