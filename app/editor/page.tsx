"use client";

import { useState, useEffect } from "react";
import { Puck, type Data } from "@puckeditor/core";
import "@puckeditor/core/puck.css";
import { config, type ComponentProps } from "../../puck.config";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const defaultFallbackData: Data<ComponentProps> = {
  content: [
    {
      type: "NavbarBlock",
      props: {
        id: "navbar-1",
        brandName: "STARKORA",
        ctaLabel: "Contact",
        ctaLink: "#contact",
      },
    },
    {
      type: "HeroBlock",
      props: {
        id: "hero-1",
        heading: "Experience Autonomous Design",
        subheading: "Your site was created by STARKORA. Customize it freely.",
        ctaText: "Explore Now",
        ctaLink: "#contact",
        imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80",
        theme: "gradient",
      },
    },
    {
      type: "FeatureGridBlock",
      props: {
        id: "features-1",
        sectionTitle: "Why STARKORA Stands Out",
        features: [
          {
            title: "Zero Markup Failures",
            description: "Everything is verified against strict JSON interfaces.",
          },
          {
            title: "Global Edge Routing",
            description: "Instantaneous delivery with automatic SSL management.",
          },
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
      props: {
        id: "footer-1",
        copyrightText: "© 2026 STARKORA. All rights reserved.",
      },
    },
  ],
  root: { props: { title: "STARKORA Generated Site" } },
};

export default function EditorPage() {
  const searchParams = useSearchParams();
  const siteId = searchParams.get("siteId");

  const [data, setData] = useState<Data<ComponentProps>>(defaultFallbackData);
  const [editorKey, setEditorKey] = useState(0);
  const [currentSiteId, setCurrentSiteId] = useState<string | null>(siteId);
  const [isLoaded, setIsLoaded] = useState(false);
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);

  // AI Copilot State
  const [aiPrompt, setAiPrompt] = useState("");
  const [isRefining, setIsRefining] = useState(false);

  // Media Upload Modal State
  const [showUploader, setShowUploader] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

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
              setData(JSON.parse(siteJson.site.layoutData));
              setCurrentSiteId(siteJson.site.id);
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
          setData(JSON.parse(saved));
          setEditorKey((k) => k + 1);
        } catch (e) {
          console.error("Failed to parse saved local site", e);
        }
      }
      setIsLoaded(true);
    }

    init();
  }, [siteId]);

  const handleSave = async (savedData: Data<ComponentProps>) => {
    setData(savedData);
    localStorage.setItem("starkora_active_site", JSON.stringify(savedData));

    try {
      const res = await fetch("/api/sites/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteId: currentSiteId,
          name: savedData.root?.props?.title || "My Site",
          layoutData: savedData,
        }),
      });

      if (res.ok) {
        const payload = await res.json();
        if (payload.site?.id) setCurrentSiteId(payload.site.id);
        alert("Site successfully saved to your STARKORA database!");
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
          currentLayout: data,
          instruction: aiPrompt,
        }),
      });

      const resJson = await res.json();
      if (res.ok && resJson.layoutData) {
        setData(resJson.layoutData);
        localStorage.setItem("starkora_active_site", JSON.stringify(resJson.layoutData));
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadedUrl(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const resData = await res.json();
      if (res.ok && resData.url) {
        setUploadedUrl(resData.url);
      } else {
        alert(resData.error || "Upload failed");
      }
    } catch {
      alert("An error occurred while uploading.");
    } finally {
      setUploading(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-950 text-slate-400 font-sans">
        Loading STARKORA Canvas...
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden relative">
      {/* Top Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-2.5 flex items-center justify-between z-50 text-sm">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="font-extrabold text-indigo-400 tracking-wider text-base hover:text-indigo-300 transition"
          >
            STARKORA
          </Link>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300 font-medium text-xs sm:text-sm">
            {data.root?.props?.title || "Draft Site"}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Media Uploader Button */}
          <button
            onClick={() => setShowUploader(true)}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <span>Upload Image 🖼️</span>
          </button>

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

      {/* Puck Visual Canvas */}
      <div className="flex-1 relative">
        <Puck key={editorKey} config={config} data={data} onPublish={handleSave} />
      </div>

      {/* Floating AI Copilot Bar */}
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
            placeholder="e.g. 'Make header professional', 'Add testimonials', 'Add pricing'..."
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
            {isRefining ? "Refining..." : "Update Canvas ➔"}
          </button>
        </form>
      </div>

      {/* Media Upload Modal */}
      {showUploader && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Upload Media Asset</h3>
              <button
                onClick={() => {
                  setShowUploader(false);
                  setUploadedUrl(null);
                }}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕ Close
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Upload your brand logo or photo (JPG, PNG, WEBP, SVG under 5MB).
            </p>

            <div className="space-y-3">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploading}
                className="w-full text-xs text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer"
              />

              {uploading && (
                <p className="text-xs text-indigo-400 font-semibold animate-pulse">
                  Uploading image to STARKORA assets...
                </p>
              )}

              {uploadedUrl && (
                <div className="p-3 bg-slate-950 border border-emerald-500/30 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-emerald-400 font-semibold">✓ Upload Complete!</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(uploadedUrl);
                        alert("Image path copied to clipboard!");
                      }}
                      className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[11px] font-semibold transition"
                    >
                      Copy Path
                    </button>
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 truncate bg-slate-900 p-2 rounded">
                    {uploadedUrl}
                  </div>
                  <p className="text-[10px] text-slate-500">
                    Paste this path into the <strong>imageUrl</strong> or <strong>logoUrl</strong> field in the right sidebar.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}