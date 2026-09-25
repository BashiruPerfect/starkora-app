"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface TemplateItem {
  id: string;
  name: string;
  category: string;
  description: string;
  badge: string;
  imageUrl: string;
  pages: string[];
  preset: {
    businessName: string;
    businessType: string;
    phone: string;
    location: string;
    description: string;
  };
}

const TEMPLATES: TemplateItem[] = [
  {
    id: "fashion-couture",
    name: "Zikora Luxury Couture",
    category: "Fashion & Bespoke",
    badge: "Trending",
    description: "Designed for luxury fashion houses, Senator suits, traditional Agbada couture, and ready-to-wear boutiques.",
    imageUrl: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1000&auto=format&fit=crop&q=80",
    pages: ["Home Lookbook", "About Artisan", "Bespoke Packages", "Direct Inquiry"],
    preset: {
      businessName: "Zikora Luxury Bespoke",
      businessType: "Luxury African Fashion & Bespoke Tailoring",
      phone: "+234 803 123 4567",
      location: "Victoria Island, Lagos",
      description: "Handcrafted Senator suits, traditional luxury Agbada, and bridal couture with 48h turnaround.",
    },
  },
  {
    id: "gourmet-catering",
    name: "Royal Palm Dining & Events",
    category: "Catering & Restaurants",
    badge: "High Conversion",
    description: "Tailored for event caterers, gourmet cloud kitchens, banquets, and modern Afro-fusion restaurants.",
    imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1000&auto=format&fit=crop&q=80",
    pages: ["Curated Menu", "Chef's Story", "Banquet Packages", "Table Booking"],
    preset: {
      businessName: "Royal Palm Gourmet Kitchen",
      businessType: "Event Catering & Private Dining",
      phone: "+234 802 987 6543",
      location: "Maitama, Abuja",
      description: "Artisanal event catering, corporate buffet services, and private chef dinners for elite gatherings.",
    },
  },
  {
    id: "prime-realty",
    name: "Horizon Prime Properties",
    category: "Real Estate & Shortlets",
    badge: "High Ticket",
    description: "Engineered for luxury property developers, shortlet managers, and private real estate consultants.",
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&auto=format&fit=crop&q=80",
    pages: ["Featured Listings", "Neighborhoods", "Inspection Booking", "Broker Contact"],
    preset: {
      businessName: "Horizon Prime Real Estate",
      businessType: "Luxury Real Estate & Serviced Shortlets",
      phone: "+234 814 555 7890",
      location: "Ikoyi, Lagos",
      description: "High-yield luxury residential acquisitions, off-plan penthouses, and executive shortlet accommodations.",
    },
  },
  {
    id: "legal-advisory",
    name: "Sterling & Crown Counsel",
    category: "Corporate Consulting",
    badge: "Enterprise",
    description: "Built for commercial legal firms, chartered tax advisory, and private corporate consulting partnerships.",
    imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1000&auto=format&fit=crop&q=80",
    pages: ["Practice Areas", "Senior Partners", "Retainer Tiers", "Case Assessment"],
    preset: {
      businessName: "Sterling & Crown Partners",
      businessType: "Commercial Legal Counsel & Corporate Tax",
      phone: "+234 809 111 2233",
      location: "Central Business District, Abuja",
      description: "Cross-border investment advisory, commercial dispute arbitration, and regulatory compliance.",
    },
  },
  {
    id: "fitness-wellness",
    name: "Pulse Performance Club",
    category: "Health & Fitness",
    badge: "Popular",
    description: "Designed for fitness centers, personal trainers, wellness spas, and holistic nutrition coaches.",
    imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1000&auto=format&fit=crop&q=80",
    pages: ["Club Overview", "Trainer Roster", "Membership Plans", "Free Trial Pass"],
    preset: {
      businessName: "Pulse Athletic & Wellness Club",
      businessType: "Boutique Gym & Executive Fitness",
      phone: "+234 805 444 3322",
      location: "Lekki Phase 1, Lagos",
      description: "Personalized strength conditioning, functional pilates studio, and executive wellness recovery.",
    },
  },
  {
    id: "creative-agency",
    name: "Vanguard Brand Studio",
    category: "Creative & Tech",
    badge: "Agency",
    description: "Curated for digital marketing agencies, commercial brand photographers, and software product studios.",
    imageUrl: "https://images.unsplash.com/photo-1542744094-24638eff58bb?w=1000&auto=format&fit=crop&q=80",
    pages: ["Client Case Studies", "Agency Capabilities", "Project Rates", "Project Intake"],
    preset: {
      businessName: "Vanguard Digital Media",
      businessType: "Brand Strategy & Growth Marketing Agency",
      phone: "+234 818 777 9900",
      location: "Yaba, Lagos",
      description: "Performance marketing, conversion-focused brand identity, and multi-channel creative direction.",
    },
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
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [highlightForm, setHighlightForm] = useState(false);

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

  const handleSelectTemplate = (template: TemplateItem) => {
    setFormData({
      businessName: template.preset.businessName,
      businessType: template.preset.businessType,
      phone: template.preset.phone,
      location: template.preset.location,
      description: template.preset.description,
    });

    setHighlightForm(true);
    setTimeout(() => setHighlightForm(false), 2000);

    const target = document.getElementById("generator");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
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
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-[#005AAD]/30 overflow-x-hidden">
      {/* 1. Global Navigation Bar with Official Brand Logo */}
      <header className="border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md px-6 sm:px-12 py-3.5 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl overflow-hidden bg-slate-900 border border-[#005AAD]/40 p-1 flex items-center justify-center shadow-[0_0_15px_rgba(0,90,173,0.35)] group-hover:border-[#005AAD] transition">
              <img
                src="/icon.png"
                alt="STARKORA Logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                }}
              />
            </div>
            <span className="text-xl font-black tracking-wider text-white">STARKORA</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-6 text-xs uppercase tracking-wider font-semibold text-slate-400">
            <a href="#generator" className="hover:text-white transition">AI Builder</a>
            <a href="#templates" className="hover:text-white transition">Templates</a>
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
                style={{ backgroundColor: "#005AAD" }}
                className="px-4 py-2 hover:brightness-110 text-white font-semibold text-xs rounded-xl shadow-lg transition"
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
                style={{ backgroundColor: "#005AAD" }}
                className="px-4 py-2 hover:brightness-110 text-white text-xs font-bold rounded-xl shadow-lg transition"
              >
                Start for Free ➔
              </a>
            </div>
          )}
        </div>
      </header>

      {/* 2. Hero Section with Interactive Generator and Floating Mockup */}
      <section id="generator" className="relative pt-12 pb-24 px-6 overflow-hidden">
        {/* Sapphire Glow Highlights */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-[#005AAD]/20 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute top-72 right-4 w-[500px] h-[350px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-6xl mx-auto space-y-12 relative z-10">
          <div className="text-center space-y-5 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-[#005AAD]/40 text-sky-400 text-xs font-semibold shadow-inner">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Autonomous AI Engine for Modern Enterprise</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08]">
              Launch a High-Converting Website in{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-[#005AAD] to-blue-300">
                30 Seconds
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Generate full 4-page websites tailored to your brand, equipped with direct WhatsApp lead capture, instant email alerts, and Anycast edge delivery.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-medium">
              <div className="flex items-center gap-1.5">
                <span className="text-amber-400 font-bold">★★★★★</span>
                <span className="font-semibold text-white">4.9 / 5</span> merchant rating
              </div>
              <span>•</span>
              <div><strong className="text-white">12,000+</strong> websites launched</div>
              <span>•</span>
              <div><strong className="text-white">Native</strong> Card & Bank Transfers</div>
            </div>
          </div>

          {/* Grid: Left Column (Generator Form) | Right Column (Browser Frame & Live Badges) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-6xl mx-auto">
            <div className="lg:col-span-6 text-left">
              <div
                className={`bg-slate-900/90 backdrop-blur-xl border rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden transition duration-500 ${
                  highlightForm ? "border-[#005AAD] ring-4 ring-[#005AAD]/40 scale-[1.01]" : "border-slate-800 ring-1 ring-white/10"
                }`}
              >
                <div className="flex items-center justify-between pb-5 border-b border-slate-800">
                  <div>
                    <h3 className="text-base font-bold text-white">Synthesize Your Platform</h3>
                    <p className="text-xs text-slate-400">Tell the AI about your brand to generate all 4 pages instantly.</p>
                  </div>
                  <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-[#005AAD]/15 text-sky-400 border border-[#005AAD]/30 font-semibold">
                    Instant AI Engine
                  </span>
                </div>

                <form onSubmit={handleGenerate} className="space-y-3.5 pt-5">
                  <div>
                    <label className="block text-[11px] uppercase font-bold tracking-wider text-slate-400 mb-1">
                      Business Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Zikora Luxury Bespoke, Grace Kitchen"
                      value={formData.businessName}
                      onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#005AAD] transition"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[11px] uppercase font-bold tracking-wider text-slate-400 mb-1">
                        Industry / Category
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Fashion, Catering"
                        value={formData.businessType}
                        onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#005AAD] transition"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase font-bold tracking-wider text-slate-400 mb-1">
                        WhatsApp / Phone Number
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. +234 803 123 4567"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#005AAD] transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase font-bold tracking-wider text-slate-400 mb-1">
                      City & Region (Location)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Victoria Island, Lagos or Abuja, Nigeria"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#005AAD] transition"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase font-bold tracking-wider text-slate-400 mb-1">
                      Describe your service or brand vibe (Optional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Custom tailoring, wedding wears, 48h turnaround..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#005AAD] transition"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    style={{ backgroundColor: "#005AAD" }}
                    className="w-full py-3.5 hover:brightness-110 font-bold rounded-xl shadow-xl transition disabled:opacity-50 text-sm tracking-wide flex items-center justify-center gap-2 cursor-pointer text-white"
                  >
                    <span>Generate 4-Page Website ➔</span>
                  </button>
                </form>

                {/* Real-Time Generation Progress Overlay */}
                {loading && (
                  <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-5 z-20">
                    <div className="w-12 h-12 border-4 border-[#005AAD]/20 border-t-[#005AAD] rounded-full animate-spin" />
                    <div className="space-y-1">
                      <h4 className="text-base font-bold text-white">Synthesizing Your Digital Platform</h4>
                      <p className="text-xs text-slate-400">Building tailored pages and layouts...</p>
                    </div>

                    <div className="w-full max-w-sm space-y-2 text-left text-xs font-mono">
                      <div className={`p-2 rounded flex items-center gap-2 ${generationStep >= 1 ? "bg-blue-950/80 text-sky-300" : "text-slate-600"}`}>
                        <span>{generationStep > 1 ? "✓" : "●"}</span>
                        <span>Analyzing brand context and target audience...</span>
                      </div>
                      <div className={`p-2 rounded flex items-center gap-2 ${generationStep >= 2 ? "bg-blue-950/80 text-sky-300" : "text-slate-600"}`}>
                        <span>{generationStep > 2 ? "✓" : "●"}</span>
                        <span>Structuring Home, About, Services, Contact...</span>
                      </div>
                      <div className={`p-2 rounded flex items-center gap-2 ${generationStep >= 3 ? "bg-blue-950/80 text-sky-300" : "text-slate-600"}`}>
                        <span>{generationStep > 3 ? "✓" : "●"}</span>
                        <span>Generating custom commercial photography...</span>
                      </div>
                      <div className={`p-2 rounded flex items-center gap-2 ${generationStep >= 4 ? "bg-blue-950/80 text-sky-300" : "text-slate-600"}`}>
                        <span>{generationStep >= 4 ? "●" : "○"}</span>
                        <span>Deploying to Anycast edge nodes...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Interactive Browser Frame with Floating Micro-Badges */}
            <div className="lg:col-span-6 relative">
              <div className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 shadow-2xl backdrop-blur-md absolute -top-4 -left-4 z-20">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] font-mono font-bold text-slate-200">⚡ Sub-50ms Global Edge Speed</span>
              </div>

              <div className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/90 border border-emerald-500/40 shadow-2xl backdrop-blur-md absolute -bottom-5 -left-4 z-20">
                <span className="text-emerald-400 font-bold text-xs">✓</span>
                <span className="text-[11px] font-mono font-semibold text-slate-200">
                  ₦165,000 Annual Plan Activated
                </span>
              </div>

              <div className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/90 border border-[#005AAD]/40 shadow-2xl backdrop-blur-md absolute -top-4 -right-4 z-20">
                <span className="text-xs">💬</span>
                <span className="text-[11px] font-mono font-semibold text-slate-200">
                  Customer Lead Routed to Email & WhatsApp
                </span>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 shadow-2xl overflow-hidden ring-1 ring-white/10 text-left">
                <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <div className="px-4 py-1 rounded-md bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-400 flex items-center gap-1.5 truncate max-w-[240px]">
                    <span className="text-emerald-400">🔒</span>
                    <span className="truncate">zikora-bespoke.starkora.website</span>
                  </div>
                  <span className="text-xs text-slate-600">⋯</span>
                </div>

                <div className="p-6 space-y-6 bg-gradient-to-b from-slate-900 to-slate-950">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                    <span className="font-extrabold text-sm tracking-wider text-white">ZIKORA BESPOKE</span>
                    <span
                      style={{ backgroundColor: "#005AAD" }}
                      className="px-3 py-1 text-white text-[10px] font-bold rounded-lg shadow"
                    >
                      Contact Us
                    </span>
                  </div>

                  <div className="space-y-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#005AAD]/20 text-sky-300 text-[10px] font-bold uppercase tracking-wider">
                      Couture & Craftsmanship
                    </span>
                    <h4 className="text-2xl font-black text-white leading-tight">
                      Bespoke Tailoring Crafted for Prestige
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Custom Senator wears, luxury Agbada, and bridal couture delivered in 48 hours across Victoria Island.
                    </p>
                  </div>

                  <div className="aspect-video w-full rounded-xl overflow-hidden border border-slate-800 relative">
                    <img
                      src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80"
                      alt="Sample Website Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-3">
                      <span className="text-[10px] font-mono text-sky-400">● Live on Global Edge Network</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Interactive Templates Gallery */}
      <section id="templates" className="py-24 px-6 border-y border-slate-900 bg-slate-900/30">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs uppercase font-bold tracking-widest text-sky-400">Curated Architecture</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Explore High-Converting Templates</h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Click any template below to load its pre-engineered conversion structure into the AI generator with one click.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
            {TEMPLATES.map((tmpl) => (
              <div
                key={tmpl.id}
                className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-xl hover:border-[#005AAD]/60 transition flex flex-col justify-between group"
              >
                <div>
                  <div className="aspect-video w-full overflow-hidden relative bg-slate-900">
                    <img
                      src={tmpl.imageUrl}
                      alt={tmpl.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute top-3 right-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-950/85 border border-slate-700/80 text-sky-300">
                        {tmpl.badge}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <div>
                      <span className="text-[11px] font-mono uppercase text-slate-400 font-bold">{tmpl.category}</span>
                      <h3 className="text-lg font-bold text-white mt-0.5">{tmpl.name}</h3>
                      <p className="text-xs text-slate-400 mt-2 leading-relaxed">{tmpl.description}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-900 flex flex-wrap gap-1.5">
                      {tmpl.pages.map((p, idx) => (
                        <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <button
                    onClick={() => handleSelectTemplate(tmpl)}
                    className="w-full py-2.5 rounded-xl text-xs font-bold transition text-white border border-[#005AAD] hover:bg-[#005AAD] flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Use This Template ➔</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Value Pillars */}
      <section id="platform" className="py-24 px-6 border-b border-slate-900 bg-slate-950">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-3">
            <span className="text-xs uppercase font-bold tracking-widest text-sky-400">All-in-One Engine</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Everything You Need to Scale Your Digital Brand</h2>
            <p className="text-sm text-slate-400 max-w-xl mx-auto">
              Replace fragmented hosting setups, complicated plugins, and broken website builders with a unified system.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
            <div className="p-8 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4 hover:border-slate-700 transition">
              <div className="w-10 h-10 rounded-xl bg-[#005AAD]/15 text-sky-400 flex items-center justify-center font-bold text-lg">✨</div>
              <h3 className="text-lg font-bold text-white">Autonomous AI Synthesis</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Generates high-converting commercial copy, structured service packages, and testimonials tailored to your industry.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4 hover:border-slate-700 transition">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-lg">💬</div>
              <h3 className="text-lg font-bold text-white">Instant 2-Way Lead Alerts</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Customers submit inquiries on your site. You receive instant email alerts with a 1-click reply button directly to the customer.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4 hover:border-slate-700 transition">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-lg">💳</div>
              <h3 className="text-lg font-bold text-white">Native Card & Bank Rails</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Upgrade seamlessly using debit cards (Verve, Visa, Mastercard) or direct bank transfers with zero foreign exchange declines.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4 hover:border-slate-700 transition">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold text-lg">🎨</div>
              <h3 className="text-lg font-bold text-white">Visual Drag & Drop Canvas</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Rearrange sections, toggle multi-layout orientations (image-left vs. text-left), and customize styling with zero code breakage.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4 hover:border-slate-700 transition">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-lg">🌐</div>
              <h3 className="text-lg font-bold text-white">Custom Domain & Edge SSL</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Connect your branded .com or .ng domain with automated SSL edge encryption and complete white-label branding.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4 hover:border-slate-700 transition">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold text-lg">⚡</div>
              <h3 className="text-lg font-bold text-white">Sub-50ms Edge Performance</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Deployed to global edge data centers for instantaneous load times on mobile 4G and 5G networks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Value Comparison */}
      <section id="comparison" className="py-24 px-6 border-b border-slate-900 bg-slate-900/20">
        <div className="max-w-4xl mx-auto space-y-12 text-center">
          <div className="space-y-3">
            <span className="text-xs uppercase font-bold tracking-widest text-sky-400">Value Comparison</span>
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

            <div className="p-8 rounded-2xl bg-slate-900 border border-[#005AAD] shadow-2xl relative space-y-6 ring-1 ring-[#005AAD]/30">
              <span
                style={{ backgroundColor: "#005AAD" }}
                className="absolute -top-3 right-6 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow"
              >
                Recommended
              </span>
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-sky-400">The STARKORA Platform</span>
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

      {/* 6. Pricing Section */}
      <section id="pricing" className="py-24 px-6 border-b border-slate-900 bg-slate-950">
        <div className="max-w-5xl mx-auto space-y-12 text-center">
          <div className="space-y-3">
            <span className="text-xs uppercase font-bold tracking-widest text-sky-400">Transparent Subscriptions</span>
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
            <div className="p-8 rounded-2xl bg-slate-900 border border-[#005AAD] shadow-2xl relative flex flex-col justify-between space-y-6 ring-1 ring-[#005AAD]/30">
              <span
                style={{ backgroundColor: "#005AAD" }}
                className="absolute -top-3 right-6 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow"
              >
                Most Popular
              </span>
              <div className="space-y-4">
                <span className="text-xs uppercase font-bold text-sky-400">Pro Plan</span>
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
                style={{ backgroundColor: "#005AAD" }}
                className="w-full py-3 hover:brightness-110 text-center font-bold text-xs rounded-xl shadow-lg transition text-white block cursor-pointer"
              >
                Start with Pro ➔
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FAQs Section */}
      <section id="faqs" className="py-24 px-6 border-b border-slate-900 bg-slate-900/20">
        <div className="max-w-3xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <span className="text-xs uppercase font-bold tracking-widest text-sky-400">Got Questions?</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Frequently Asked Questions</h2>
          </div>

          <div className="divide-y divide-slate-800 border-y border-slate-800">
            {FAQS.map((faq, i) => (
              <div key={i} className="py-5">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between text-left text-sm font-bold text-white hover:text-sky-400 transition cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <span className="text-lg font-mono text-sky-400">{openFaq === i ? "−" : "+"}</span>
                </button>
                {openFaq === i && (
                  <p className="pt-3 text-xs text-slate-400 leading-relaxed pr-6">{faq.a}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Bottom Call to Action */}
      <section className="py-24 px-6 bg-gradient-to-b from-slate-950 to-[#005AAD]/20 text-center">
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
              style={{ backgroundColor: "#005AAD" }}
              className="inline-block px-8 py-4 hover:brightness-110 font-bold text-sm rounded-xl shadow-2xl transition cursor-pointer text-white"
            >
              Get Started for Free ➔
            </a>
          </div>
        </div>
      </section>

      {/* 9. Multi-Column Footer with Active Compliance Links */}
      <footer className="py-12 px-6 sm:px-12 border-t border-slate-900 bg-slate-950 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-10 text-left">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg overflow-hidden bg-slate-900 border border-[#005AAD]/40 p-0.5 flex items-center justify-center">
                <img src="/icon.png" alt="STARKORA" className="w-full h-full object-contain" />
              </div>
              <span className="font-extrabold text-white text-sm">STARKORA</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Autonomous website builder engine designed for African merchants and global scale.
            </p>
          </div>

          <div className="space-y-2">
            <span className="font-bold text-slate-300">Product</span>
            <ul className="space-y-1.5 text-slate-400">
              <li><a href="#generator" className="hover:text-white transition">AI Website Builder</a></li>
              <li><a href="#templates" className="hover:text-white transition">Showcase Templates</a></li>
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
              <li><Link href="/terms" className="hover:text-white transition">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
              <li><Link href="/refund" className="hover:text-white transition">Refund Policy</Link></li>
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