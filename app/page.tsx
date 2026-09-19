"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);

  const [formData, setFormData] = useState({
    businessName: "",
    businessType: "Restaurant & Bar",
    location: "Lagos, Nigeria",
    description: "",
  });

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.authenticated) setUser(data.user);
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    window.location.reload();
  };

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
        localStorage.setItem("starkora_active_site", JSON.stringify(data.siteData));
        localStorage.setItem("starkora_active_business_name", formData.businessName);
        localStorage.setItem("starkora_active_business_type", formData.businessType);
        localStorage.setItem("starkora_active_location", formData.location);

        // Force full page reload into editor to bypass soft-navigation caching
        window.location.href = "/editor";
      } else {
        alert("Failed to generate website data. Please try again.");
        setLoading(false);
      }
    } catch {
      alert("An error occurred during generation.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col justify-between">
      {/* Top Global Navigation Bar */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur px-6 sm:px-10 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <span className="text-xl font-black text-indigo-400 tracking-wider">STARKORA</span>
          <span className="text-xs bg-indigo-500/20 text-indigo-300 font-semibold px-2 py-0.5 rounded hidden sm:inline">
            v1.0 AI Engine
          </span>
        </div>

        <div className="flex items-center gap-3 sm:gap-4 text-sm">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400 hidden md:inline">
                {user.email}
              </span>
              <Link
                href="/dashboard"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-lg transition"
              >
                Dashboard ➔
              </Link>
              <button
                onClick={handleLogout}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg transition"
              >
                Log Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-4 py-2 text-slate-300 hover:text-white text-xs font-semibold transition"
              >
                Log In
              </Link>
              <Link
                href="/login"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition shadow"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Main Generator Form */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 my-10">
        <div className="max-w-xl w-full bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <span className="px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded-full text-xs font-semibold uppercase tracking-wider">
              Autonomous Multi-Page Generator
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight">Generate Your Business Platform</h1>
            <p className="text-sm text-slate-400">
              Synthesize Home, About, Services, and Contact pages in seconds with built-in WhatsApp lead capture.
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
                placeholder="e.g. Lekki Heights Luxury Homes"
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
                  placeholder="e.g. Real Estate, Catering, Fashion"
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
                placeholder="Describe your services, unique value, or brand personality..."
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
              {loading ? "Synthesizing 4 Pages with AI..." : "Generate 4-Page Website →"}
            </button>
          </form>
        </div>
      </main>

      <footer className="py-6 px-6 border-t border-slate-900 text-center text-xs text-slate-600">
        <p>© 2026 STARKORA Platform. Built for African merchants and global scale.</p>
      </footer>
    </div>
  );
}