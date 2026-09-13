"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Site {
  id: string;
  name: string;
  subdomain: string;
  customDomain?: string;
  domainVerified?: boolean;
  metaPixelId?: string;
  googleAnalyticsId?: string;
  faviconUrl?: string;
  isPublished: boolean;
  subscriptionPlan?: "free" | "monthly" | "annual";
  subscriptionStatus?: "active" | "inactive";
  updatedAt: string;
}

interface Lead {
  id: string;
  siteId: string;
  name: string;
  phone: string;
  email?: string;
  message: string;
  createdAt: string;
}

interface DomainSearchResult {
  domain: string;
  extension: string;
  available: boolean;
  priceUSD: number;
  priceNGN: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [sites, setSites] = useState<Site[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  // Active View Tab: 'sites' or 'leads'
  const [activeTab, setActiveTab] = useState<"sites" | "leads">("sites");

  // Custom Domain Modal State
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [domainInput, setDomainInput] = useState("");
  const [savingDomain, setSavingDomain] = useState(false);
  const [domainSuccess, setDomainSuccess] = useState(false);

  // Domain Availability Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchingDomain, setSearchingDomain] = useState(false);
  const [searchResults, setSearchResults] = useState<DomainSearchResult[]>([]);

  // Site Settings Modal State
  const [settingsSite, setSettingsSite] = useState<Site | null>(null);
  const [settingsForm, setSettingsForm] = useState({
    name: "",
    metaPixelId: "",
    googleAnalyticsId: "",
    faviconUrl: "",
  });
  const [savingSettings, setSavingSettings] = useState(false);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const authRes = await fetch("/api/auth/me");
        if (!authRes.ok) {
          router.push("/login");
          return;
        }
        const authData = await authRes.json();
        setUser(authData.user);

        const sitesRes = await fetch("/api/sites");
        if (sitesRes.ok) {
          const sitesData = await sitesRes.json();
          setSites(sitesData.sites || []);
        }

        const leadsRes = await fetch("/api/leads");
        if (leadsRes.ok) {
          const leadsData = await leadsRes.json();
          setLeads(leadsData.leads || []);
        }
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [router]);

  const handleDomainSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearchingDomain(true);

    try {
      const res = await fetch("/api/domains/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery }),
      });

      const data = await res.json();
      if (res.ok && data.results) {
        setSearchResults(data.results);
      } else {
        alert(data.error || "Domain search failed");
      }
    } catch {
      alert("Failed to check domain availability.");
    } finally {
      setSearchingDomain(false);
    }
  };

  const handleSaveDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSite) return;

    setSavingDomain(true);
    setDomainSuccess(false);

    try {
      const res = await fetch("/api/sites/domain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteId: selectedSite.id,
          customDomain: domainInput,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to set domain");

      setSites((prev) =>
        prev.map((s) =>
          s.id === selectedSite.id
            ? { ...s, customDomain: data.site.customDomain, domainVerified: true }
            : s
        )
      );
      setDomainSuccess(true);
    } catch (err: any) {
      alert(err.message || "Failed to link domain");
    } finally {
      setSavingDomain(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settingsSite) return;

    setSavingSettings(true);
    try {
      const res = await fetch("/api/sites/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteId: settingsSite.id,
          ...settingsForm,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update settings");

      setSites((prev) =>
        prev.map((s) => (s.id === settingsSite.id ? { ...s, ...data.site } : s))
      );
      alert("Site settings and marketing pixels saved successfully!");
      setSettingsSite(null);
    } catch (err: any) {
      alert(err.message || "Failed to save settings");
    } finally {
      setSavingSettings(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 font-sans">
        Loading your STARKORA dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      {/* Top Navbar */}
      <nav className="border-b border-slate-800 bg-slate-900/60 backdrop-blur px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl font-black text-indigo-400 tracking-wider">STARKORA</span>
          <span className="text-xs bg-indigo-500/20 text-indigo-300 font-semibold px-2 py-0.5 rounded">
            Dashboard
          </span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-slate-400 hidden sm:inline">
            Logged in as <strong className="text-white">{user?.email}</strong>
          </span>
          <Link
            href="/"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 font-semibold text-xs rounded-lg transition"
          >
            + Generate New Site
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-10 space-y-8">
        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab("sites")}
              className={`text-sm font-bold pb-2 border-b-2 transition ${
                activeTab === "sites"
                  ? "border-indigo-500 text-white"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              Websites ({sites.length})
            </button>
            <button
              onClick={() => setActiveTab("leads")}
              className={`text-sm font-bold pb-2 border-b-2 transition flex items-center gap-2 ${
                activeTab === "leads"
                  ? "border-indigo-500 text-white"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <span>Customer Inquiries</span>
              <span className="px-2 py-0.5 bg-indigo-600 text-[11px] font-bold rounded-full">
                {leads.length}
              </span>
            </button>
          </div>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-semibold transition"
          >
            <span>+ AI Generate New Site</span>
          </Link>
        </div>

        {/* TAB 1: WEBSITES VIEW */}
        {activeTab === "sites" && (
          <div>
            {sites.length === 0 ? (
              <div className="border border-dashed border-slate-800 rounded-2xl p-12 text-center space-y-4">
                <h3 className="text-lg font-semibold text-slate-300">No websites in your account yet</h3>
                <p className="text-slate-500 text-sm max-w-sm mx-auto">
                  Use the autonomous generator to synthesize your first layout in seconds.
                </p>
                <Link
                  href="/"
                  className="inline-block px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 font-semibold text-sm rounded-lg transition"
                >
                  Generate Your First Site →
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sites.map((site) => (
                  <div
                    key={site.id}
                    className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-between space-y-6 hover:border-slate-700 transition"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded font-medium">
                          {site.isPublished ? "Live" : "Draft"}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSettingsSite(site);
                              setSettingsForm({
                                name: site.name || "",
                                metaPixelId: site.metaPixelId || "",
                                googleAnalyticsId: site.googleAnalyticsId || "",
                                faviconUrl: site.faviconUrl || "",
                              });
                            }}
                            className="text-xs text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition"
                            title="Site Settings & Marketing"
                          >
                            Settings ⚙️
                          </button>
                          <span className="text-xs text-slate-500">
                            {new Date(site.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <h2 className="text-xl font-bold tracking-tight line-clamp-1">{site.name}</h2>

                      <div className="space-y-1">
                        <p className="text-xs font-mono text-slate-400">
                          <Link
                            href={`/live/${site.customDomain || site.subdomain}`}
                            target="_blank"
                            className="hover:text-indigo-300 underline"
                          >
                            {site.customDomain ? `🌐 ${site.customDomain}` : `${site.subdomain}.starkora.com`} ↗
                          </Link>
                        </p>
                        {site.customDomain && (
                          <p className="text-[11px] font-mono text-slate-500">
                            Fallback: {site.subdomain}.starkora.com
                          </p>
                        )}
                        {(site.metaPixelId || site.googleAnalyticsId) && (
                          <div className="flex items-center gap-2 pt-1">
                            {site.metaPixelId && (
                              <span className="text-[10px] bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded font-mono">
                                Pixel Active
                              </span>
                            )}
                            {site.googleAnalyticsId && (
                              <span className="text-[10px] bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded font-mono">
                                GA4 Active
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <Link
                          href={`/editor?siteId=${site.id}`}
                          className="py-2 px-3 bg-indigo-600 hover:bg-indigo-500 text-center font-semibold text-xs rounded-lg transition"
                        >
                          Edit Canvas ✏️
                        </Link>
                        <Link
                          href={`/live/${site.customDomain || site.subdomain}`}
                          target="_blank"
                          className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-center font-semibold text-xs text-slate-300 rounded-lg border border-slate-700 transition"
                        >
                          View Live ↗
                        </Link>
                      </div>

                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                        <span className="text-slate-400">
                          {site.subscriptionStatus === "active" ? (
                            <span className="text-emerald-400 font-semibold uppercase tracking-wider text-[10px]">
                              ● Pro ({site.subscriptionPlan || "Active"})
                            </span>
                          ) : (
                            "Free Tier (Subdomain)"
                          )}
                        </span>
                        {site.subscriptionStatus === "active" ? (
                          <button
                            onClick={() => {
                              setSelectedSite(site);
                              setDomainInput(site.customDomain || "");
                              setSearchResults([]);
                              setSearchQuery("");
                              setDomainSuccess(false);
                            }}
                            className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                          >
                            Manage Domain 🌐
                          </button>
                        ) : (
                          <Link
                            href={`/billing?siteId=${site.id}`}
                            className="text-indigo-400 hover:text-indigo-300 font-semibold"
                          >
                            Connect Domain ($10/mo) →
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: INBOX / LEADS VIEW */}
        {activeTab === "leads" && (
          <div className="space-y-4">
            {leads.length === 0 ? (
              <div className="border border-dashed border-slate-800 rounded-2xl p-12 text-center space-y-3">
                <div className="text-3xl">📥</div>
                <h3 className="text-base font-semibold text-slate-300">No customer inquiries yet</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  When prospects submit the contact form on your published websites, their inquiries appear here.
                </p>
              </div>
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                  <h3 className="text-sm font-bold">Recent Inquiries ({leads.length})</h3>
                  <span className="text-xs text-slate-400">Real-time Lead Capture</span>
                </div>
                <div className="divide-y divide-slate-800">
                  {leads.map((lead) => {
                    const cleanPhone = lead.phone.replace(/[^0-9]/g, "");
                    const defaultReply = encodeURIComponent(
                      `Hello ${lead.name}, thank you for reaching out through our website regarding: "${lead.message}". How can we help you today?`
                    );
                    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${defaultReply}`;

                    return (
                      <div key={lead.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-white text-sm">{lead.name}</h4>
                            <span className="text-xs text-slate-500 font-mono">{lead.phone}</span>
                            <span className="text-[10px] text-slate-500">
                              {new Date(lead.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
                            {lead.message}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg flex items-center gap-1.5 transition whitespace-nowrap"
                          >
                            <span>💬 Reply on WhatsApp</span>
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Site Settings & Marketing Pixels Modal */}
      {settingsSite && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Site Settings & Marketing</h3>
                <p className="text-xs text-slate-400">Configure tracking pixels, favicon, and brand metadata</p>
              </div>
              <button
                onClick={() => setSettingsSite(null)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-semibold text-slate-400 mb-1">
                  Website Display Name
                </label>
                <input
                  type="text"
                  required
                  value={settingsForm.name}
                  onChange={(e) => setSettingsForm({ ...settingsForm, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-semibold text-blue-400 mb-1 flex items-center justify-between">
                  <span>Meta / Facebook Pixel ID</span>
                  <span className="text-[10px] text-slate-500 lowercase">e.g. 123456789012345</span>
                </label>
                <input
                  type="text"
                  placeholder="Paste your 15-16 digit Meta Pixel ID"
                  value={settingsForm.metaPixelId}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, metaPixelId: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white font-mono focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-semibold text-amber-400 mb-1 flex items-center justify-between">
                  <span>Google Analytics 4 (GA4) ID</span>
                  <span className="text-[10px] text-slate-500 lowercase">e.g. G-XXXXXXXXXX</span>
                </label>
                <input
                  type="text"
                  placeholder="G-XXXXXXXXXX"
                  value={settingsForm.googleAnalyticsId}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, googleAnalyticsId: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-semibold text-slate-400 mb-1">
                  Custom Favicon URL (Optional)
                </label>
                <input
                  type="text"
                  placeholder="/uploads/favicon.png or https://..."
                  value={settingsForm.faviconUrl}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, faviconUrl: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                disabled={savingSettings}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 font-semibold rounded-lg text-sm text-white transition disabled:opacity-50 shadow-lg"
              >
                {savingSettings ? "Saving Settings..." : "Save Site Settings ➔"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Custom Domain Manager & Availability Search Modal */}
      {selectedSite && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold">Custom Domain Manager</h3>
                <p className="text-xs text-slate-400">Search for a new domain or connect an existing one</p>
              </div>
              <button
                onClick={() => {
                  setSelectedSite(null);
                  setSearchResults([]);
                }}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-3">
              <label className="block text-xs uppercase font-semibold text-indigo-400">
                Search Domain Availability (.com, .ng, .com.ng)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. starkorafashion"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={handleDomainSearch}
                  disabled={searchingDomain}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-sm font-semibold rounded-lg transition disabled:opacity-50"
                >
                  {searchingDomain ? "Checking..." : "Search"}
                </button>
              </div>

              {searchResults.length > 0 && (
                <div className="space-y-2 pt-2">
                  {searchResults.map((result) => (
                    <div
                      key={result.domain}
                      className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs"
                    >
                      <div>
                        <span className="font-bold text-white text-sm">{result.domain}</span>
                        <div className="text-slate-400">
                          ₦{result.priceNGN.toLocaleString()} / year (${result.priceUSD})
                        </div>
                      </div>
                      <div>
                        {result.available ? (
                          <button
                            type="button"
                            onClick={() => setDomainInput(result.domain)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-medium transition"
                          >
                            Select Domain
                          </button>
                        ) : (
                          <span className="text-rose-400 font-semibold px-2 py-1 bg-rose-500/10 rounded">
                            Unavailable
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-slate-800 pt-4">
              <form onSubmit={handleSaveDomain} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase font-semibold text-slate-400 mb-1">
                    Connect Selected or Existing Domain
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. mybrand.ng"
                    value={domainInput}
                    onChange={(e) => setDomainInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={savingDomain}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 font-semibold rounded-lg transition disabled:opacity-50 text-sm"
                >
                  {savingDomain ? "Linking Domain..." : "Link Domain to Website"}
                </button>
              </form>
            </div>

            {domainSuccess && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl space-y-3">
                <p className="text-xs font-semibold text-emerald-400">
                  ✓ Domain successfully registered in STARKORA edge routing table!
                </p>
                <div className="text-xs text-slate-300 space-y-1">
                  <p className="font-semibold text-white">DNS Configuration Instructions:</p>
                  <p>Add this record at your domain registrar (e.g. Go54, Namecheap):</p>
                  <div className="bg-slate-950 p-2.5 rounded font-mono text-[11px] text-slate-400 space-y-0.5">
                    <div>Type: <strong>CNAME</strong></div>
                    <div>Host: <strong>@</strong> or <strong>www</strong></div>
                    <div>Value: <strong>fallback.starkora.com</strong></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}