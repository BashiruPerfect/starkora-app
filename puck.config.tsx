"use client";

import React, { useState } from "react";
import type { Config } from "@puckeditor/core";

export type ThemePalette = "sapphire" | "indigo" | "emerald" | "gold" | "crimson" | "minimal";
export type ThemeFont = "inter" | "jakarta" | "playfair" | "cinzel" | "space" | "mono";

export const paletteDefinitions: Record<
  ThemePalette,
  {
    primary: string;
    primaryText: string;
    accent: string;
    glow: string;
    gradientStart: string;
    gradientEnd: string;
    cardBorder: string;
    badgeBg: string;
    badgeText: string;
  }
> = {
  sapphire: {
    primary: "#005AAD",
    primaryText: "#ffffff",
    accent: "#38bdf8",
    glow: "rgba(0, 90, 173, 0.32)",
    gradientStart: "#032b5f",
    gradientEnd: "#020617",
    cardBorder: "rgba(0, 90, 173, 0.4)",
    badgeBg: "rgba(0, 90, 173, 0.2)",
    badgeText: "#7dd3fc",
  },
  indigo: {
    primary: "#4f46e5",
    primaryText: "#ffffff",
    accent: "#818cf8",
    glow: "rgba(79, 70, 229, 0.18)",
    gradientStart: "#1e1b4b",
    gradientEnd: "#020617",
    cardBorder: "rgba(99, 102, 241, 0.3)",
    badgeBg: "rgba(99, 102, 241, 0.18)",
    badgeText: "#a5b4fc",
  },
  emerald: {
    primary: "#059669",
    primaryText: "#ffffff",
    accent: "#34d399",
    glow: "rgba(5, 150, 105, 0.18)",
    gradientStart: "#022c22",
    gradientEnd: "#020617",
    cardBorder: "rgba(16, 185, 129, 0.3)",
    badgeBg: "rgba(16, 185, 129, 0.18)",
    badgeText: "#6ee7b7",
  },
  gold: {
    primary: "#d97706",
    primaryText: "#000000",
    accent: "#fbbf24",
    glow: "rgba(217, 119, 6, 0.22)",
    gradientStart: "#451a03",
    gradientEnd: "#020617",
    cardBorder: "rgba(245, 158, 11, 0.35)",
    badgeBg: "rgba(245, 158, 11, 0.20)",
    badgeText: "#fcd34d",
  },
  crimson: {
    primary: "#e11d48",
    primaryText: "#ffffff",
    accent: "#fb7185",
    glow: "rgba(225, 29, 72, 0.20)",
    gradientStart: "#4c0519",
    gradientEnd: "#020617",
    cardBorder: "rgba(244, 63, 94, 0.35)",
    badgeBg: "rgba(244, 63, 94, 0.20)",
    badgeText: "#fda4af",
  },
  minimal: {
    primary: "#ffffff",
    primaryText: "#020617",
    accent: "#cbd5e1",
    glow: "rgba(255, 255, 255, 0.08)",
    gradientStart: "#1e293b",
    gradientEnd: "#020617",
    cardBorder: "rgba(255, 255, 255, 0.2)",
    badgeBg: "rgba(255, 255, 255, 0.12)",
    badgeText: "#f8fafc",
  },
};

const fontFamilies: Record<ThemeFont, string> = {
  inter: "'Inter', sans-serif",
  jakarta: "'Plus Jakarta Sans', sans-serif",
  playfair: "'Playfair Display', serif",
  cinzel: "'Cinzel', serif",
  space: "'Space Grotesk', sans-serif",
  mono: "'JetBrains Mono', monospace",
};

function navigateToTarget(e: React.MouseEvent<HTMLAnchorElement>, targetSlug: string) {
  if (typeof window === "undefined") return;

  const pathname = window.location.pathname;

  if (pathname.includes("/preview")) {
    e.preventDefault();
    const cleanSlug = targetSlug === "/" ? "home" : targetSlug.replace(/^\//, "");
    window.location.href = `/preview?page=${cleanSlug}`;
    return;
  }

  const parts = pathname.split("/").filter(Boolean);
  if (parts[0] === "live" && parts[1]) {
    e.preventDefault();
    const cleanSlug = targetSlug === "/" ? "" : `/${targetSlug.replace(/^\//, "")}`;
    window.location.href = `/live/${parts[1]}${cleanSlug}`;
    return;
  }
}

// In-Sidebar Image Manager with File Upload and On-Demand AI Generation
function ImageFieldManager({
  value,
  onChange,
  label,
}: {
  value?: string;
  onChange: (val: string) => void;
  label: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [generatingAi, setGeneratingAi] = useState(false);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      alert("Please select an image under 3MB.");
      return;
    }

    setUploading(true);

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onChange(reader.result);
      }
      setUploading(false);
    };
    reader.onerror = () => {
      alert("Failed to read image file.");
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleAiGenerate = async () => {
    const prompt = window.prompt(
      "Describe the image you want AI to generate:",
      "Modern luxury commercial storefront with ambient lighting"
    );
    if (!prompt) return;

    setGeneratingAi(true);
    try {
      const res = await fetch("/api/ai/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const rawText = await res.text();
      let data: any = {};

      try {
        data = JSON.parse(rawText);
      } catch {
        throw new Error(
          `Server returned unexpected response (Status ${res.status}). Ensure /api/ai/image is deployed.`
        );
      }

      if (res.ok && data.url) {
        onChange(data.url);
      } else {
        alert(data.error || `AI image generation failed (Status ${res.status}).`);
      }
    } catch (err: any) {
      alert(`AI Image Engine Error: ${err.message}`);
    } finally {
      setGeneratingAi(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "100%", marginBottom: "14px" }}>
      <span style={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>
        {label}
      </span>

      {value && (
        <div
          style={{
            width: "100%",
            height: "95px",
            borderRadius: "8px",
            overflow: "hidden",
            border: "1px solid #334155",
            background: "#020617",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={value}
            alt="Thumbnail"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80";
            }}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
        <label
          style={{
            display: "block",
            textAlign: "center",
            background: "#334155",
            color: "#ffffff",
            padding: "8px",
            borderRadius: "8px",
            fontSize: "11px",
            fontWeight: 600,
            cursor: uploading ? "not-allowed" : "pointer",
            opacity: uploading ? 0.6 : 1,
            transition: "all 0.2s ease",
          }}
        >
          {uploading ? "Reading..." : "Upload File 📁"}
          <input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} style={{ display: "none" }} />
        </label>

        <button
          type="button"
          onClick={handleAiGenerate}
          disabled={generatingAi}
          style={{
            background: "#005AAD",
            color: "#ffffff",
            padding: "8px",
            borderRadius: "8px",
            fontSize: "11px",
            fontWeight: 600,
            border: "none",
            cursor: generatingAi ? "not-allowed" : "pointer",
            opacity: generatingAi ? 0.6 : 1,
          }}
        >
          {generatingAi ? "Generating..." : "Generate AI 🎨"}
        </button>
      </div>

      <input
        type="text"
        value={value || ""}
        placeholder="or paste image link..."
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          padding: "7px 10px",
          fontSize: "11px",
          borderRadius: "6px",
          background: "#0f172a",
          border: "1px solid #334155",
          color: "#f8fafc",
          boxSizing: "border-box",
        }}
      />
    </div>
  );
}

export type RootProps = {
  title: string;
  palette: ThemePalette;
  font: ThemeFont;
};

export type ComponentProps = {
  NavbarBlock: {
    brandName: string;
    logoUrl?: string;
    ctaLabel: string;
    ctaLink: string;
  };
  HeroBlock: {
    layout?: "text-left" | "image-left" | "centered";
    badgeText?: string;
    heading: string;
    subheading: string;
    ctaText: string;
    ctaLink: string;
    imageUrl?: string;
    theme: "light" | "dark" | "gradient";
  };
  AboutTeaserBlock: {
    sectionBadge?: string;
    heading: string;
    storyText: string;
    imageUrl: string;
    ctaText: string;
    ctaLink: string;
  };
  ServicesGridBlock: {
    sectionBadge?: string;
    sectionTitle: string;
    sectionSubtitle: string;
    services: {
      title: string;
      description: string;
      price: string;
      ctaText: string;
    }[];
  };
  FeatureGridBlock: {
    sectionBadge?: string;
    sectionTitle: string;
    features: {
      title: string;
      description: string;
    }[];
  };
  GalleryGridBlock: {
    sectionTitle: string;
    sectionSubtitle: string;
    items: {
      title: string;
      description: string;
      imageUrl: string;
    }[];
  };
  PricingBlock: {
    sectionTitle: string;
    sectionSubtitle: string;
    plans: {
      name: string;
      price: string;
      features: string;
      isPopular: boolean;
      ctaText: string;
    }[];
  };
  TestimonialBlock: {
    sectionBadge?: string;
    sectionTitle: string;
    testimonials: {
      quote: string;
      author: string;
      role: string;
      company: string;
      rating: number;
    }[];
  };
  ContactWhatsAppBlock: {
    title: string;
    subtitle: string;
    phoneNumber: string;
    whatsappMessage: string;
    email: string;
    location: string;
  };
  NewsletterBlock: {
    title: string;
    subtitle: string;
    buttonText: string;
  };
  FooterBlock: {
    brandName: string;
    logoUrl?: string;
    tagline: string;
    copyrightText: string;
    instagram?: string;
    whatsapp?: string;
    twitter?: string;
    linkedin?: string;
  };
};

export interface BusinessContext {
  businessName?: string;
  businessType?: string;
  location?: string;
}

export function createConfig(context?: BusinessContext): Config<ComponentProps, RootProps> {
  const fallbackStoredName = typeof window !== "undefined" ? localStorage.getItem("starkora_active_business_name") : null;
  const fallbackStoredType = typeof window !== "undefined" ? localStorage.getItem("starkora_active_business_type") : null;
  const fallbackStoredLoc = typeof window !== "undefined" ? localStorage.getItem("starkora_active_location") : null;

  const rawName = context?.businessName || fallbackStoredName || "STARKORA";
  const name = rawName.replace(/^welcome\s+to\s+/i, "").replace(/^the\s+/i, "").trim() || "STARKORA";

  const rawType = context?.businessType || fallbackStoredType || "Professional Enterprise";
  const type = rawType.replace(/^welcome\s+to\s+/i, "").trim();
  const loc = context?.location || fallbackStoredLoc || "Lagos, Nigeria";

  return {
    root: {
      fields: {
        title: { type: "text" },
        palette: {
          type: "select",
          options: [
            { label: "Sapphire Ocean (#005AAD - Primary)", value: "sapphire" },
            { label: "Midnight Indigo (Tech & Modern)", value: "indigo" },
            { label: "Emerald Growth (Fintech & Dining)", value: "emerald" },
            { label: "Obsidian Gold (Luxury & Real Estate)", value: "gold" },
            { label: "Crimson Bold (Creative & Fashion)", value: "crimson" },
            { label: "Minimal Studio (Clean Monochrome)", value: "minimal" },
          ],
        },
        font: {
          type: "select",
          options: [
            { label: "Plus Jakarta Sans (Startup & Modern)", value: "jakarta" },
            { label: "Inter (Clean & Minimal)", value: "inter" },
            { label: "Playfair Display (Luxury Serif)", value: "playfair" },
            { label: "Cinzel (Classic Prestige)", value: "cinzel" },
            { label: "Space Grotesk (Creative Agency)", value: "space" },
            { label: "JetBrains Mono (Technical)", value: "mono" },
          ],
        },
      },
      defaultProps: {
        title: `${name} | Official Website`,
        palette: "sapphire",
        font: "jakarta",
      },
      render: ({ children, palette = "sapphire", font = "jakarta" }) => {
        const activePalette = paletteDefinitions[palette] || paletteDefinitions.sapphire;
        const activeFont = fontFamilies[font] || fontFamilies.jakarta;

        return (
          <div
            style={
              {
                "--starkora-primary": activePalette.primary,
                "--starkora-primary-text": activePalette.primaryText,
                "--starkora-accent": activePalette.accent,
                "--starkora-glow": activePalette.glow,
                "--starkora-gradient-start": activePalette.gradientStart,
                "--starkora-gradient-end": activePalette.gradientEnd,
                "--starkora-card-border": activePalette.cardBorder,
                "--starkora-badge-bg": activePalette.badgeBg,
                "--starkora-badge-text": activePalette.badgeText,
                fontFamily: activeFont,
              } as React.CSSProperties
            }
            className="min-h-screen bg-slate-950 text-white transition-all selection:bg-sky-500/30"
          >
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link
              href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;800&family=Inter:wght@400;600;800&family=JetBrains+Mono:wght@400;700&family=Playfair+Display:ital,wght@0,600;0,800;1,600&family=Plus+Jakarta+Sans:wght@500;700;800&family=Space+Grotesk:wght@500;700&display=swap"
              rel="stylesheet"
            />
            {children}
          </div>
        );
      },
    },

    components: {
      NavbarBlock: {
        fields: {
          brandName: { type: "text" },
          logoUrl: {
            type: "custom",
            render: ({ value, onChange }) => (
              <ImageFieldManager value={value} onChange={onChange} label="Brand Logo" />
            ),
          },
          ctaLabel: { type: "text" },
          ctaLink: { type: "text" },
        },
        defaultProps: {
          brandName: name,
          logoUrl: "",
          ctaLabel: "Inquire Now",
          ctaLink: "/contact",
        },
        render: ({ brandName, logoUrl, ctaLabel, ctaLink }) => {
          const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

          return (
            <header className="w-full bg-slate-950/85 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50 py-3.5 px-4 sm:px-8">
              <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 min-w-0">
                  <a
                    href="/"
                    onClick={(e) => navigateToTarget(e, "/")}
                    className="flex items-center gap-2.5 truncate"
                  >
                    {logoUrl ? (
                      <img src={logoUrl} alt={brandName} className="h-8 max-w-[130px] object-contain shrink-0" />
                    ) : (
                      <span className="w-2.5 h-2.5 rounded-full inline-block shrink-0" style={{ backgroundColor: "var(--starkora-primary)" }} />
                    )}
                    <span className="text-base sm:text-lg font-black tracking-tight text-white truncate max-w-[160px] sm:max-w-[260px]">
                      {brandName}
                    </span>
                  </a>
                </div>

                <nav className="hidden md:flex items-center gap-6 text-xs uppercase tracking-wider font-semibold text-slate-300">
                  <a href="/" onClick={(e) => navigateToTarget(e, "/")} className="hover:text-white transition">Home</a>
                  <a href="/about" onClick={(e) => navigateToTarget(e, "/about")} className="hover:text-white transition">About</a>
                  <a href="/services" onClick={(e) => navigateToTarget(e, "/services")} className="hover:text-white transition">Services</a>
                  <a href="/contact" onClick={(e) => navigateToTarget(e, "/contact")} className="hover:text-white transition">Contact</a>
                </nav>

                <div className="flex items-center gap-2.5 shrink-0">
                  <a
                    href={ctaLink}
                    onClick={(e) => navigateToTarget(e, ctaLink)}
                    style={{
                      backgroundColor: "var(--starkora-primary)",
                      color: "var(--starkora-primary-text)",
                    }}
                    className="hidden sm:inline-flex px-4 py-2 text-xs font-bold rounded-xl shadow transition hover:brightness-110"
                  >
                    {ctaLabel}
                  </a>

                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="md:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:text-white hover:bg-slate-800 transition"
                    aria-label="Toggle navigation menu"
                  >
                    {mobileMenuOpen ? (
                      <span className="text-base font-bold">✕</span>
                    ) : (
                      <span className="text-base font-bold">☰</span>
                    )}
                  </button>
                </div>
              </div>

              {mobileMenuOpen && (
                <div className="md:hidden mt-3 pt-3 border-t border-slate-800/80 space-y-3 pb-2 text-left">
                  <nav className="flex flex-col space-y-2 text-sm font-semibold text-slate-300">
                    <a
                      href="/"
                      onClick={(e) => {
                        setMobileMenuOpen(false);
                        navigateToTarget(e, "/");
                      }}
                      className="px-3 py-2 rounded-lg hover:bg-slate-900 transition"
                    >
                      Home
                    </a>
                    <a
                      href="/about"
                      onClick={(e) => {
                        setMobileMenuOpen(false);
                        navigateToTarget(e, "/about");
                      }}
                      className="px-3 py-2 rounded-lg hover:bg-slate-900 transition"
                    >
                      About Us
                    </a>
                    <a
                      href="/services"
                      onClick={(e) => {
                        setMobileMenuOpen(false);
                        navigateToTarget(e, "/services");
                      }}
                      className="px-3 py-2 rounded-lg hover:bg-slate-900 transition"
                    >
                      Services & Packages
                    </a>
                    <a
                      href="/contact"
                      onClick={(e) => {
                        setMobileMenuOpen(false);
                        navigateToTarget(e, "/contact");
                      }}
                      className="px-3 py-2 rounded-lg hover:bg-slate-900 transition"
                    >
                      Contact
                    </a>
                  </nav>

                  <div className="pt-2 border-t border-slate-800/60">
                    <a
                      href={ctaLink}
                      onClick={(e) => {
                        setMobileMenuOpen(false);
                        navigateToTarget(e, ctaLink);
                      }}
                      style={{
                        backgroundColor: "var(--starkora-primary)",
                        color: "var(--starkora-primary-text)",
                      }}
                      className="w-full py-2.5 text-center text-xs font-bold rounded-xl shadow transition block"
                    >
                      {ctaLabel}
                    </a>
                  </div>
                </div>
              )}
            </header>
          );
        },
      },

      HeroBlock: {
        fields: {
          layout: {
            type: "radio",
            options: [
              { label: "Text Left, Image Right", value: "text-left" },
              { label: "Image Left, Text Right", value: "image-left" },
              { label: "Centered Banner", value: "centered" },
            ],
          },
          badgeText: { type: "text" },
          heading: { type: "text" },
          subheading: { type: "textarea" },
          ctaText: { type: "text" },
          ctaLink: { type: "text" },
          imageUrl: {
            type: "custom",
            render: ({ value, onChange }) => (
              <ImageFieldManager value={value} onChange={onChange} label="Hero Image / Photo" />
            ),
          },
          theme: {
            type: "radio",
            options: [
              { label: "Light", value: "light" },
              { label: "Dark", value: "dark" },
              { label: "Gradient", value: "gradient" },
            ],
          },
        },
        defaultProps: {
          layout: "text-left",
          badgeText: "PREMIER SERVICE",
          heading: `${name}`,
          subheading: `Exceptional ${type} crafted with passion, quality, and dedication across${loc}.`,
          ctaText: "Explore Packages",
          ctaLink: "/services",
          imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
          theme: "gradient",
        },
        render: ({ layout = "text-left", badgeText, heading, subheading, ctaText, ctaLink, imageUrl, theme }) => {
          const isGradient = theme === "gradient";
          const isCentered = layout === "centered";
          const isImageLeft = layout === "image-left";

          return (
            <section
              style={
                isGradient
                  ? {
                      background:
                        "radial-gradient(ellipse 80% 50% at 50% -20%, var(--starkora-glow), transparent), linear-gradient(180deg, var(--starkora-gradient-start) 0%, #020617 100%)",
                    }
                  : {}
              }
              className={`py-20 sm:py-24 px-6 relative transition-colors ${
                theme === "light" ? "bg-white text-slate-900" : "bg-slate-950 text-white"
              }`}
            >
              <div
                className={`max-w-6xl mx-auto ${
                  isCentered
                    ? "flex flex-col items-center text-center space-y-8"
                    : "grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
                }`}
              >
                <div
                  className={`space-y-6 ${
                    isCentered ? "max-w-3xl text-center" : isImageLeft ? "lg:order-last text-left" : "text-left"
                  }`}
                >
                  {badgeText && (
                    <div className="inline-block">
                      <span
                        style={{
                          backgroundColor: "var(--starkora-badge-bg)",
                          color: "var(--starkora-badge-text)",
                          borderColor: "var(--starkora-card-border)",
                        }}
                        className="px-3.5 py-1 rounded-full text-xs font-bold tracking-widest uppercase border inline-flex items-center gap-1.5"
                      >
                        <span
                          style={{ backgroundColor: "var(--starkora-accent)" }}
                          className="w-1.5 h-1.5 rounded-full"
                        />
                        {badgeText}
                      </span>
                    </div>
                  )}

                  <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                    {heading}
                  </h1>
                  <p className="text-sm sm:text-base opacity-85 leading-relaxed max-w-xl text-slate-300">
                    {subheading}
                  </p>
                  <div>
                    <a
                      href={ctaLink}
                      onClick={(e) => navigateToTarget(e, ctaLink)}
                      style={{
                        backgroundColor: "var(--starkora-primary)",
                        color: "var(--starkora-primary-text)",
                        boxShadow: "0 10px 25px -5px var(--starkora-glow)",
                      }}
                      className="inline-block px-7 py-3.5 rounded-xl font-bold shadow-xl transition hover:brightness-110 text-sm cursor-pointer"
                    >
                      {ctaText}
                    </a>
                  </div>
                </div>

                {imageUrl && (
                  <div className={`w-full ${isCentered ? "max-w-4xl" : isImageLeft ? "lg:order-first" : ""}`}>
                    <div
                      style={{ borderColor: "var(--starkora-card-border)" }}
                      className="rounded-2xl overflow-hidden shadow-2xl border aspect-video lg:aspect-square max-h-[420px] w-full bg-slate-900 flex items-center justify-center relative group"
                    >
                      <img
                        src={imageUrl}
                        alt={heading}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80";
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            </section>
          );
        },
      },

      AboutTeaserBlock: {
        fields: {
          sectionBadge: { type: "text" },
          heading: { type: "text" },
          storyText: { type: "textarea" },
          imageUrl: {
            type: "custom",
            render: ({ value, onChange }) => (
              <ImageFieldManager value={value} onChange={onChange} label="About Visual / Story Photo" />
            ),
          },
          ctaText: { type: "text" },
          ctaLink: { type: "text" },
        },
        defaultProps: {
          sectionBadge: "OUR MISSION",
          heading: `Crafted with Purpose & Integrity`,
          storyText: `At ${name}, our journey started with a singular dedication: delivering uncompromised quality in ${type} for clients who value authenticity, transparency, and rapid delivery across${loc}.`,
          imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1000&auto=format&fit=crop&q=80",
          ctaText: "Read Full Story ➔",
          ctaLink: "/about",
        },
        render: ({ sectionBadge, heading, storyText, imageUrl, ctaText, ctaLink }) => (
          <section className="py-24 px-6 bg-slate-900/30 border-t border-slate-900 text-left">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="aspect-video lg:aspect-[4/3] w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-xl relative">
                <img
                  src={imageUrl}
                  alt={heading}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80";
                  }}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-6">
                {sectionBadge && (
                  <span
                    style={{
                      backgroundColor: "var(--starkora-badge-bg)",
                      color: "var(--starkora-badge-text)",
                    }}
                    className="px-3.5 py-1 rounded-full text-xs font-bold tracking-widest uppercase inline-block"
                  >
                    {sectionBadge}
                  </span>
                )}

                <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                  {heading}
                </h2>

                <p className="text-sm text-slate-300 leading-relaxed">
                  {storyText}
                </p>

                <div className="space-y-3 pt-2 text-xs text-slate-400">
                  <div className="flex items-center gap-2.5">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>Verified customer satisfaction and quality assurance.</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>Responsive direct support on WhatsApp and email.</span>
                  </div>
                </div>

                <div className="pt-2">
                  <a
                    href={ctaLink}
                    onClick={(e) => navigateToTarget(e, ctaLink)}
                    className="inline-block text-xs font-bold tracking-wide uppercase text-sky-400 hover:text-sky-300 transition"
                  >
                    {ctaText}
                  </a>
                </div>
              </div>
            </div>
          </section>
        ),
      },

      ServicesGridBlock: {
        fields: {
          sectionBadge: { type: "text" },
          sectionTitle: { type: "text" },
          sectionSubtitle: { type: "textarea" },
          services: {
            type: "array",
            arrayFields: {
              title: { type: "text" },
              description: { type: "textarea" },
              price: { type: "text" },
              ctaText: { type: "text" },
            },
          },
        },
        defaultProps: {
          sectionBadge: "WHAT WE DELIVER",
          sectionTitle: "Specialized Service Offerings",
          sectionSubtitle: `Explore our specialized solutions engineered for measurable client satisfaction.`,
          services: [
            {
              title: "Essential Package",
              description: `Entry tier ${type} delivery with personalized consultation.`,
              price: "₦35,000",
              ctaText: "Inquire Now",
            },
            {
              title: "Executive Masterclass",
              description: `Priority engagement including full custom specifications.`,
              price: "₦85,000",
              ctaText: "Book Service",
            },
            {
              title: "Full Bespoke Retainer",
              description: `Comprehensive turnkey execution tailored to executive requirements.`,
              price: "₦180,000",
              ctaText: "Request Quote",
            },
          ],
        },
        render: ({ sectionBadge, sectionTitle, sectionSubtitle, services }) => (
          <section className="py-24 px-6 bg-slate-950 border-t border-slate-900 text-left">
            <div className="max-w-6xl mx-auto space-y-12">
              <div className="text-center space-y-3 max-w-2xl mx-auto">
                {sectionBadge && (
                  <span
                    style={{
                      backgroundColor: "var(--starkora-badge-bg)",
                      color: "var(--starkora-badge-text)",
                    }}
                    className="px-3.5 py-1 rounded-full text-xs font-bold tracking-widest uppercase inline-block"
                  >
                    {sectionBadge}
                  </span>
                )}
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">{sectionTitle}</h2>
                <p className="text-sm text-slate-400">{sectionSubtitle}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {services?.map((svc, idx) => (
                  <div
                    key={idx}
                    style={{ borderColor: "var(--starkora-card-border)" }}
                    className="rounded-2xl border bg-slate-900/60 p-7 flex flex-col justify-between space-y-6 hover:-translate-y-1.5 transition duration-300 shadow-xl"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">0{idx + 1}</span>
                        <span className="text-sm font-black" style={{ color: "var(--starkora-accent)" }}>{svc.price}</span>
                      </div>
                      <h3 className="text-xl font-bold text-white">{svc.title}</h3>
                      <p className="text-xs text-slate-300 leading-relaxed">{svc.description}</p>
                    </div>

                    <a
                      href="#contact"
                      className="w-full py-2.5 rounded-xl text-center text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white transition block"
                    >
                      {svc.ctaText || "Select Service"} ➔
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ),
      },

      GalleryGridBlock: {
        fields: {
          sectionTitle: { type: "text" },
          sectionSubtitle: { type: "textarea" },
          items: {
            type: "array",
            arrayFields: {
              title: { type: "text" },
              description: { type: "textarea" },
              imageUrl: {
                type: "custom",
                render: ({ value, onChange }) => (
                  <ImageFieldManager value={value} onChange={onChange} label="Gallery Photo" />
                ),
              },
            },
          },
        },
        defaultProps: {
          sectionTitle: "Signature Gallery",
          sectionSubtitle: "Explore our latest deliverables, client projects, and visual portfolio.",
          items: [
            {
              title: "Executive Masterpiece",
              description: "Custom crafted with premier materials and attention to detail.",
              imageUrl: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80",
            },
            {
              title: "Modern Collection",
              description: "Designed for contemporary aesthetics and high-impact presence.",
              imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80",
            },
            {
              title: "Bespoke Portfolio",
              description: "Engineered specifically to client requirements and exact specifications.",
              imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80",
            },
          ],
        },
        render: ({ sectionTitle, sectionSubtitle, items }) => (
          <section className="py-24 px-6 bg-slate-900/40 text-white border-t border-slate-900">
            <div className="max-w-6xl mx-auto space-y-12">
              <div className="text-center space-y-3 max-w-2xl mx-auto">
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">{sectionTitle}</h2>
                <p className="text-slate-400 text-sm">{sectionSubtitle}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {items?.map((item, idx) => (
                  <div
                    key={idx}
                    style={{ borderColor: "var(--starkora-card-border)" }}
                    className="rounded-2xl border bg-slate-950 overflow-hidden shadow-xl hover:-translate-y-1.5 transition duration-300 flex flex-col justify-between group"
                  >
                    <div className="aspect-video w-full overflow-hidden bg-slate-900 relative">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80";
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                    </div>
                    <div className="p-6 space-y-2 text-left">
                      <h3 className="text-lg font-bold text-white">{item.title}</h3>
                      <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ),
      },

      FeatureGridBlock: {
        fields: {
          sectionBadge: { type: "text" },
          sectionTitle: { type: "text" },
          features: {
            type: "array",
            arrayFields: {
              title: { type: "text" },
              description: { type: "textarea" },
            },
          },
        },
        defaultProps: {
          sectionBadge: "WHY CHOOSE US",
          sectionTitle: `Why Clients Choose ${name}`,
          features: [
            {
              title: "Verified Craftsmanship",
              description: `Committed to the highest quality standards in ${type}.`,
            },
            {
              title: "Punctual Delivery",
              description: `Rapid execution tailored to our clients across ${loc}.`,
            },
            {
              title: "Transparent Pricing",
              description: "Clear expectations and direct communication with zero hidden charges.",
            },
          ],
        },
        render: ({ sectionBadge, sectionTitle, features }) => (
          <section className="py-24 px-6 bg-slate-950 text-white border-t border-slate-900">
            <div className="max-w-6xl mx-auto space-y-12">
              <div className="text-center space-y-3">
                {sectionBadge && (
                  <span
                    style={{
                      backgroundColor: "var(--starkora-badge-bg)",
                      color: "var(--starkora-badge-text)",
                    }}
                    className="px-3.5 py-1 rounded-full text-xs font-bold tracking-widest uppercase inline-block"
                  >
                    {sectionBadge}
                  </span>
                )}
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">{sectionTitle}</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                {features?.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      borderColor: "var(--starkora-card-border)",
                      backgroundColor: "rgba(15, 23, 42, 0.6)",
                    }}
                    className="p-8 rounded-2xl border backdrop-blur-sm shadow-sm hover:shadow-xl transition hover:-translate-y-1 duration-200"
                  >
                    <div
                      style={{
                        backgroundColor: "var(--starkora-badge-bg)",
                        color: "var(--starkora-accent)",
                      }}
                      className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-base mb-6"
                    >
                      0{idx + 1}
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-white">{item.title}</h3>
                    <p className="text-slate-400 leading-relaxed text-sm">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ),
      },

      PricingBlock: {
        fields: {
          sectionTitle: { type: "text" },
          sectionSubtitle: { type: "text" },
          plans: {
            type: "array",
            arrayFields: {
              name: { type: "text" },
              price: { type: "text" },
              features: { type: "textarea" },
              isPopular: {
                type: "radio",
                options: [
                  { label: "Yes", value: true },
                  { label: "No", value: false },
                ],
              },
              ctaText: { type: "text" },
            },
          },
        },
        defaultProps: {
          sectionTitle: "Curated Packages",
          sectionSubtitle: "Simple, transparent pricing tailored to your needs.",
          plans: [
            {
              name: "Standard Package",
              price: "₦35,000",
              features: `Complete ${type} Delivery\nDirect Support & Consultation\nStandard Quality Assurance`,
              isPopular: false,
              ctaText: "Order Standard",
            },
            {
              name: "Executive Tier",
              price: "₦95,000",
              features: `Priority Execution\nDedicated Support Line\nExtended Warranty\nCustom Specifications Included`,
              isPopular: true,
              ctaText: "Select Executive",
            },
          ],
        },
        render: ({ sectionTitle, sectionSubtitle, plans }) => (
          <section className="py-24 px-6 bg-slate-900/60 text-white border-t border-slate-800">
            <div className="max-w-5xl mx-auto text-center space-y-4 mb-14">
              <h2 className="text-3xl sm:text-4xl font-extrabold">{sectionTitle}</h2>
              <p className="text-slate-400 text-sm">{sectionSubtitle}</p>
            </div>

            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              {plans?.map((plan, idx) => (
                <div
                  key={idx}
                  style={
                    plan.isPopular
                      ? {
                          borderColor: "var(--starkora-primary)",
                          boxShadow: "0 20px 40px -15px var(--starkora-glow)",
                        }
                      : { borderColor: "rgba(51, 65, 85, 0.6)" }
                  }
                  className={`p-8 rounded-2xl border flex flex-col justify-between space-y-6 ${
                    plan.isPopular ? "bg-slate-900/90 relative" : "bg-slate-950/60"
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                      {plan.isPopular && (
                        <span
                          style={{
                            backgroundColor: "var(--starkora-badge-bg)",
                            color: "var(--starkora-badge-text)",
                          }}
                          className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-sky-500/20"
                        >
                          Recommended
                        </span>
                      )}
                    </div>
                    <div
                      style={{ color: "var(--starkora-accent)" }}
                      className="text-4xl font-black mb-6"
                    >
                      {plan.price}
                    </div>
                    <ul className="text-sm text-slate-300 space-y-3 text-left">
                      {plan.features?.split("\n").map((f, i) => (
                        <li key={i} className="flex items-center gap-2.5">
                          <span style={{ color: "var(--starkora-accent)" }} className="font-bold">
                            ✓
                          </span>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <a
                    href="#contact"
                    style={
                      plan.isPopular
                        ? {
                            backgroundColor: "var(--starkora-primary)",
                            color: "var(--starkora-primary-text)",
                          }
                        : {}
                    }
                    className={`w-full py-3.5 text-center rounded-xl font-bold text-sm transition hover:brightness-110 ${
                      plan.isPopular
                        ? "shadow-lg text-white"
                        : "bg-slate-800 hover:bg-slate-700 text-slate-200"
                    }`}
                  >
                    {plan.ctaText || "Select Plan"}
                  </a>
                </div>
              ))}
            </div>
          </section>
        ),
      },

      TestimonialBlock: {
        fields: {
          sectionBadge: { type: "text" },
          sectionTitle: { type: "text" },
          testimonials: {
            type: "array",
            arrayFields: {
              quote: { type: "textarea" },
              author: { type: "text" },
              role: { type: "text" },
              company: { type: "text" },
              rating: { type: "number" },
            },
          },
        },
        defaultProps: {
          sectionBadge: "CLIENT REVIEWS",
          sectionTitle: "Endorsed by Industry Leaders",
          testimonials: [
            {
              quote: `Working with ${name} was effortless. Their commitment to quality and punctuality exceeded all expectations.`,
              author: "Alhaji Ibrahim Danjuma",
              role: "Managing Director",
              company: "Danjuma Holdings",
              rating: 5,
            },
            {
              quote: `The speed of execution and attention to detail transformed our operations completely. Outstanding professionalism.`,
              author: "Chioma Adeleke",
              role: "Creative Director",
              company: "Adeleke Luxury Brand",
              rating: 5,
            },
            {
              quote: `Their team delivers verified results with zero downtime. Highly recommended for any serious business.`,
              author: "Tunde Babalola",
              role: "Principal Broker",
              company: "Apex Capital Properties",
              rating: 5,
            },
          ],
        },
        render: ({ sectionBadge, sectionTitle, testimonials }) => (
          <section className="py-24 px-6 bg-slate-950 text-white border-t border-slate-900 text-left">
            <div className="max-w-6xl mx-auto space-y-12">
              <div className="text-center space-y-3 max-w-2xl mx-auto">
                {sectionBadge && (
                  <span
                    style={{
                      backgroundColor: "var(--starkora-badge-bg)",
                      color: "var(--starkora-badge-text)",
                    }}
                    className="px-3.5 py-1 rounded-full text-xs font-bold tracking-widest uppercase inline-block"
                  >
                    {sectionBadge}
                  </span>
                )}
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">{sectionTitle}</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {testimonials?.map((t, idx) => (
                  <div
                    key={idx}
                    style={{ borderColor: "var(--starkora-card-border)" }}
                    className="p-8 rounded-2xl border bg-slate-900/60 flex flex-col justify-between space-y-6 shadow-xl hover:-translate-y-1 transition duration-200"
                  >
                    <div className="space-y-4">
                      <div className="text-amber-400 text-sm tracking-widest">
                        {"★".repeat(t.rating || 5)}
                      </div>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                        &quot;{t.quote}&quot;
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-800">
                      <h4 className="font-bold text-white text-sm">{t.author}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {t.role} • <span style={{ color: "var(--starkora-accent)" }}>{t.company}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ),
      },

      ContactWhatsAppBlock: {
        fields: {
          title: { type: "text" },
          subtitle: { type: "textarea" },
          phoneNumber: { type: "text" },
          whatsappMessage: { type: "text" },
          email: { type: "text" },
          location: { type: "text" },
        },
        defaultProps: {
          title: `Connect With ${name}`,
          subtitle: `Send us a message below or contact us directly. We respond promptly during business hours.`,
          phoneNumber: "+2348012345678",
          whatsappMessage: `Hello ${name}, I would like to inquire about your services.`,
          email: `contact@${name.toLowerCase().replace(/[^a-z0-9]/g, "") || "business"}.com`,
          location: loc,
        },
        render: ({ title, subtitle, phoneNumber, whatsappMessage, email, location }) => {
          const cleanNumber = phoneNumber?.replace(/[^0-9]/g, "") || "";
          const encodedMsg = encodeURIComponent(whatsappMessage || "Hello!");
          const whatsappUrl = cleanNumber ? `https://wa.me/${cleanNumber}?text=${encodedMsg}` : "";

          return (
            <section id="contact" className="py-24 px-6 bg-slate-900/40 text-white border-t border-slate-800">
              <div className="max-w-4xl mx-auto space-y-12">
                <div className="text-center space-y-3">
                  <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">{title}</h2>
                  <p className="text-slate-400 max-w-xl mx-auto text-sm">{subtitle}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start text-left">
                  <div className="bg-slate-950/70 border border-slate-800 p-6 rounded-2xl space-y-6">
                    <h3 className="text-lg font-bold text-white">Direct Information</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Have questions or require assistance? You can reach us directly via email or our phone line.
                    </p>
                    <div className="space-y-3">
                      <a
                        href={`mailto:${email}`}
                        className="w-full py-3.5 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 text-sm text-white transition shadow-lg hover:brightness-110"
                        style={{ backgroundColor: "var(--starkora-primary)" }}
                      >
                        <span>✉️ Email Us Directly</span>
                      </a>
                      {whatsappUrl && (
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-3.5 px-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl font-semibold flex items-center justify-center gap-2 text-sm text-emerald-400 transition"
                        >
                          <span>💬 Chat on WhatsApp</span>
                        </a>
                      )}
                    </div>
                    <div className="pt-4 border-t border-slate-800 text-xs text-slate-500 space-y-1">
                      <p>📍 Location: {location}</p>
                      {phoneNumber && <p>📞 Phone: {phoneNumber}</p>}
                      <p>✉️ Email: {email}</p>
                    </div>
                  </div>

                  <div className="bg-slate-950/70 border border-slate-800 p-6 rounded-2xl">
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        const target = e.target as HTMLFormElement;
                        const formData = new FormData(target);
                        const senderName = formData.get("name") as string;
                        const senderEmail = formData.get("email") as string;
                        const senderPhone = formData.get("phone") as string;
                        const senderMessage = formData.get("message") as string;
                        const submitBtn = target.querySelector("button[type='submit']") as HTMLButtonElement;

                        if (submitBtn) {
                          submitBtn.disabled = true;
                          submitBtn.innerText = "Sending Message...";
                        }

                        try {
                          const searchParams = new URLSearchParams(window.location.search);
                          const paramSiteId = searchParams.get("siteId");
                          const pathSegments = window.location.pathname.split("/").filter(Boolean);
                          let siteIdentifier = "";

                          if (pathSegments[0] === "live" && pathSegments[1]) {
                            siteIdentifier = decodeURIComponent(pathSegments[1]);
                          } else if (paramSiteId) {
                            siteIdentifier = paramSiteId;
                          } else {
                            siteIdentifier = window.location.hostname;
                          }

                          const res = await fetch("/api/leads/submit", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              siteId: siteIdentifier,
                              name: senderName,
                              email: senderEmail,
                              phone: senderPhone,
                              message: senderMessage,
                            }),
                          });

                          const result = await res.json();
                          if (res.ok) {
                            alert("Thank you! Your message has been sent successfully. The site owner will respond to your email shortly.");
                            target.reset();
                          } else {
                            alert(result.error || "Failed to submit message.");
                          }
                        } catch {
                          alert("An error occurred while sending your message.");
                        } finally {
                          if (submitBtn) {
                            submitBtn.disabled = false;
                            submitBtn.innerText = "Send Message ➔";
                          }
                        }
                      }}
                      className="space-y-4"
                    >
                      <h3 className="text-lg font-bold text-white">Send a Message</h3>
                      <div>
                        <label className="block text-[11px] uppercase font-semibold text-slate-400 mb-1">
                          Your Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          required
                          placeholder="e.g. Tunde Balogun"
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] uppercase font-semibold text-slate-400 mb-1">
                            Your Email Address
                          </label>
                          <input
                            type="email"
                            name="email"
                            required
                            placeholder="tunde@gmail.com"
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] uppercase font-semibold text-slate-400 mb-1">
                            Phone (Optional)
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            placeholder="+234..."
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[11px] uppercase font-semibold text-slate-400 mb-1">
                          Your Inquiry or Request
                        </label>
                        <textarea
                          name="message"
                          rows={3}
                          required
                          placeholder="Tell us what you are looking for..."
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                        />
                      </div>
                      <button
                        type="submit"
                        style={{
                          backgroundColor: "var(--starkora-primary)",
                          color: "var(--starkora-primary-text)",
                        }}
                        className="w-full py-3.5 font-bold rounded-xl text-sm transition hover:brightness-110 shadow-lg cursor-pointer"
                      >
                        Send Message ➔
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </section>
          );
        },
      },

      NewsletterBlock: {
        fields: {
          title: { type: "text" },
          subtitle: { type: "textarea" },
          buttonText: { type: "text" },
        },
        defaultProps: {
          title: "Stay Informed with Our Updates",
          subtitle: `Subscribe to receive seasonal promotions, announcements, and news from ${name} directly in your inbox.`,
          buttonText: "Subscribe",
        },
        render: ({ title, subtitle, buttonText }) => (
          <section className="py-20 px-6 bg-slate-900 text-white border-t border-slate-800 text-center">
            <div className="max-w-2xl mx-auto space-y-6">
              <h2 className="text-3xl font-extrabold tracking-tight">{title}</h2>
              <p className="text-sm text-slate-400">{subtitle}</p>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const target = e.target as HTMLFormElement;
                  const emailInput = target.querySelector("input[type='email']") as HTMLInputElement;
                  const emailVal = emailInput?.value;
                  if (!emailVal) return;

                  try {
                    const pathSegments = window.location.pathname.split("/").filter(Boolean);
                    let siteId = pathSegments[0] === "live" && pathSegments[1] ? pathSegments[1] : window.location.hostname;

                    const res = await fetch("/api/newsletter/subscribe", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ siteId, email: emailVal }),
                    });

                    if (res.ok) {
                      alert("Thank you for subscribing!");
                      target.reset();
                    } else {
                      alert("Subscription failed. Please try again.");
                    }
                  } catch {
                    alert("Error submitting subscription.");
                  }
                }}
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              >
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-sky-500"
                />
                <button
                  type="submit"
                  style={{
                    backgroundColor: "var(--starkora-primary)",
                    color: "var(--starkora-primary-text)",
                  }}
                  className="px-6 py-3 rounded-xl font-bold text-sm transition hover:brightness-110 shadow-lg whitespace-nowrap cursor-pointer"
                >
                  {buttonText}
                </button>
              </form>
            </div>
          </section>
        ),
      },

      FooterBlock: {
        fields: {
          brandName: { type: "text" },
          logoUrl: {
            type: "custom",
            render: ({ value, onChange }) => (
              <ImageFieldManager value={value} onChange={onChange} label="Footer Logo" />
            ),
          },
          tagline: { type: "textarea" },
          copyrightText: { type: "text" },
          instagram: { type: "text" },
          whatsapp: { type: "text" },
          twitter: { type: "text" },
          linkedin: { type: "text" },
        },
        defaultProps: {
          brandName: name,
          logoUrl: "",
          tagline: `Industry-leading ${type} solutions across${loc}. Engineered for excellence and verified dependability.`,
          copyrightText: `© ${new Date().getFullYear()}${name}. Powered by STARKORA.`,
          instagram: "https://instagram.com",
          whatsapp: "https://wa.me/2348012345678",
          twitter: "https://x.com",
          linkedin: "https://linkedin.com",
        },
        render: ({ brandName, logoUrl, tagline, copyrightText, instagram, whatsapp, twitter, linkedin }) => (
          <footer className="py-14 px-6 sm:px-12 bg-slate-950 text-slate-400 text-xs border-t border-slate-900 text-left">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-900">
              <div className="md:col-span-2 space-y-4">
                <div className="flex items-center gap-2.5">
                  {logoUrl ? (
                    <img src={logoUrl} alt={brandName} className="h-7 max-w-[140px] object-contain" />
                  ) : (
                    <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: "var(--starkora-primary)" }} />
                  )}
                  <span className="text-base font-black tracking-tight text-white">{brandName}</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                  {tagline}
                </p>
              </div>

              <div className="space-y-3">
                <span className="font-bold text-white text-xs uppercase tracking-wider">Quick Navigation</span>
                <ul className="space-y-2 text-xs">
                  <li><a href="/" onClick={(e) => navigateToTarget(e, "/")} className="hover:text-white transition">Home</a></li>
                  <li><a href="/about" onClick={(e) => navigateToTarget(e, "/about")} className="hover:text-white transition">About Us</a></li>
                  <li><a href="/services" onClick={(e) => navigateToTarget(e, "/services")} className="hover:text-white transition">Services & Rates</a></li>
                  <li><a href="/contact" onClick={(e) => navigateToTarget(e, "/contact")} className="hover:text-white transition">Contact Us</a></li>
                </ul>
              </div>

              <div className="space-y-3">
                <span className="font-bold text-white text-xs uppercase tracking-wider">Connect Channels</span>
                <div className="flex flex-wrap gap-2 pt-1">
                  {instagram && (
                    <a href={instagram} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 hover:text-white transition">
                      Instagram
                    </a>
                  )}
                  {whatsapp && (
                    <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-emerald-400 hover:text-emerald-300 transition">
                      WhatsApp
                    </a>
                  )}
                  {twitter && (
                    <a href={twitter} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 hover:text-white transition">
                      X (Twitter)
                    </a>
                  )}
                  {linkedin && (
                    <a href={linkedin} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 hover:text-white transition">
                      LinkedIn
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="max-w-6xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-600">
              <p>{copyrightText}</p>
              <p className="text-[11px]">Deployed with sub-50ms Anycast Edge Acceleration.</p>
            </div>
          </footer>
        ),
      },
    },
  };
}

export const config = createConfig();