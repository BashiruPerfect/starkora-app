"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const INDUSTRIES = [
  {
    id: "fashion",
    name: "Fashion & Retail",
    headline: "Bespoke African Fashion & Luxury Boutiques",
    subtext: "Showcase seasonal collections, Senator wears, and custom Agbada with direct WhatsApp order links.",
    tag: "High Converting",
    color: "from-amber-500/20 to-orange-500/10",
  },
  {
    id: "food",
    name: "Food & Catering",
    headline: "Gourmet Restaurants, Cloud Kitchens & Event Catering",
    subtext: "Present daily menus, take banquet reservations, and route party orders directly to your phone.",
    tag: "Most Popular",
    color: "from-rose-500/20 to-red-500/10",
  },
  {
    id: "realestate",
    name: "Real Estate",
    headline: "Property Brokers, Shortlets & Luxury Developers",
    subtext: "Display property portfolios in Lekki and Abuja with neighborhood insights and direct inspection bookings.",
    tag: "High Value",
    color: "from-emerald-500/20 to-teal-500/10",
  },
  {
    id: "consulting",
    name: "Professional Services",
    headline: "Legal Advisors, Accountants & Business Consultants",
    subtext: "Establish instant institutional credibility with structured service tiers, case studies, and client intake.",
    tag: "Corporate",
    color: "from-indigo-500/20 to-blue-500/10",
  },
  {
    id: "services",
    name: "Home & Auto Services",
    headline: "Cleaning Agencies, Car Detailing & Solar Installers",
    subtext: "Capture emergency service bookings, quote requests, and local customer inquiries 24/7.",
    tag: "Fast Turnaround",
    color: "from-cyan-500/20 to-sky-500/10",
  },
];

const FAQS = [
  {
    q: "How does STARKORA generate a complete website in 30 seconds?",
    a: "STARKORA uses structured AI models to synthesize a complete 4-page website (Home, About, Services, Contact) based on your business name, industry, and location. It automatically writes high-converting copy, arranges responsive layouts, injects commercial photography, and sets up contact channels instantly.",
  },
  {
    q: "Can I connect my own custom domain (e.g., mybusiness.com or mybrand.ng)?",
    a: "Yes. On the Pro Plan ($10/mo or $110/yr), you can connect any custom domain (.com, .ng, .com.ng, .net). We automatically provision SSL certificates across our global edge network, and our brand watermark is completely removed.",
  },
  {
    q: "How do customer inquiries and orders reach me?",
    a: "Every generated website includes integrated lead channels. Visitors can click the direct WhatsApp button to chat immediately with your phone, or fill out the contact form. Inquiries are stored in your dashboard and emailed directly to your inbox with a 1-click reply button.",
  },
  {
    q: "Do I need coding, design, or technical hosting skills?",
    a: "None whatsoever. STARKORA handles cloud database provisioning, edge hosting, mobile responsiveness, and design tokens automatically. If you want to change any text or image, you can click and edit directly on the visual canvas.",
  },
  {
    q: "How does payment processing work for subscriptions?",
    a: "We integrate directly with Paystack. You can subscribe seamlessly using Nigerian debit cards (Mastercard, Visa, Verve), direct bank transfers, or international credit cards with zero foreign exchange failure rates.",
  },
];

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);
  const [selectedIndustry, setSelectedIndustry] = useState(INDUSTRIES[0]);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    businessName: "",
    businessType: "Fashion & Luxury Boutique",
    phone: "",
    location: "Lagos, Nigeria",
    description: "",
  });

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.authenticated) setUser(data.user);
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    window.location.reload();
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setGenerationStep(1);

    const stepInterval = setInterval(() => {
      setGenerationStep((prev) => (prev < 4 ? prev + 1 : prev));
    }, 900);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      clearInterval(stepInterval);

      if (data.siteData) {
        localStorage.setItem("starkora_active_site", JSON.stringify(data.siteData));
        localStorage.setItem("starkora_active_business_name", formData.businessName);
        localStorage.setItem("starkora_active_business_type", formData.businessType);
        localStorage.setItem("starkora_active_phone", formData.phone);
        localStorage.setItem("starkora_active_location", formData.location);

        window.location.href = "/editor";
      } else {
        alert("Failed to generate website data. Please try again.");
        setLoading(false);
      }
    } catch {
      clearInterval(stepInterval);
      alert("An error occurred during generation. Please retry.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-indigo-500/30">
      {/* 1. Global Navigation Bar */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md px-6 sm:px-12 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.8)]" />
            <span className="text-xl font-black tracking-wider text-white">STARKORA</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-6 text-xs uppercase tracking-wider font-semibold text-slate-400">
            <a href="#generator" className="hover:text-white transition">AI Builder</a>
            <a href="#showcase" className="hover:text-white transition">Showcase</a>
            <a href="#platform" className="hover:text-white transition">Platform</a>
            <a href="#comparison" className="hover:text-white transition">Why Us</a>
            <a href="#pricing" className="hover:text-white transition">Pricing</a>
            <a href="#faqs" className="hover:text-white transition">FAQs</a>
          </nav>
        </div>

        <div className="flex items-center gap-3 text-sm">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400 hidden md:inline">{user.email}</span>
              <Link
                href="/dashboard"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-lg transition"
              >
                Dashboard ➔
              </Link>
              <button
                onClick={handleLogout}
                className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-semibold rounded-xl border border-slate-800 transition"
              >
                Log Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="px-4 py-2 text-slate-300 hover:text-white text-xs font-semibold transition"
              >
                Log In
              </Link>
              <a
                href="#generator"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg transition"
              >
                Start for Free ➔
              </a>
            </div>
          )}
        </div>
      </header>

      {/* 2. Hero Section with Generator Engine */}
      <section id="generator" className="relative pt-16 pb-24 px-6 overflow-hidden">
        {/* Ambient Gradient Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-600/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-48 right-10 w-[400px] h-[300px] bg-purple-600/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-indigo-500/30 text-indigo-400 text-xs font-semibold shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>The Complete Autonomous AI Website Builder</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] max-w-4xl mx-auto">
            Launch a High-Converting Website in <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-indigo-200">30 Seconds</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Generate a full 4-page website tailored to your business, with built-in customer lead capture, instant email alerts, and Anycast edge delivery.
          </p>

          {/* Social Proof Stats */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-medium">
            <div className="flex items-center gap-1.5">
              <span className="text-amber-400 font-bold">★★★★★</span>
              <span className="font-semibold text-white">4.9 / 5</span> rating
            </div>
            <span>•</span>
            <div><strong className="text-white">12,000+</strong> websites launched</div>
            <span>•</span>
            <div><strong className="text-white">100%</strong> Native Paystack billing</div>
          </div>

          {/* The AI Generator Form Card */}
          <div className="pt-8 max-w-2xl mx-auto text-left">
            <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden ring-1 ring-white/10">
              <div className="flex items-center justify-between pb-6 border-b border-slate-800">
                <div>
                  <h3 className="text-lg font-bold text-white">Synthesize Your Platform</h3>
                  <p className="text-xs text-slate-400">Tell the AI about your brand to generate all 4 pages instantly.</p>
                </div>
                <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-semibold">
                  Prompt to Website
                </span>
              </div>

              <form onSubmit={handleGenerate} className="space-y-4 pt-6">
                <div>
                  <label className="block text-[11px] uppercase font-bold tracking-wider text-slate-400 mb-1.5">
                    What is your business name?
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Zikora Luxury Bespoke, Grace Kitchen, Alpha Realty"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase font-bold tracking-wider text-slate-400 mb-1.5">
                      Industry / Category
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Fashion, Catering, Real Estate"
                      value={formData.businessType}
                      onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase font-bold tracking-wider text-slate-400 mb-1.5">
                      WhatsApp / Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +234 803 123 4567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase font-bold tracking-wider text-slate-400 mb-1.5">
                    City & Region (Location)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Victoria Island, Lagos or Abuja, Nigeria"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase font-bold tracking-wider text-slate-400 mb-1.5">
                    Describe what you offer (Optional context for AI)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Luxury custom tailoring, senator suits, wedding wear with 48h turnaround..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 font-bold rounded-xl shadow-xl transition disabled:opacity-50 text-sm tracking-wide flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Generate Your 4-Page Website ➔</span>
                </button>
              </form>

              {/* Real-time Generation Progress Modal Overlay */}
              {loading && (
                <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-5 z-20">
                  <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                  <div className="space-y-1">
                    <h4 className="text-base font-bold text-white">Synthesizing Your Digital Platform</h4>
                    <p className="text-xs text-slate-400">Our generative engine is building your custom pages...</p>
                  </div>

                  <div className="w-full max-w-sm space-y-2 text-left text-xs font-mono">
                    <div className={`p-2 rounded flex items-center gap-2 ${generationStep >= 1 ? "bg-indigo-950/80 text-indigo-300" : "text-slate-600"}`}>
                      <span>{generationStep > 1 ? "✓" : "●"}</span>
                      <span>Analyzing business context and audience...</span>
                    </div>
                    <div className={`p-2 rounded flex items-center gap-2 ${generationStep >= 2 ? "bg-indigo-950/80 text-indigo-300" : "text-slate-600"}`}>
                      <span>{generationStep > 2 ? "✓" : "●"}</span>
                      <span>Structuring Home, About, Services, Contact...</span>
                    </div>
                    <div className={`p-2 rounded flex items-center gap-2 ${generationStep >= 3 ? "bg-indigo-950/80 text-indigo-300" : "text-slate-600"}`}>
                      <span>{generationStep > 3 ? "✓" : "●"}</span>
                      <span>Writing conversion copy and pricing tiers...</span>
                    </div>
                    <div className={`p-2 rounded flex items-center gap-2 ${generationStep >= 4 ? "bg-indigo-950/80 text-indigo-300" : "text-slate-600"}`}>
                      <span>{generationStep >= 4 ? "●" : "○"}</span>
                      <span>Allocating Anycast edge routing & SSL...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Industry Showcase Tabs (Durable Pattern) */}
      <section id="showcase" className="py-24 px-6 border-t border-slate-900 bg-slate-950/50">
        <div className="max-w-6xl mx-auto space-y-12 text-center">
          <div className="space-y-3">
            <span className="text-xs uppercase font-bold tracking-widest text-indigo-400">Built For Your Niche</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Tailored to How African Businesses Actually Sell</h2>
            <p className="text-sm text-slate-400 max-w-xl mx-auto">
              From boutiques and catering kitchens to corporate firms, STARKORA generates industry-specific blocks and packages.
            </p>
          </div>

          {/* Industry Filter Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {INDUSTRIES.map((ind) => (
              <button
                key={ind.id}
                onClick={() => setSelectedIndustry(ind)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  selectedIndustry.id === ind.id
                    ? "bg-indigo-600 text-white shadow-lg"
                    : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                }`}
              >
                <span>{ind.name}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/30 text-indigo-200">{ind.tag}</span>
              </button>
            ))}
          </div>

          {/* Showcase Display Card */}
          <div className="max-w-4xl mx-auto p-8 rounded-3xl bg-slate-900/80 border border-slate-800 text-left space-y-6 shadow-2xl relative overflow-hidden">
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase text-indigo-400 font-bold">{selectedIndustry.name} Showcase</span>
              <h3 className="text-2xl sm:text-3xl font-bold text-white">{selectedIndustry.headline}</h3>
              <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">{selectedIndustry.subtext}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
                <span className="text-xs font-bold text-white">4 Dedicated Pages</span>
                <p className="text-[11px] text-slate-400">Home, About Story, Detailed Services/Pricing, and Contact form.</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
                <span className="text-xs font-bold text-white">WhatsApp & Email Inquiries</span>
                <p className="text-[11px] text-slate-400">Prospects can message your WhatsApp or submit inquiries straight to your email.</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
                <span className="text-xs font-bold text-white">Naira Pricing Blocks</span>
                <p className="text-[11px] text-slate-400">Pre-configured service packages formatted with realistic Nigerian market rates.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. All-in-One Platform Value Pillars */}
      <section id="platform" className="py-24 px-6 border-t border-slate-900 bg-slate-900/30">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-3">
            <span className="text-xs uppercase font-bold tracking-widest text-indigo-400">All-in-One Architecture</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Everything You Need to Scale Your Digital Brand</h2>
            <p className="text-sm text-slate-400 max-w-xl mx-auto">
              Replace fragmented tools, complicated hosting setups, and broken website builders with a unified system.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4 hover:border-slate-700 transition">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-lg">✨</div>
              <h3 className="text-lg font-bold text-white">Generative AI Copy & Layout</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Autonomous engine synthesizes headlines, service packages, and testimonials tailored to your exact industry.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4 hover:border-slate-700 transition">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-lg">💬</div>
              <h3 className="text-lg font-bold text-white">Instant 2-Way Lead Alerts</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Customers submit inquiries on your site. You receive instant email alerts with a 1-click WhatsApp reply button.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4 hover:border-slate-700 transition">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-lg">💳</div>
              <h3 className="text-lg font-bold text-white">Native Paystack Rails</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Upgrade plans smoothly using Nigerian bank cards (Verve, Visa, Mastercard) or instant bank transfers with zero FX issues.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4 hover:border-slate-700 transition">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold text-lg">🎨</div>
              <h3 className="text-lg font-bold text-white">Drag & Drop Visual Canvas</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Rearrange sections, toggle multi-layout orientations (image-left vs. text-left), and customize styling with zero code breakage.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4 hover:border-slate-700 transition">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-lg">🌐</div>
              <h3 className="text-lg font-bold text-white">Custom Domain & SSL</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Connect your branded .com or .ng domain with automated SSL edge encryption and white-label branding.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4 hover:border-slate-700 transition">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold text-lg">⚡</div>
              <h3 className="text-lg font-bold text-white">Anycast Global Edge Speed</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Deployed to 300+ edge data centers worldwide for sub-50ms TTFB load times, ensuring fast loading on mobile networks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Cost Comparison Section (The "Replace 6 Subscriptions" Matrix) */}
      <section id="comparison" className="py-24 px-6 border-t border-slate-900 bg-slate-950">
        <div className="max-w-4xl mx-auto space-y-12 text-center">
          <div className="space-y-3">
            <span className="text-xs uppercase font-bold tracking-widest text-indigo-400">Value Comparison</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Replace 6 Separate Subscriptions With STARKORA</h2>
            <p className="text-sm text-slate-400 max-w-lg mx-auto">
              Save hundreds of thousands of Naira annually compared to the traditional web agency model.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-6">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-rose-400">The Traditional Route</span>
                <div className="text-3xl font-black text-white mt-1">₦450,000+ <span className="text-xs text-slate-500 font-normal">/ first year</span></div>
              </div>
              <ul className="text-xs text-slate-400 space-y-3">
                <li className="flex items-center justify-between border-b border-slate-800/60 pb-2">
                  <span>Web Developer & Designer Fee</span>
                  <strong className="text-slate-200">₦250,000 – ₦500,000</strong>
                </li>
                <li className="flex items-center justify-between border-b border-slate-800/60 pb-2">
                  <span>Annual Web Hosting & cPanel</span>
                  <strong className="text-slate-200">₦45,000 / yr</strong>
                </li>
                <li className="flex items-center justify-between border-b border-slate-800/60 pb-2">
                  <span>Commercial Copywriter</span>
                  <strong className="text-slate-200">₦60,000</strong>
                </li>
                <li className="flex items-center justify-between border-b border-slate-800/60 pb-2">
                  <span>Maintenance & Content Updates</span>
                  <strong className="text-slate-200">₦20,000 / month</strong>
                </li>
                <li className="flex items-center justify-between">
                  <span>Turnaround Time</span>
                  <strong className="text-rose-400">3 to 6 weeks</strong>
                </li>
              </ul>
            </div>

            <div className="p-8 rounded-2xl bg-slate-900 border border-indigo-500/50 shadow-2xl relative space-y-6 ring-1 ring-indigo-500/20">
              <span className="absolute -top-3 right-6 bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow">
                Recommended
              </span>
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-indigo-400">The STARKORA Platform</span>
                <div className="text-3xl font-black text-white mt-1">₦15,000 <span className="text-xs text-slate-400 font-normal">/ month ($10)</span></div>
                <p className="text-xs text-emerald-400 mt-1">Or ₦165,000/year (Includes 1 Month Free)</p>
              </div>
              <ul className="text-xs text-slate-300 space-y-3">
                <li className="flex items-center gap-2">✓ 4-Page Autonomous Website Generation (30s)</li>
                <li className="flex items-center gap-2">✓ Drag & Drop Canvas with Live Text Editing</li>
                <li className="flex items-center gap-2">✓ Direct WhatsApp & Email Lead Capture</li>
                <li className="flex items-center gap-2">✓ Automated SSL & Anycast Edge Delivery</li>
                <li className="flex items-center gap-2">✓ Meta Pixel & Google Analytics Tracking</li>
                <li className="flex items-center gap-2 font-bold text-white">✓ Turnaround Time: Under 1 Minute</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Testimonials Section */}
      <section className="py-24 px-6 border-t border-slate-900 bg-slate-900/20">
        <div className="max-w-6xl mx-auto space-y-12 text-center">
          <div className="space-y-3">
            <span className="text-xs uppercase font-bold tracking-widest text-indigo-400">Customer Proof</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Trusted by Fast-Growing Businesses</h2>
            <p className="text-sm text-slate-400 max-w-lg mx-auto">
              See how Nigerian founders and vendors are using STARKORA to capture customers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <p className="text-xs text-slate-300 leading-relaxed italic">
                “I was losing so many Instagram sales because customers didn't trust sending money without a website. I generated my boutique site on STARKORA in 30 seconds and linked my WhatsApp. Orders increased immediately.”
              </p>
              <div>
                <h4 className="text-xs font-bold text-white">Adaobi Okonkwo</h4>
                <p className="text-[11px] text-slate-400">Founder, Ada Luxury Fashion (Lekki, Lagos)</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <p className="text-xs text-slate-300 leading-relaxed italic">
                “Building our catering site through an agency was quoted at ₦350,000 with a 3-week wait. STARKORA wrote all our menu packages and contact forms in less than a minute. The email inquiry alerts work seamlessly.”
              </p>
              <div>
                <h4 className="text-xs font-bold text-white">Chef Femi Balogun</h4>
                <p className="text-[11px] text-slate-400">Managing Director, Royal Palm Kitchen (Abuja)</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <p className="text-xs text-slate-300 leading-relaxed italic">
                “Being able to pay with our standard Naira card via Paystack without FX conversion problems made this a no-brainer. Having custom domains and Meta tracking ready for our real estate ads is incredible.”
              </p>
              <div>
                <h4 className="text-xs font-bold text-white">Emeka Nnamdi</h4>
                <p className="text-[11px] text-slate-400">Principal Broker, Horizon Prime Realty (Port Harcourt)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Pricing Section */}
      <section id="pricing" className="py-24 px-6 border-t border-slate-900 bg-slate-950">
        <div className="max-w-5xl mx-auto space-y-12 text-center">
          <div className="space-y-3">
            <span className="text-xs uppercase font-bold tracking-widest text-indigo-400">Transparent Subscriptions</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Simple Pricing, Zero Hidden Fees</h2>
            <p className="text-sm text-slate-400 max-w-lg mx-auto">
              Start completely free on our subdomain, or upgrade to Pro to connect your custom domain and unlock full scale.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left max-w-3xl mx-auto">
            {/* Free Tier */}
            <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="text-xs uppercase font-bold text-slate-400">Starter Free</span>
                <div className="text-4xl font-black text-white">₦0</div>
                <p className="text-xs text-slate-400">Ideal for testing your brand concept and launching quickly.</p>
                <ul className="text-xs text-slate-300 space-y-2.5 pt-2">
                  <li className="flex items-center gap-2">✓ Single-Page Landing Site</li>
                  <li className="flex items-center gap-2">✓ Free *.starkora.website Subdomain</li>
                  <li className="flex items-center gap-2">✓ Up to 10 Customer Inquiries / month</li>
                  <li className="flex items-center gap-2">✓ Direct Email Notification Routing</li>
                  <li className="flex items-center gap-2 text-slate-500">• Platform Watermark Badge</li>
                </ul>
              </div>
              <a
                href="#generator"
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-center font-bold text-xs rounded-xl transition text-white block cursor-pointer"
              >
                Generate Free Site ➔
              </a>
            </div>

            {/* Pro Tier */}
            <div className="p-8 rounded-2xl bg-slate-900 border border-indigo-500 shadow-2xl relative flex flex-col justify-between space-y-6 ring-1 ring-indigo-500/20">
              <span className="absolute -top-3 right-6 bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow">
                Most Popular
              </span>
              <div className="space-y-4">
                <span className="text-xs uppercase font-bold text-indigo-400">Pro Plan</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-white">₦15,000</span>
                  <span className="text-xs text-slate-400">/ month ($10)</span>
                </div>
                <p className="text-xs text-emerald-400">Or ₦165,000/year (Includes 1 Month Free)</p>
                <ul className="text-xs text-slate-300 space-y-2.5 pt-2">
                  <li className="flex items-center gap-2">✓ Full 4-Page Site (Home, About, Services, Contact)</li>
                  <li className="flex items-center gap-2">✓ Connect Custom Domain (.com, .ng, .com.ng)</li>
                  <li className="flex items-center gap-2 font-bold text-white">✓ 100% White-Labeled (Watermark Removed)</li>
                  <li className="flex items-center gap-2">✓ Unlimited Customer Inquiries</li>
                  <li className="flex items-center gap-2">✓ Meta Pixel & Google Analytics Tracking</li>
                  <li className="flex items-center gap-2">✓ Automated SSL & Anycast Global Edge Routing</li>
                </ul>
              </div>
              <a
                href="#generator"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-center font-bold text-xs rounded-xl shadow-lg transition text-white block cursor-pointer"
              >
                Start with Pro ➔
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FAQs Section */}
      <section id="faqs" className="py-24 px-6 border-t border-slate-900 bg-slate-900/20">
        <div className="max-w-3xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <span className="text-xs uppercase font-bold tracking-widest text-indigo-400">Got Questions?</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Frequently Asked Questions</h2>
          </div>

          <div className="divide-y divide-slate-800 border-y border-slate-800">
            {FAQS.map((faq, i) => (
              <div key={i} className="py-5">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between text-left text-sm font-bold text-white hover:text-indigo-400 transition cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <span className="text-lg font-mono text-indigo-400">{openFaq === i ? "−" : "+"}</span>
                </button>
                {openFaq === i && (
                  <p className="pt-3 text-xs text-slate-400 leading-relaxed pr-6">{faq.a}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Bottom CTA Banner */}
      <section className="py-20 px-6 border-t border-slate-900 bg-gradient-to-b from-slate-950 to-indigo-950/30 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
            Build Your Business Website in Minutes
          </h2>
          <p className="text-sm text-slate-400 max-w-lg mx-auto">
            Join thousands of modern merchants who launched their professional web presence with STARKORA.
          </p>
          <div className="pt-2">
            <a
              href="#generator"
              className="inline-block px-8 py-4 bg-indigo-600 hover:bg-indigo-500 font-bold text-sm rounded-xl shadow-2xl transition cursor-pointer text-white"
            >
              Get Started for Free ➔
            </a>
          </div>
        </div>
      </section>

      {/* 10. Multi-Column Footer */}
      <footer className="py-12 px-6 sm:px-12 border-t border-slate-900 bg-slate-950 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-10 text-left">
          <div className="space-y-3">
            <span className="font-extrabold text-white text-sm">STARKORA</span>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Autonomous website builder engine designed for African merchants and global scale.
            </p>
          </div>

          <div className="space-y-2">
            <span className="font-bold text-slate-300">Product</span>
            <ul className="space-y-1.5 text-slate-400">
              <li><a href="#generator" className="hover:text-white transition">AI Website Builder</a></li>
              <li><a href="#showcase" className="hover:text-white transition">Showcase Templates</a></li>
              <li><a href="#pricing" className="hover:text-white transition">Pricing Plans</a></li>
            </ul>
          </div>

          <div className="space-y-2">
            <span className="font-bold text-slate-300">Platform</span>
            <ul className="space-y-1.5 text-slate-400">
              <li><Link href="/login" className="hover:text-white transition">Account Login</Link></li>
              <li><Link href="/dashboard" className="hover:text-white transition">Client Dashboard</Link></li>
              <li><a href="#faqs" className="hover:text-white transition">Knowledge Base</a></li>
            </ul>
          </div>

          <div className="space-y-2">
            <span className="font-bold text-slate-300">Legal</span>
            <ul className="space-y-1.5 text-slate-400">
              <li><span>Terms of Service</span></li>
              <li><span>Privacy Policy</span></li>
              <li><span>Refund Policy</span></li>
            </ul>
          </div>
        </div>

        <div className="max-w-6xl mx-auto pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 STARKORA Platform. All rights reserved.</p>
          <p className="text-slate-600">Built with Anycast edge architecture and localized payment rails.</p>
        </div>
      </footer>
    </div>
  );
}