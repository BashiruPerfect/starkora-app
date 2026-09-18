import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import TenantRenderer from "../TenantRenderer";
import type { Data } from "@puckeditor/core";
import type { ComponentProps, RootProps } from "@/puck.config";
import type { Metadata } from "next";
import Link from "next/link";

type PageSlug = "home" | "about" | "services" | "contact";

function resolveSubPageLayout(rawLayoutData: string, slug: string): Data<ComponentProps, RootProps> | null {
  try {
    const parsed = JSON.parse(rawLayoutData);
    const target = slug.toLowerCase() as PageSlug;

    if (parsed.pages && typeof parsed.pages === "object") {
      return parsed.pages[target] || null;
    }

    return null;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ subdomain: string; slug: string }>;
}): Promise<Metadata> {
  const { subdomain, slug } = await params;
  const site = await db.findSiteByIdentifier(subdomain);

  if (!site) return { title: "Site Not Found | STARKORA" };

  const layoutData = resolveSubPageLayout(site.layoutData, slug);
  const siteTitle = layoutData?.root?.props?.title || `${slug.toUpperCase()} | ${site.name}`;

  return {
    title: siteTitle,
    icons: site.faviconUrl ? [{ rel: "icon", url: site.faviconUrl }] : undefined,
  };
}

export default async function LiveTenantSubPage({
  params,
}: {
  params: Promise<{ subdomain: string; slug: string }>;
}) {
  const { subdomain, slug } = await params;
  const site = await db.findSiteByIdentifier(subdomain);

  if (!site || !site.isPublished) {
    notFound();
  }

  // TIER ENFORCEMENT: Sub-pages are exclusive to the Pro Tier
  if (site.subscriptionStatus !== "active") {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center font-sans space-y-4">
        <span className="px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded-full text-xs font-semibold uppercase tracking-wider">
          Pro Feature
        </span>
        <h1 className="text-2xl font-bold tracking-tight">Multi-Page Navigation is Locked</h1>
        <p className="text-sm text-slate-400 max-w-md">
          The owner of <strong>{site.name}</strong> is currently on the Free Tier. Dedicated multi-page routing (/about, /services, /contact) unlocks automatically on the Pro Tier.
        </p>
        <Link
          href={`/live/${subdomain}`}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition"
        >
          ← Return to Main Page
        </Link>
      </div>
    );
  }

  const layoutData = resolveSubPageLayout(site.layoutData, slug);
  if (!layoutData || !layoutData.content) {
    notFound();
  }

  return <TenantRenderer data={layoutData} />;
}