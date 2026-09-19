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
    console.error("Editor Runtime Caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center font-sans space-y-4">
      <span className="px-3 py-1 bg-rose-500/20 text-rose-400 rounded-full text-xs font-semibold uppercase tracking-wider">
        Editor Recovery
      </span>
      <h1 className="text-2xl font-bold tracking-tight">The canvas encountered an issue</h1>
      <p className="text-sm text-slate-400 max-w-md">
        We detected an error while initializing the editor. You can reload the canvas or generate a fresh site layout.
      </p>
      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={() => reset()}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition"
        >
          Try Reloading Canvas ⟳
        </button>
        <Link
          href="/"
          onClick={() => localStorage.removeItem("starkora_active_site")}
          className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold border border-slate-700 transition"
        >
          Generate New Site →
        </Link>
      </div>
    </div>
  );
}