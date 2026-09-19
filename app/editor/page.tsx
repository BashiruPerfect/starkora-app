"use client";

import { Suspense, useState, useEffect, useMemo } from "react";
import { Puck, type Data } from "@puckeditor/core";
import "@puckeditor/core/puck.css";
import { createConfig, type ComponentProps, type RootProps } from "../../puck.config";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

type PageSlug = "home" | "about" | "services" | "contact";

interface MultiPageSiteData {
  pages: Record<PageSlug, Data<ComponentProps, RootProps>>;
}

const defaultMultiPageData: MultiPageSiteData = {
  pages: {
    home: {
      content: [
        {
          type: "NavbarBlock",
          props: { id: "nav-1", brandName: "STARKORA", ctaLabel: "Contact", ctaLink: "/contact" },
        },
        {
          type: "HeroBlock",
          props: {
            id: "hero-1",
            badgeText: "OFFICIAL WEBSITE",
            heading: "Autonomous Multi-Page Platform",
            subheading: "Manage your Home, About, Services, and Contact pages seamlessly.",
            ctaText: "Explore Services",
            ctaLink: "/services",
            imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80",
            theme: "gradient",
          },
        },
        {
          type: "FeatureGridBlock",
          props: {
            id: "feat-1",
            sectionBadge: "CAPABILITIES",
            sectionTitle: "Engineered For Conversion",
            features: [
              { title: "Multi-Page Ready", description: "Dynamic edge routing across all navigation slugs." },
              { title: "Integrated Leads", description: "WhatsApp and direct inquiry capture out of the box." },
              { title: "One-Click Theming", description: "Instant color palettes and Google typography switching." },
            ],
          },
        },
        {
          type: "ContactWhatsAppBlock",
          props: {
            id: "contact-1",
            title: "Contact Us",
            subtitle: "Reach out via WhatsApp or email.",
            phoneNumber: "+2348012345678",
            whatsappMessage: "Hello!",
            email: "support@starkora.com",
            location: "Lagos, Nigeria",
          },
        },
        {
          type: "FooterBlock",
          props: { id: "footer-1", copyrightText: "© 2026 STARKORA. All rights reserved." },
        },
      ],
      root: { props: { title: "STARKORA | Home", palette: "indigo", font: "inter" } },
    },
    about: {
      content: [
        {
          type: "NavbarBlock",
          props: { id: "nav-about", brandName: "STARKORA", ctaLabel: "Contact", ctaLink: "/contact" },
        },
        {
          type: "HeroBlock",
          props: {
            id: "hero-about",
            badgeText: "OUR STORY",
            heading: "About Our Organization",
            subheading: "Committed to delivering high-impact solutions for our clients.",
            ctaText: "Our Services",
            ctaLink: "/services",
            imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80",
            theme: "dark",
          },
        },
        {
          type: "FooterBlock",
          props: { id: "footer-about", copyrightText: "© 2026 STARKORA. All rights reserved." },
        },
      ],
      root: { props: { title: "About Us | STARKORA", palette: "indigo", font: "inter" } },
    },
    services: {
      content: [
        {
          type: "NavbarBlock",
          props: { id: "nav-services", brandName: "STARKORA", ctaLabel: "Inquire", ctaLink: "/contact" },
        },
        {
          type: "HeroBlock",
          props: {
            id: "hero-services",
            badgeText: "OUR SOLUTIONS",
            heading: "Tailored Services & Packages",
            subheading: "Transparent packages designed for scale and dependability.",
            ctaText: "Get in Touch",
            ctaLink: "/contact",
            imageUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=80",
            theme: "gradient",
          },
        },
        {
          type: "PricingBlock",
          props: {
            id: "pricing-services",
            sectionTitle: "Transparent Pricing Tiers",
            sectionSubtitle: "Simple, flexible plans designed for your growth.",
            plans: [
              {
                name: "Standard Package",
                price: "₦35,000",
                features: "Complete Setup\nWhatsApp Direct Support\nStandard SLA",
                isPopular: false,
                ctaText: "Select Standard",
              },
              {
                name: "Enterprise Executive",
                price: "₦95,000",
                features: "Dedicated Manager\nPriority Turnaround\n24/7 Support\nCustom Domain Included",
                isPopular: true,
                ctaText: "Select Executive",
              },
            ],
          },
        },
        {
          type: "FooterBlock",
          props: { id: "footer-services", copyrightText: "© 2026 STARKORA. All rights reserved." },
        },
      ],
      root: { props: { title: "Services | STARKORA", palette: "indigo", font: "inter" } },
    },
    contact: {
      content: [
        {
          type: "NavbarBlock",
          props: { id: "nav-contact", brandName: "STARKORA", ctaLabel: "Home", ctaLink: "/" },
        },
        {
          type: "HeroBlock",
          props: {
            id: "hero-contact",
            badgeText: "REACH OUT",
            heading: "Contact Our Team",
            subheading: "Submit an inquiry or connect with us directly on WhatsApp.",
            ctaText: "Chat on WhatsApp",
            ctaLink: "#contact",
            imageUrl: "https://images.unsplash.com/photo-1534536281715-e28d76689b4d?w=800&auto=format&fit=crop&q=80",
            theme: "dark",
          },
        },
        {
          type: "ContactWhatsAppBlock",
          props: {
            id: "contact-main",
            title: "Leave an Inquiry",
            subtitle: "We respond promptly to all incoming communications.",
            phoneNumber: "+2348012345678",
            whatsappMessage: "Hello!",
            email: "support@starkora.com",
            location: "Lagos, Nigeria",
          },
        },
        {
          type: "FooterBlock",
          props: { id: "footer-contact", copyrightText: "© 2026 STARKORA. All rights reserved." },
        },
      ],
      root: { props: { title: "Contact Us | STARKORA", palette: "indigo", font: "inter" } },
    },
  },
};

function normalizeToMultiPage(raw: any): MultiPageSiteData {
  const result: MultiPageSiteData = {
    pages: {
      home: defaultMultiPageData.pages.home,
      about: defaultMultiPageData.pages.about,
      services: defaultMultiPageData.pages.services,
      contact: defaultMultiPageData.pages.contact,
    },
  };

  if (!raw || typeof raw !== "object") {
    return result;
  }

  // Handle multi-page object
  if (raw.pages && typeof raw.pages === "object") {
    const slugs: PageSlug[] = ["home", "about", "services", "contact"];
    for (const slug of slugs) {
      if (raw.pages[slug] && Array.isArray(raw.pages[slug].content)) {
        result.pages[slug] = {
          content: raw.pages[slug].content,
          root: raw.pages[slug].root || defaultMultiPageData.pages[slug].root,
        };
      }
    }
    return result;
  }

  // Handle single-page legacy object
  if (Array.isArray(raw.content)) {
    result.pages.home = {
      content: raw.content,
      root: raw.root || defaultMultiPageData.pages.home.root,
    };
  }

  return result;
}

function EditorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const siteId = searchParams.get("siteId");

  const [multiPage, setMultiPage] = useState<MultiPageSiteData>(defaultMultiPageData);
  const [activePage, setActivePage] = useState<PageSlug>("home");
  const [editorKey, setEditorKey] = useState(0);
  const [currentSiteId, setCurrentSiteId] = useState<string | null>(siteId);
  const [isLoaded, setIsLoaded] = useState(false);
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);
  const [isProUser, setIsProUser] = useState(false);

  const [aiPrompt, setAiPrompt] = useState("");
  const [isRefining, setIsRefining] = useState(false);

  useEffect(() => {
    async function init() {
      const authRes = await fetch("/api/auth/me");
      if (authRes.ok) {
        const authData = await authRes.json();
        if (authData?.authenticated) setUser(authData.user);
      }

      if (siteId) {
        try {
          const siteRes = await fetch(`/api/sites?id=${siteId}`);
          if (siteRes.ok) {
            const siteJson = await siteRes.json();
            if (siteJson.site?.layoutData) {
              const parsed = JSON.parse(siteJson.site.layoutData);
              const normalized = normalizeToMultiPage(parsed);
              setMultiPage(normalized);
              setCurrentSiteId(siteJson.site.id);
              setIsProUser(siteJson.site.subscriptionStatus === "active");
              setEditorKey((k) => k + 1);
              setIsLoaded(true);
              return;
            }
          }
        } catch (e) {
          console.error("Failed to fetch site from DB", e);
        }
      }

      const saved = localStorage.getItem("starkora_active_site");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          const normalized = normalizeToMultiPage(parsed);
          setMultiPage(normalized);
          setEditorKey((k) => k + 1);
        } catch (e) {
          console.error("Failed to parse saved local site", e);
        }
      }
      setIsLoaded(true);
    }

    init();
  }, [siteId]);

  const handleUpgradeToPro = async () => {
    if (currentSiteId) {
      router.push(`/billing?siteId=${currentSiteId}`);
      return;
    }

    if (!user) {
      alert("Please log in or register first so your website can be linked to your subscription.");
      router.push("/login");
      return;
    }

    try {
      const updatedMultiPage = multiPage;
      const res = await fetch("/api/sites/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteId: currentSiteId,
          name: updatedMultiPage.pages.home.root?.props?.title?.replace(" | Home", "") || "My Website",
          layoutData: updatedMultiPage,
        }),
      });

      if (res.ok) {
        const payload = await res.json();
        if (payload.site?.id) {
          setCurrentSiteId(payload.site.id);
          router.push(`/billing?siteId=${payload.site.id}`);
          return;
        }
      }
    } catch {
      // fallback
    }

    router.push("/dashboard");
  };

  const handlePageChange = (newPage: PageSlug) => {
    if (!isProUser && newPage !== "home") {
      const proceed = confirm(
        "🔒 Multi-Page Customization is a Pro Feature!\n\nFree accounts can only customize the main landing page.\n\nWould you like to upgrade to the Pro Plan ($10/mo) now to unlock and edit dedicated About, Services, and Contact pages?"
      );
      if (proceed) {
        handleUpgradeToPro();
      }
      return;
    }

    setActivePage(newPage);
    setEditorKey((k) => k + 1);
  };

  const handleSave = async (savedData: Data<ComponentProps, RootProps>) => {
    const updatedMultiPage: MultiPageSiteData = {
      pages: {
        ...multiPage.pages,
        [activePage]: savedData,
      },
    };

    setMultiPage(updatedMultiPage);
    localStorage.setItem("starkora_active_site", JSON.stringify(updatedMultiPage));

    try {
      const res = await fetch("/api/sites/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteId: currentSiteId,
          name: updatedMultiPage.pages.home.root?.props?.title?.replace(" | Home", "") || "My Multi-Page Site",
          layoutData: updatedMultiPage,
        }),
      });

      if (res.ok) {
        const payload = await res.json();
        if (payload.site?.id) setCurrentSiteId(payload.site.id);
        alert(`Site saved successfully! (Active: ${activePage.toUpperCase()})`);
      } else if (res.status === 401) {
        alert("Saved locally! Log in to permanently link this site to your account.");
      } else {
        alert("Saved locally (Database sync failed).");
      }
    } catch {
      alert("Saved locally!");
    }
  };

  const handleAiRefine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;

    setIsRefining(true);
    try {
      const res = await fetch("/api/ai/refine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentLayout: multiPage.pages[activePage],
          instruction: aiPrompt,
        }),
      });

      const resJson = await res.json();
      if (res.ok && resJson.layoutData) {
        const updated: MultiPageSiteData = {
          pages: {
            ...multiPage.pages,
            [activePage]: resJson.layoutData,
          },
        };
        setMultiPage(updated);
        localStorage.setItem("starkora_active_site", JSON.stringify(updated));
        setEditorKey((prev) => prev + 1);
        setAiPrompt("");
      } else {
        alert(resJson.error || "AI refinement failed.");
      }
    } catch {
      alert("Failed to communicate with AI Copilot.");
    } finally {
      setIsRefining(false);
    }
  };

  // Extract contextual business attributes safely with optional chaining
  const homePage = multiPage?.pages?.home;
  const heroBlock = homePage?.content?.find((b) => b?.type === "HeroBlock");
  const contactBlock = homePage?.content?.find((b) => b?.type === "ContactWhatsAppBlock");
  const inferredBusinessName = homePage?.root?.props?.title?.split("|")?.[0]?.trim() || "STARKORA";
  const inferredBusinessType = heroBlock?.props?.badgeText || "Enterprise";
  const inferredLocation = contactBlock?.props?.location || "Lagos, Nigeria";

  // Stabilize the Puck configuration object with useMemo to prevent re-render loops
  const stableConfig = useMemo(() => {
    return createConfig({
      businessName: inferredBusinessName,
      businessType: inferredBusinessType,
      location: inferredLocation,
    });
  }, [inferredBusinessName, inferredBusinessType, inferredLocation]);

  if (!isLoaded) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-950 text-slate-400 font-sans">
        Loading STARKORA Canvas...
      </div>
    );
  }

  const currentCanvasData = multiPage?.pages?.[activePage] || defaultMultiPageData.pages.home;

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden relative">
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-2.5 flex items-center justify-between z-50 text-sm">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="font-extrabold text-indigo-400 tracking-wider text-base hover:text-indigo-300 transition"
          >
            STARKORA
          </Link>
          <span className="text-slate-600">|</span>

          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold text-slate-400">Editing:</span>
            <select
              value={activePage}
              onChange={(e) => handlePageChange(e.target.value as PageSlug)}
              className="bg-slate-950 border border-slate-700 text-white rounded-lg px-3 py-1 text-xs font-semibold focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="home">Home Page (/)</option>
              <option value="about" disabled={!isProUser}>
                {isProUser ? "About Us (/about)" : "About Us (/about) 🔒 Pro Only"}
              </option>
              <option value="services" disabled={!isProUser}>
                {isProUser ? "Services & Pricing (/services)" : "Services & Pricing (/services) 🔒 Pro Only"}
              </option>
              <option value="contact" disabled={!isProUser}>
                {isProUser ? "Contact (/contact)" : "Contact (/contact) 🔒 Pro Only"}
              </option>
            </select>
          </div>

          <span className="text-slate-600 hidden sm:inline">|</span>
          <div className="hidden sm:flex items-center gap-1.5">
            {isProUser ? (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Pro Plan (Active)
              </span>
            ) : (
              <>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
                  Free Plan (10 Leads/mo)
                </span>
                <button
                  onClick={handleUpgradeToPro}
                  className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 underline cursor-pointer"
                >
                  Upgrade to Pro ↗
                </button>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <Link href="/dashboard" className="text-slate-400 hover:text-white text-xs transition">
              Dashboard ➔
            </Link>
          ) : (
            <Link
              href="/login"
              className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-semibold transition"
            >
              Log In to Save
            </Link>
          )}

          <Link
            href="/preview"
            target="_blank"
            className="text-xs text-slate-400 hover:text-white transition"
          >
            Preview ↗
          </Link>
        </div>
      </div>

      <div className="flex-1 relative">
        <Puck
          key={editorKey}
          config={stableConfig}
          data={currentCanvasData}
          onPublish={handleSave}
        />
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-xl px-4 pointer-events-auto">
        <form
          onSubmit={handleAiRefine}
          className="bg-slate-900/95 backdrop-blur-md border border-indigo-500/40 p-2 rounded-2xl shadow-2xl flex items-center gap-2 ring-1 ring-indigo-500/20"
        >
          <div className="pl-3 text-indigo-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap">
            <span>✨ AI</span>
          </div>
          <input
            type="text"
            placeholder={`Ask AI to refine this ${activePage.toUpperCase()} page...`}
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            disabled={isRefining}
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none px-2"
          />
          <button
            type="submit"
            disabled={isRefining || !aiPrompt.trim()}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition disabled:opacity-40 whitespace-nowrap"
          >
            {isRefining ? "Refining..." : `Update ${activePage.toUpperCase()} ➔`}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function EditorPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen w-screen flex items-center justify-center bg-slate-950 text-slate-400 font-sans">
          Loading STARKORA Canvas...
        </div>
      }
    >
      <EditorContent />
    </Suspense>
  );
}