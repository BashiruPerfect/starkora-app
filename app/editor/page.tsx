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

function createDefaultMultiPage(bizName: string = "STARKORA", bizType: string = "Enterprise"): MultiPageSiteData {
  return {
    pages: {
      home: {
        content: [
          {
            type: "NavbarBlock",
            props: { id: "nav-home", brandName: bizName, ctaLabel: "Inquire Now", ctaLink: "/contact" },
          },
          {
            type: "HeroBlock",
            props: {
              id: "hero-home",
              layout: "text-left",
              badgeText: "PREMIER SERVICE",
              heading: bizName,
              subheading: `Providing premier ${bizType} solutions across Nigeria with verified craftsmanship, prompt delivery, and complete customer satisfaction.`,
              ctaText: "Explore Packages",
              ctaLink: "/services",
              imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
              theme: "gradient",
            },
          },
          {
            type: "AboutTeaserBlock",
            props: {
              id: "about-teaser-home",
              sectionBadge: "OUR STORY",
              heading: "Crafted with Purpose & Integrity",
              storyText: `At ${bizName}, we believe excellence is in the details. Delivering exceptional ${bizType} solutions for clients who value dependability and precision.`,
              imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1000&auto=format&fit=crop&q=80",
              ctaText: "Read Full Story ➔",
              ctaLink: "/about",
            },
          },
          {
            type: "ServicesGridBlock",
            props: {
              id: "services-home",
              sectionBadge: "WHAT WE OFFER",
              sectionTitle: "Specialized Service Offerings",
              sectionSubtitle: "Explore our specialized solutions engineered for measurable client satisfaction.",
              services: [
                { title: "Standard Package", description: `Entry tier ${bizType} delivery with dedicated consultation.`, price: "₦35,000", ctaText: "Inquire Now" },
                { title: "Executive Masterclass", description: "Priority engagement including full custom specifications.", price: "₦85,000", ctaText: "Book Service" },
                { title: "Full Turnkey Suite", description: "Comprehensive execution tailored to executive requirements.", price: "₦180,000", ctaText: "Request Quote" },
              ],
            },
          },
          {
            type: "GalleryGridBlock",
            props: {
              id: "gallery-home",
              sectionTitle: "Signature Portfolio",
              sectionSubtitle: `Explore recent deliverables and collection pieces from ${bizName}.`,
              items: [
                { title: "Executive Standard", description: "Bespoke execution with premier materials.", imageUrl: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80" },
                { title: "Custom Solutions", description: "Tailored directly to unique customer requirements.", imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80" },
                { title: "Punctual Delivery", description: "Delivered promptly without compromising excellence.", imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80" },
              ],
            },
          },
          {
            type: "TestimonialBlock",
            props: {
              id: "test-home",
              sectionBadge: "CLIENT REVIEWS",
              sectionTitle: "Endorsed by Our Clientele",
              testimonials: [
                { quote: `Working with ${bizName} was effortless. Their attention to detail and punctuality exceeded all expectations.`, author: "Alhaji Ibrahim Danjuma", role: "Managing Director", company: "Danjuma Holdings", rating: 5 },
                { quote: "The speed of execution and quality transformed our operations completely. Outstanding professionalism.", author: "Chioma Adeleke", role: "Creative Director", company: "Adeleke Brand Studio", rating: 5 },
                { quote: "Their team delivers verified results with zero downtime. Highly recommended for any serious organization.", author: "Tunde Babalola", role: "Principal Broker", company: "Apex Capital Properties", rating: 5 },
              ],
            },
          },
          {
            type: "ContactWhatsAppBlock",
            props: {
              id: "contact-home",
              title: `Connect With ${bizName}`,
              subtitle: "Leave an inquiry below or contact our team directly.",
              phoneNumber: "+2348012345678",
              whatsappMessage: `Hello ${bizName}!`,
              email: "contact@business.com",
              location: "Lagos, Nigeria",
            },
          },
          {
            type: "FooterBlock",
            props: {
              id: "footer-home",
              brandName: bizName,
              tagline: `Premier ${bizType} solutions across Nigeria. Engineered for excellence and verified dependability.`,
              copyrightText: `© ${new Date().getFullYear()} ${bizName}. Powered by STARKORA.`,
              instagram: "https://instagram.com",
              whatsapp: "https://wa.me/2348012345678",
              twitter: "https://x.com",
              linkedin: "https://linkedin.com",
            },
          },
        ],
        root: { props: { title: `${bizName} | Home`, palette: "sapphire", font: "jakarta" } },
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
              layout: "image-left",
              badgeText: "OUR STORY",
              heading: `About ${bizName}`,
              subheading: `Dedicated to delivering exceptional ${bizType} solutions with integrity, precision, and customer-first focus.`,
              ctaText: "View Our Services",
              ctaLink: "/services",
              imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
              theme: "dark",
            },
          },
          {
            type: "FeatureGridBlock",
            props: {
              id: "feat-about",
              sectionBadge: "OUR VALUES",
              sectionTitle: "Principles That Guide Every Project",
              features: [
                { title: "Integrity First", description: "Transparent communication, honest pricing, and accountability." },
                { title: "Client Success", description: "Our metrics are defined exclusively by client satisfaction." },
                { title: "Continuous Innovation", description: "Adopting modern industry workflows to keep you ahead." },
              ],
            },
          },
          {
            type: "FooterBlock",
            props: {
              id: "footer-about",
              brandName: bizName,
              tagline: `Premier ${bizType} solutions across Nigeria.`,
              copyrightText: `© ${new Date().getFullYear()} ${bizName}. Powered by STARKORA.`,
            },
          },
        ],
        root: { props: { title: `About Us | ${bizName}`, palette: "sapphire", font: "jakarta" } },
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
              badgeText: "SOLUTIONS",
              heading: "Our Service Offerings",
              subheading: `Comprehensive ${bizType} packages engineered to deliver immediate value and long-term durability.`,
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
              sectionTitle: "Curated Packages",
              sectionSubtitle: "Simple, transparent pricing tailored to your needs.",
              plans: [
                { name: "Standard Package", price: "₦35,000", features: `Complete ${bizType} Delivery\nDirect Support & Consultation\nStandard Quality Assurance`, isPopular: false, ctaText: "Select Plan" },
                { name: "Executive Tier", price: "₦95,000", features: `Priority Execution\nDedicated Support Line\nExtended Warranty\nCustom Specifications`, isPopular: true, ctaText: "Select Executive" },
              ],
            },
          },
          {
            type: "FooterBlock",
            props: {
              id: "footer-services",
              brandName: bizName,
              tagline: `Premier ${bizType} solutions across Nigeria.`,
              copyrightText: `© ${new Date().getFullYear()} ${bizName}. Powered by STARKORA.`,
            },
          },
        ],
        root: { props: { title: `Services | ${bizName}`, palette: "sapphire", font: "jakarta" } },
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
              subheading: "Have questions or need a customized quote? Send us an inquiry or message us on WhatsApp.",
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
              whatsappMessage: `Hello ${bizName}!`,
              email: "contact@business.com",
              location: "Lagos, Nigeria",
            },
          },
          {
            type: "FooterBlock",
            props: {
              id: "footer-contact",
              brandName: bizName,
              tagline: `Premier ${bizType} solutions across Nigeria.`,
              copyrightText: `© ${new Date().getFullYear()} ${bizName}. Powered by STARKORA.`,
            },
          },
        ],
        root: { props: { title: `Contact Us | ${bizName}`, palette: "sapphire", font: "jakarta" } },
      },
    },
  };
}

const VALID_COMPONENT_TYPES = new Set([
  "NavbarBlock",
  "HeroBlock",
  "AboutTeaserBlock",
  "ServicesGridBlock",
  "GalleryGridBlock",
  "FeatureGridBlock",
  "PricingBlock",
  "TestimonialBlock",
  "ContactWhatsAppBlock",
  "NewsletterBlock",
  "FooterBlock",
]);

function normalizeBlockType(rawType: string): string | null {
  if (!rawType || typeof rawType !== "string") return null;
  const clean = rawType.toLowerCase().replace(/[^a-z]/g, "");

  if (clean.includes("navbar") || clean.includes("header") || clean.includes("nav")) return "NavbarBlock";
  if (clean.includes("hero") || clean.includes("banner")) return "HeroBlock";
  if (clean.includes("about") || clean.includes("story") || clean.includes("teaser")) return "AboutTeaserBlock";
  if (clean.includes("service") || clean.includes("offering")) return "ServicesGridBlock";
  if (clean.includes("gallery") || clean.includes("portfolio")) return "GalleryGridBlock";
  if (clean.includes("feature") || clean.includes("grid")) return "FeatureGridBlock";
  if (clean.includes("price") || clean.includes("pricing") || clean.includes("plan")) return "PricingBlock";
  if (clean.includes("testimonial") || clean.includes("review")) return "TestimonialBlock";
  if (clean.includes("contact") || clean.includes("whatsapp") || clean.includes("form")) return "ContactWhatsAppBlock";
  if (clean.includes("newsletter") || clean.includes("subscribe")) return "NewsletterBlock";
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
      palette: rawPage.root?.props?.palette || "sapphire",
      font: rawPage.root?.props?.font || "jakarta",
    },
  };

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

    if (detectedType === "TestimonialBlock" && !Array.isArray(props.testimonials)) {
      props.testimonials = [
        {
          quote: props.quote || `Working with ${bizName} was effortless. Their commitment to quality and punctuality exceeded all expectations.`,
          author: props.author || "Alhaji Ibrahim Danjuma",
          role: props.role || "Managing Director",
          company: props.company || "Danjuma Holdings",
          rating: props.rating || 5,
        },
      ];
    }

    if (detectedType === "FooterBlock") {
      if (!props.brandName) props.brandName = bizName;
      if (!props.tagline) props.tagline = `Premier solutions across Nigeria. Powered by STARKORA.`;
      if (!props.copyrightText) props.copyrightText = `© ${new Date().getFullYear()} ${bizName}. Powered by STARKORA.`;
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
        "🔒 Multi-Page Customization is a Pro Feature!\n\nFree accounts can only edit the main landing page.\n\nWould you like to upgrade to the Pro Plan ($10/mo) now to unlock and edit dedicated About, Services, and Contact pages?"
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
            className="font-extrabold text-sky-400 tracking-wider text-base hover:text-sky-300 transition"
          >
            STARKORA
          </Link>
          <span className="text-slate-600">|</span>

          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold text-slate-400">Editing:</span>
            <select
              value={activePage}
              onChange={(e) => handlePageChange(e.target.value as PageSlug)}
              className="bg-slate-950 border border-slate-700 text-white rounded-lg px-3 py-1 text-xs font-semibold focus:outline-none focus:border-[#005AAD] cursor-pointer"
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
                  className="text-[10px] font-bold text-sky-400 hover:text-sky-300 underline cursor-pointer"
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
              style={{ backgroundColor: "#005AAD" }}
              className="px-3 py-1 hover:brightness-110 text-white rounded text-xs font-semibold transition"
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
          className="bg-slate-900/95 backdrop-blur-md border border-[#005AAD]/40 p-2 rounded-2xl shadow-2xl flex items-center gap-2 ring-1 ring-[#005AAD]/20"
        >
          <div className="pl-3 text-sky-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap">
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
            style={{ backgroundColor: "#005AAD" }}
            className="px-4 py-2 hover:brightness-110 text-white text-xs font-bold rounded-xl transition disabled:opacity-40 whitespace-nowrap cursor-pointer"
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