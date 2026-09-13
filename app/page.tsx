"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    businessName: "",
    businessType: "Restaurant & Bar",
    location: "Lagos, Nigeria",
    description: "",
  });

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.siteData) {
        // Save generated structure directly for the editor to load
        localStorage.setItem("starkora_active_site", JSON.stringify(data.siteData));
        router.push("/editor");
      } else {
        alert("Failed to generate site data.");
      }
    } catch (err) {
      alert("An error occurred during generation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-xl w-full bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <span className="px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded-full text-xs font-semibold uppercase tracking-wider">
            STARKORA AI Engine
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight">Generate Your Website</h1>
          <p className="text-sm text-slate-400">
            Tell us about your business. We will synthesize the structure, copy, and layout in seconds.
          </p>
        </div>

        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <label className="block text-xs font-medium uppercase text-slate-400 mb-1">
              Business Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Suya & Grills Express"
              value={formData.businessName}
              onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium uppercase text-slate-400 mb-1">
                Industry / Type
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Tech Agency, Boutique, Salon"
                value={formData.businessType}
                onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-medium uppercase text-slate-400 mb-1">
                Location
              </label>
              <input
                type="text"
                placeholder="e.g. Abuja, Nigeria"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium uppercase text-slate-400 mb-1">
              Short Description (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="Describe your services, unique offerings, or brand personality..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 font-semibold rounded-lg shadow-lg disabled:opacity-50 transition"
          >
            {loading ? "Synthesizing Website with AI..." : "Generate Website →"}
          </button>
        </form>
      </div>
    </main>
  );
}