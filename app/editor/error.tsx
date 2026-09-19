"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function EditorError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Editor Runtime Error Caught:", error);
  }, [error]);

  const handleResetDraft = () => {
    try {
      localStorage.removeItem("starkora_active_site");
    } catch {
      // ignore
    }
    reset();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center font-sans space-y-5">
      <span className="px-3 py-1 bg-rose-500/20 text-rose-400 rounded-full text-xs font-semibold uppercase tracking-wider">
        Editor Recovery
      </span>
      <h1 className="text-2xl font-bold tracking-tight">The canvas encountered a layout error</h1>
      <p className="text-sm text-slate-400 max-w-md">
        This occurs when a site draft contains missing component identifiers or an invalid structure. You can clear the draft and reload safely below.
      </p>

      {error?.message && (
        <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-rose-300 max-w-lg truncate">
          {error.message}
        </div>
      )}

      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={handleResetDraft}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition"
        >
          Clear Corrupted Draft & Reset ⟳
        </button>
        <Link
          href="/"
          onClick={() => {
            try {
              localStorage.removeItem("starkora_active_site");
            } catch {}
          }}
          className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold border border-slate-700 transition"
        >
          Generate Fresh Site →
        </Link>
      </div>
    </div>
  );
}