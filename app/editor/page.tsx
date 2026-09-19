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

function createDefaultMultiPage(bizName: string = "Your Business", bizType: string = "Services"): MultiPageSiteData {
  return {
    pages: {
      home: {
        content: [
          {
            type: "NavbarBlock",
            props: { id: "nav-home", brandName: bizName, ctaLabel: "Contact Us", ctaLink: "/contact" },
          },
          {
            type: "HeroBlock",
            props: {
              id: "hero-home",
              badgeText: "PREMIER SERVICE",
              heading: `${bizName}`,
              subheading: `Professional ${bizType} delivered with precision, reliability, and excellence across Nigeria.`,
              ctaText: "Explore Services",
              ctaLink: "/services",
              imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80",
              theme: "gradient",
            },
          },
          {
            type: "FeatureGridBlock",
            props: {
              id: "feat-home",
              sectionBadge: "WHY CHOOSE US",
              sectionTitle: `Why Clients Choose ${bizName}`,
              features: [
                { title: "Verified Reliability", description: "Committed to delivering outstanding performance on every project." },
                { title: "Rapid Execution", description: "Fast delivery aligned with your schedule." },
                { title: "Direct Contact", description: "Seamless WhatsApp availability for immediate support." },
              ],
            },
          },
          {
            type: "TestimonialBlock",
            props: {
              id: "test-home",
              quote: `Working with ${bizName} transformed our business operations. Highly recommended!`,
              author: "Alhaji Ibrahim Danjuma",
              role: "Managing Director",
              company: "Danjuma Holdings",
            },
          },
          {
            type: "ContactWhatsAppBlock",
            props: {
              id: "contact-home",
              title: `Connect With ${bizName}`,
              subtitle: "Reach out via WhatsApp or submit an inquiry below.",
              phoneNumber: "+2348012345678",
              whatsappMessage: "Hello!",
              email: "contact@business.com",
              location: "Lagos, Nigeria",
            },
          },
          {
            type: "FooterBlock",
            props: { id: "footer-home", copyrightText: `© 2026 ${bizName}. Powered by STARKORA.` },
          },
        ],
        root: { props: { title: `${bizName} | Home`, palette: "indigo", font: "inter" } },
      },
      about: {
        content: [
          {
            type: "NavbarBlock",
            props: { id: "nav-about", brandName: bizName, ctaLabel: "Contact", ctaLink: "/contact" },
          },
          {
            type: "HeroBlock",
            props: {
              id: "hero-about",
              badgeText: "OUR STORY",
              heading: `About ${bizName}`,
              subheading: `Dedicated to delivering exceptional ${bizType} solutions with integrity, precision, and customer-first focus.`,
              ctaText: "Our Services",
              ctaLink: "/services",
              imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80",
              theme: "dark",
            },
          },
          {
            type: "FooterBlock",
            props: { id: "footer-about", copyrightText: `© 2026 ${bizName}. Powered by STARKORA.` },
          },
        ],
        root: { props: { title: `About Us | ${bizName}`, palette: "indigo", font: "inter" } },
      },
      services: {
        content: [
          {
            type: "NavbarBlock",
            props: { id: "nav-services", brandName: bizName, ctaLabel: "Inquire", ctaLink: "/contact" },
          },
          {
            type: "HeroBlock",
            props: {
              id: "hero-services",
              badgeText: "PACKAGES",
              heading: "Our Service Offerings",
              subheading: `Comprehensive ${bizType} packages designed for scale and dependability.`,
              ctaText: "Book Service",
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
                  features: `Complete ${bizType} Setup\nDirect WhatsApp Support`,
                  isPopular: false,
                  ctaText: "Select Standard",
                },
                {
                  name: "Executive Tier",
                  price: "₦95,000",
                  features: `Priority Execution\nDedicated Support Line\nCustom Specifications`,
                  isPopular: true,
                  ctaText: "Select Executive",
                },
              ],
            },
          },
          {
            type: "FooterBlock",
            props: { id: "footer-services", copyrightText: `© 2026 ${bizName}. Powered by STARKORA.` },
          },
        ],
        root: { props: { title: `Services | ${bizName}`, palette: "indigo", font: "inter" } },
      },
      contact: {
        content: [
          {
            type: "NavbarBlock",
            props: { id: "nav-contact", brandName: bizName, ctaLabel: "Home", ctaLink: "/" },
          },
          {
            type: "HeroBlock",
            props: {
              id: "hero-contact",
              badgeText: "GET IN TOUCH",
              heading: `Contact ${bizName}`,
              subheading: "Have questions or need a customized quote? Connect with us on WhatsApp.",
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
              title: "Direct Communication",
              subtitle: "We respond promptly to all incoming communications.",
              phoneNumber: "+2348012345678",
              whatsappMessage: "Hello!",
              email: "contact@business.com",
              location: "Lagos, Nigeria",
            },
          },
          {
            type: "FooterBlock",
            props: { id: "footer-contact", copyrightText: `© 2026 ${bizName}. Powered by STARKORA.` },
          },
        ],
        root: { props: { title: `Contact Us | ${bizName}`, palette: "indigo", font: "inter" } },
      },
    },
  };
}

const VALID_COMPONENT_TYPES = new Set([
  "NavbarBlock",
  "HeroBlock",
  "FeatureGridBlock",
  "PricingBlock",
  "TestimonialBlock",
  "ContactWhatsAppBlock",
  "FooterBlock",
]);

function normalizeBlockType(rawType: string): string | null {
  if (!rawType || typeof rawType !== "string") return null;
  const clean = rawType.toLowerCase().replace(/[^a-z]/g, "");

  if (clean.includes("navbar") || clean.includes("header") || clean.includes("nav")) return "NavbarBlock";
  if (clean.includes("hero") || clean.includes("banner")) return "HeroBlock";
  if (clean.includes("feature") || clean.includes("grid")) return "FeatureGridBlock";
  if (clean.includes("price") || clean.includes("pricing") || clean.includes("plan")) return "PricingBlock";
  if (clean.includes("testimonial") || clean.includes("review")) return "TestimonialBlock";
  if (clean.includes("contact") || clean.includes("whatsapp") || clean.includes("form")) return "ContactWhatsAppBlock";
  if (clean.includes("footer")) return "FooterBlock";

  return null;
}

function sanitizePagePayload(
  rawPage: any,
  fallbackPage: Data<ComponentProps, RootProps>,
  bizName: string
): Data<ComponentProps, RootProps> {
  if (!rawPage || typeof rawPage !== "object") {
    return fallbackPage;
  }

  const root = {
    props: {
      title: rawPage.root?.props?.title || `${bizName} | Page`,
      palette: rawPage.root?.props?.palette || "indigo",
      font: rawPage.root?.props?.font || "inter",
    },
  };

  // Check for content, sections, or blocks arrays
  const rawList = Array.isArray(rawPage.content)
    ? rawPage.content
    : Array.isArray(rawPage.sections)
    ? rawPage.sections
    : Array.isArray(rawPage.blocks)
    ? rawPage.blocks
    : [];

  const safeContent: any[] = [];

  for (let i = 0; i < rawList.length; i++) {
    const item = rawList[i];
    if (!item || typeof item !== "object") continue;

    const detectedType = normalizeBlockType(item.type || item.component || item.name || item.block);
    if (!detectedType || !VALID_COMPONENT_TYPES.has(detectedType)) continue;

    const props = item.props && typeof item.props === "object" ? { ...item.props } : { ...item };
    delete props.type;
    delete props.component;

    if (!props.id || typeof props.id !== "string") {
      props.id = `${detectedType}-${Math.random().toString(36).substring(2, 9)}`;
    }

    if (detectedType === "FeatureGridBlock" && !Array.isArray(props.features)) {
      props.features = [
        { title: "Verified Quality", description: "Committed to delivering outstanding performance." },
        { title: "Prompt Turnaround", description: "Fast delivery aligned with your schedule." },
      ];
    }

    if (detectedType === "PricingBlock" && !Array.isArray(props.plans)) {
      props.plans = [
        { name: "Standard Package", price: "₦35,000", features: "Full Delivery\nDirect Support", isPopular: false, ctaText: "Select Plan" },
      ];
    }

    safeContent.push({ type: detectedType, props });
  }

  if (safeContent.length === 0) {
    return fallbackPage;
  }

  return { content: safeContent, root };
}

function normalizeToMultiPage(raw: any, bizName: string): MultiPageSiteData {
  const fallback = createDefaultMultiPage(bizName);

  if (!raw || typeof raw !== "object") {
    return fallback;
  }

  // Handle { pages: { ... } } or { siteData: { pages: { ... } } }
  const pagesObj = raw.pages || raw.siteData?.pages || raw;

  if (pagesObj && typeof pagesObj === "object") {
    const result: MultiPageSiteData = {
      pages: {
        home: sanitizePagePayload(pagesObj.home, fallback.pages.home, bizName),
        about: sanitizePagePayload(pagesObj.about, fallback.pages.about, bizName),
        services: sanitizePagePayload(pagesObj.services, fallback.pages.services, bizName),
        contact: sanitizePagePayload(pagesObj.contact, fallback.pages.contact, bizName),
      },
    };
    return result;
  }

  if (Array.isArray(raw.content)) {
    fallback.pages.home = sanitizePagePayload(raw, fallback.pages.home, bizName);
  }

  return fallback;
}

function EditorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const siteId = searchParams.get("siteId");

  const [multiPage, setMultiPage] = useState<MultiPageSiteData>(() => createDefaultMultiPage());
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

      const activeBizName =
        localStorage.getItem("starkora_active_business_name") || "Your Business";

      if (siteId) {
        try {
          const siteRes = await fetch(`/api/sites?id=${siteId}`);
          if (siteRes.ok) {
            const siteJson = await siteRes.json();
            if (siteJson.site?.layoutData) {
              const parsed = JSON.parse(siteJson.site.layoutData);
              const normalized = normalizeToMultiPage(parsed, siteJson.site.name || activeBizName);
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
          const normalized = normalizeToMultiPage(parsed, activeBizName);
          setMultiPage(normalized);
          setEditorKey((k) => k + 1);
        } catch (e) {
          console.error("Failed to parse saved local site", e);
        }
      } else {
        setMultiPage(createDefaultMultiPage(activeBizName));
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
        "🔒 Multi-Page Customization is a Pro Feature!\n\nFree accounts are restricted to editing the main landing page.\n\nWould you like to upgrade to the Pro Plan ($10/mo) now to unlock and edit dedicated About, Services, and Contact pages?"
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
        const activeBizName =
          localStorage.getItem("starkora_active_business_name") || "Your Business";
        const fallback = createDefaultMultiPage(activeBizName);
        const sanitized = sanitizePagePayload(resJson.layoutData, fallback.pages[activePage], activeBizName);

        const updated: MultiPageSiteData = {
          pages: {
            ...multiPage.pages,
            [activePage]: sanitized,
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

  const homePage = multiPage?.pages?.home;
  const heroBlock = homePage?.content?.find((b) => b?.type === "HeroBlock");
  const contactBlock = homePage?.content?.find((b) => b?.type === "ContactWhatsAppBlock");
  const inferredBusinessName =
    homePage?.root?.props?.title?.split("|")?.[0]?.trim() ||
    (typeof window !== "undefined" ? localStorage.getItem("starkora_active_business_name") : null) ||
    "STARKORA";
  const inferredBusinessType = heroBlock?.props?.badgeText || "Services";
  const inferredLocation = contactBlock?.props?.location || "Lagos, Nigeria";

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

  const currentCanvasData = multiPage?.pages?.[activePage] || createDefaultMultiPage(inferredBusinessName).pages.home;

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