"use client";

import React, { useState } from "react";
import type { Config } from "@puckeditor/core";

export type ThemePalette = "indigo" | "emerald" | "gold" | "crimson" | "minimal";
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
    const prompt = window.prompt("Describe the image you want AI to generate:", "Modern business office space with natural lighting");
    if (!prompt) return;

    setGeneratingAi(true);
    try {
      const res = await fetch("/api/ai/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      if (res.ok && data.url) {
        onChange(data.url);
      } else {
        alert(data.error || "AI image generation failed.");
      }
    } catch {
      alert("Error contacting the AI image engine.");
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
            background: "#4f46e5",
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
    badgeText?: string;
    heading: string;
    subheading: string;
    ctaText: string;
    ctaLink: string;
    imageUrl?: string;
    theme: "light" | "dark" | "gradient";
  };
  FeatureGridBlock: {
    sectionBadge?: string;
    sectionTitle: string;
    features: {
      title: string;
      description: string;
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
    quote: string;
    author: string;
    role: string;
    company: string;
  };
  ContactWhatsAppBlock: {
    title: string;
    subtitle: string;
    phoneNumber: string;
    whatsappMessage: string;
    email: string;
    location: string;
  };
  FooterBlock: {
    copyrightText: string;
  };
};

export interface BusinessContext {
  businessName?: string;
  businessType?: string;
  location?: string;
}

// Dynamic Config Factory: Injects contextual defaults for newly dragged blocks
export function createConfig(context?: BusinessContext): Config<ComponentProps, RootProps> {
  const name = context?.businessName || "STARKORA";
  const type = context?.businessType || "Enterprise Solutions";
  const loc = context?.location || "Lagos, Nigeria";

  return {
    root: {
      fields: {
        title: { type: "text" },
        palette: {
          type: "select",
          options: [
            { label: "Midnight Indigo (Tech & Modern)", value: "indigo" },
            { label: "Emerald Growth (Fintech & Healthcare)", value: "emerald" },
            { label: "Obsidian Gold (Luxury & Real Estate)", value: "gold" },
            { label: "Crimson Bold (Creative & Food)", value: "crimson" },
            { label: "Minimal Studio (Clean Monochrome)", value: "minimal" },
          ],
        },
        font: {
          type: "select",
          options: [
            { label: "Inter (Modern Minimal)", value: "inter" },
            { label: "Plus Jakarta Sans (Startup & Fintech)", value: "jakarta" },
            { label: "Playfair Display (Luxury Editorial Serif)", value: "playfair" },
            { label: "Cinzel (Classic Prestige / High-End)", value: "cinzel" },
            { label: "Space Grotesk (Creative Agency)", value: "space" },
            { label: "JetBrains Mono (Technical / Code)", value: "mono" },
          ],
        },
      },
      defaultProps: {
        title: `${name} | Official Website`,
        palette: "indigo",
        font: "inter",
      },
      render: ({ children, palette = "indigo", font = "inter" }) => {
        const activePalette = paletteDefinitions[palette] || paletteDefinitions.indigo;
        const activeFont = fontFamilies[font] || fontFamilies.inter;

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
            className="min-h-screen bg-slate-950 text-white transition-all selection:bg-indigo-500/30"
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
          ctaLabel: "Contact Us",
          ctaLink: "/contact",
        },
        render: ({ brandName, logoUrl, ctaLabel, ctaLink }) => (
          <header className="w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50 py-4 px-6">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-8">
                <a
                  href="/"
                  onClick={(e) => navigateToTarget(e, "/")}
                  className="flex items-center gap-3"
                >
                  {logoUrl ? (
                    <img src={logoUrl} alt={brandName} className="h-9 max-w-[160px] object-contain" />
                  ) : (
                    <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
                      <span
                        style={{ backgroundColor: "var(--starkora-primary)" }}
                        className="w-2.5 h-2.5 rounded-full inline-block"
                      />
                      {brandName}
                    </span>
                  )}
                </a>

                <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
                  <a href="/" onClick={(e) => navigateToTarget(e, "/")} className="hover:text-white transition cursor-pointer">Home</a>
                  <a href="/about" onClick={(e) => navigateToTarget(e, "/about")} className="hover:text-white transition cursor-pointer">About</a>
                  <a href="/services" onClick={(e) => navigateToTarget(e, "/services")} className="hover:text-white transition cursor-pointer">Services</a>
                  <a href="/contact" onClick={(e) => navigateToTarget(e, "/contact")} className="hover:text-white transition cursor-pointer">Contact</a>
                </nav>
              </div>

              <a
                href={ctaLink}
                onClick={(e) => navigateToTarget(e, ctaLink)}
                style={{
                  backgroundColor: "var(--starkora-primary)",
                  color: "var(--starkora-primary-text)",
                }}
                className="px-5 py-2.5 text-sm font-semibold rounded-xl transition hover:brightness-110 shadow-lg cursor-pointer"
              >
                {ctaLabel}
              </a>
            </div>
          </header>
        ),
      },

      HeroBlock: {
        fields: {
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
          badgeText: "PREMIER SERVICE",
          heading: `${name}: Professional ${type}`,
          subheading: `Delivering industry-leading ${type} solutions across ${loc} with proven expertise, rapid delivery, and complete dependability.`,
          ctaText: "Explore Packages",
          ctaLink: "/services",
          imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80",
          theme: "gradient",
        },
        render: ({ badgeText, heading, subheading, ctaText, ctaLink, imageUrl, theme }) => {
          const isGradient = theme === "gradient";

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
              className={`py-24 px-6 relative transition-colors ${
                theme === "light" ? "bg-white text-slate-900" : "bg-slate-950 text-white"
              }`}
            >
              <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6 text-left">
                  {badgeText && (
                    <div className="inline-block">
                      <span
                        style={{
                          backgroundColor: "var(--starkora-badge-bg)",
                          color: "var(--starkora-badge-text)",
                          borderColor: "var(--starkora-card-border)",
                        }}
                        className="px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase border inline-flex items-center gap-1.5"
                      >
                        <span
                          style={{ backgroundColor: "var(--starkora-accent)" }}
                          className="w-1.5 h-1.5 rounded-full"
                        />
                        {badgeText}
                      </span>
                    </div>
                  )}

                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                    {heading}
                  </h1>
                  <p className="text-lg opacity-85 leading-relaxed max-w-xl text-slate-300">
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
                      className="inline-block px-8 py-4 rounded-xl font-bold shadow-xl transition hover:brightness-110 text-sm cursor-pointer"
                    >
                      {ctaText}
                    </a>
                  </div>
                </div>

                {imageUrl && (
                  <div className="relative">
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
                        className="w-full h-full object-cover"
                      />
                      <div
                        style={{
                          background:
                            "linear-gradient(to top, rgba(2, 6, 23, 0.7) 0%, transparent 60%)",
                        }}
                        className="absolute inset-0 pointer-events-none"
                      />
                    </div>
                  </div>
                )}
              </div>
            </section>
          );
        },
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
                    className="px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase"
                  >
                    {sectionBadge}
                  </span>
                )}
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">{sectionTitle}</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
          sectionTitle: `${type} Packages`,
          sectionSubtitle: "Transparent, value-driven packages designed for your requirements.",
          plans: [
            {
              name: "Standard Package",
              price: "₦35,000",
              features: `Complete ${type} Delivery\nDirect WhatsApp Support\nStandard Quality Assurance`,
              isPopular: false,
              ctaText: "Order Standard",
            },
            {
              name: "Executive Tier",
              price: "₦95,000",
              features: `Priority ${type} Execution\nDedicated Support Line\nExtended Warranty\nCustom Specifications`,
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

            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
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
                          className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-indigo-500/20"
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
                        ? "shadow-lg"
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
          quote: { type: "textarea" },
          author: { type: "text" },
          role: { type: "text" },
          company: { type: "text" },
        },
        defaultProps: {
          quote: `Working with ${name} was effortless. Their commitment to quality and punctuality exceeded all expectations.`,
          author: "Alhaji Ibrahim Danjuma",
          role: "Managing Director",
          company: "Danjuma Holdings",
        },
        render: ({ quote, author, role, company }) => (
          <section className="py-24 px-6 bg-slate-950 text-white border-t border-slate-900 text-center">
            <div className="max-w-3xl mx-auto space-y-6">
              <div style={{ color: "var(--starkora-accent)" }} className="text-5xl font-serif">
                “
              </div>
              <p className="text-xl sm:text-2xl font-medium leading-relaxed italic text-slate-200">
                {quote}
              </p>
              <div className="pt-6 border-t border-slate-800 inline-block">
                <h4 className="font-bold text-white text-base">{author}</h4>
                <p className="text-xs text-slate-400">
                  {role} • <span style={{ color: "var(--starkora-accent)" }}>{company}</span>
                </p>
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
          subtitle: `Reach out via WhatsApp or submit your inquiry below for prompt response.`,
          phoneNumber: "+2348012345678",
          whatsappMessage: `Hello ${name}, I would like to inquire about your ${type}.`,
          email: `contact@${name.toLowerCase().replace(/[^a-z0-9]/g, "") || "business"}.com`,
          location: loc,
        },
        render: ({ title, subtitle, phoneNumber, whatsappMessage, email, location }) => {
          const cleanNumber = phoneNumber?.replace(/[^0-9]/g, "") || "";
          const encodedMsg = encodeURIComponent(whatsappMessage || "Hello!");
          const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodedMsg}`;

          return (
            <section id="contact" className="py-24 px-6 bg-slate-900/40 text-white border-t border-slate-800">
              <div className="max-w-4xl mx-auto space-y-12">
                <div className="text-center space-y-3">
                  <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">{title}</h2>
                  <p className="text-slate-400 max-w-xl mx-auto text-sm">{subtitle}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                  <div className="bg-slate-950/70 border border-slate-800 p-6 rounded-2xl space-y-6">
                    <h3 className="text-lg font-bold text-white">Instant Contact</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Have an urgent inquiry? Reach us immediately on WhatsApp or email.
                    </p>
                    <div className="space-y-3">
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-semibold flex items-center justify-center gap-2 text-sm transition"
                      >
                        <span>💬 Chat on WhatsApp</span>
                      </a>
                      <a
                        href={`mailto:${email}`}
                        className="w-full py-3.5 px-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl font-semibold flex items-center justify-center gap-2 text-sm text-slate-200 transition"
                      >
                        <span>✉️ Send Email</span>
                      </a>
                    </div>
                    <div className="pt-4 border-t border-slate-800 text-xs text-slate-500 space-y-1">
                      <p>📍 Location: {location}</p>
                      <p>📞 Phone: {phoneNumber}</p>
                    </div>
                  </div>

                  <div className="bg-slate-950/70 border border-slate-800 p-6 rounded-2xl">
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        const target = e.target as HTMLFormElement;
                        const formData = new FormData(target);
                        const senderName = formData.get("name") as string;
                        const senderPhone = formData.get("phone") as string;
                        const message = formData.get("message") as string;
                        const submitBtn = target.querySelector("button[type='submit']") as HTMLButtonElement;

                        if (submitBtn) {
                          submitBtn.disabled = true;
                          submitBtn.innerText = "Sending...";
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
                              phone: senderPhone,
                              email: "",
                              message,
                            }),
                          });

                          const result = await res.json();
                          if (res.ok) {
                            alert("Thank you! Your message has been sent. We will contact you shortly.");
                            target.reset();
                          } else {
                            alert(result.error || "Failed to submit message.");
                          }
                        } catch {
                          alert("An error occurred while sending your message.");
                        } finally {
                          if (submitBtn) {
                            submitBtn.disabled = false;
                            submitBtn.innerText = "Send Inquiry ➔";
                          }
                        }
                      }}
                      className="space-y-4"
                    >
                      <h3 className="text-lg font-bold text-white">Leave a Message</h3>
                      <div>
                        <label className="block text-[11px] uppercase font-semibold text-slate-400 mb-1">
                          Your Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          required
                          placeholder="e.g. Tunde Balogun"
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] uppercase font-semibold text-slate-400 mb-1">
                          Phone / WhatsApp Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          required
                          placeholder="e.g. +234 801 234 5678"
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] uppercase font-semibold text-slate-400 mb-1">
                          Message or Service Needed
                        </label>
                        <textarea
                          name="message"
                          rows={3}
                          required
                          placeholder="Tell us what you're looking for..."
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <button
                        type="submit"
                        style={{
                          backgroundColor: "var(--starkora-primary)",
                          color: "var(--starkora-primary-text)",
                        }}
                        className="w-full py-3.5 font-bold rounded-xl text-sm transition hover:brightness-110 shadow-lg"
                      >
                        Send Inquiry ➔
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </section>
          );
        },
      },

      FooterBlock: {
        fields: {
          copyrightText: { type: "text" },
        },
        defaultProps: {
          copyrightText: `© ${new Date().getFullYear()} ${name}. Powered by STARKORA.`,
        },
        render: ({ copyrightText }) => (
          <footer className="py-8 px-6 bg-slate-950 text-slate-500 text-center text-sm border-t border-slate-900">
            <p>{copyrightText}</p>
          </footer>
        ),
      },
    },
  };
}

// Static fallback config export for server renderers
export const config = createConfig();