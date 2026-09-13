"use client";

import { useEffect, useState } from "react";
import { Render, type Data } from "@puckeditor/core";
import { config, type ComponentProps } from "../../puck.config";

export default function PreviewPage() {
  const [data, setData] = useState<Data<ComponentProps> | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("starkora_active_site");
    if (raw) {
      try {
        setData(JSON.parse(raw));
      } catch (err) {
        console.error("Failed to parse site data", err);
      }
    }
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center font-sans text-slate-600 space-y-4">
        <p className="text-lg font-medium">No published site data found yet.</p>
        <a
          href="/editor"
          className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-500 transition"
        >
          Open Editor
        </a>
      </div>
    );
  }

  return <Render config={config} data={data} />;
}