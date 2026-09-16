"use client";

import { Suspense, useEffect, useState } from "react";
import { Render, type Data } from "@puckeditor/core";
import { config, type ComponentProps, type RootProps } from "../../puck.config";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

type PageSlug = "home" | "about" | "services" | "contact";

function PreviewContent() {
  const searchParams = useSearchParams();
  const pageParam = (searchParams.get("page") as PageSlug) || "home";

  const [activePage, setActivePage] = useState<PageSlug>(pageParam);
  const [siteMap, setSiteMap] = useState<Record<string, Data<ComponentProps, RootProps>> | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("starkora_active_site");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);

        // Multi-page format
        if (parsed.pages && typeof parsed.pages === "object") {
          setSiteMap(parsed.pages);
        } else if (parsed.content) {
          // Legacy single-page format
          setSiteMap({ home: parsed });
        }
      } catch (err) {
        console.error("Failed to parse local site preview", err);
      }
    }
  }, []);

  if (!siteMap) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center font-sans text-slate-400 space-y-4">
        <p className="text-lg">No active website draft found to preview.</p>
        <Link
          href="/editor"
          className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-500 transition text-sm"
        >
          Open Canvas Editor
        </Link>
      </div>
    );
  }

  const currentData = siteMap[activePage] || siteMap["home"];

  if (!currentData || !currentData.content) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center font-sans text-slate-400 space-y-4">
        <p className="text-lg">This page has no content yet.</p>
        <button
          onClick={() => setActivePage("home")}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold"
        >
          Return to Home Preview
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Floating Preview Controller Bar */}
      <div className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur border-b border-slate-800 px-6 py-2.5 flex items-center justify-between text-xs font-sans">
        <div className="flex items-center gap-3">
          <span className="font-extrabold text-indigo-400 tracking-wider">PREVIEW MODE</span>
          <span className="text-slate-600">|</span>
          <div className="flex items-center gap-1.5">
            {(["home", "about", "services", "contact"] as PageSlug[]).map((slug) => (
              <button
                key={slug}
                onClick={() => setActivePage(slug)}
                className={`px-3 py-1 rounded-md font-semibold capitalize transition ${
                  activePage === slug
                    ? "bg-indigo-600 text-white shadow"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                {slug}
              </button>
            ))}
          </div>
        </div>

        <Link
          href="/editor"
          className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded font-semibold border border-slate-700 transition"
        >
          ← Back to Editor
        </Link>
      </div>

      <div className="flex-1">
        <Render config={config} data={currentData} />
      </div>
    </div>
  );
}

export default function PreviewPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 font-sans">
          Loading preview...
        </div>
      }
    >
      <PreviewContent />
    </Suspense>
  );
}