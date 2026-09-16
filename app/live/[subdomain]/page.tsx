import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import TenantRenderer from "./TenantRenderer";
import type { Data } from "@puckeditor/core";
import type { ComponentProps, RootProps } from "@/puck.config";
import type { Metadata } from "next";

type PageSlug = "home" | "about" | "services" | "contact";

function resolveLayoutData(rawLayoutData: string): Data<ComponentProps, RootProps> | null {
  try {
    const parsed = JSON.parse(rawLayoutData);

    // 1. Multi-page layout: Extract 'home' page
    if (parsed.pages && typeof parsed.pages === "object") {
      return parsed.pages["home"] || null;
    }

    // 2. Legacy single-page format fallback
    if (parsed.content && Array.isArray(parsed.content)) {
      return parsed as Data<ComponentProps, RootProps>;
    }

    return null;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ subdomain: string }>;
}): Promise<Metadata> {
  const { subdomain } = await params;
  const site = await db.findSiteByIdentifier(subdomain);

  if (!site) return { title: "Site Not Found | STARKORA" };

  const layoutData = resolveLayoutData(site.layoutData);
  const heroBlock = layoutData?.content?.find((b) => b.type === "HeroBlock");
  const siteTitle = layoutData?.root?.props?.title || site.name || "STARKORA Generated Site";
  const siteDescription = heroBlock?.props?.subheading || "Official website powered by STARKORA.";
  const heroImage = heroBlock?.props?.imageUrl;

  return {
    title: siteTitle,
    description: siteDescription,
    icons: site.faviconUrl ? [{ rel: "icon", url: site.faviconUrl }] : undefined,
    openGraph: {
      title: siteTitle,
      description: siteDescription,
      type: "website",
      images: heroImage ? [{ url: heroImage }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: siteTitle,
      description: siteDescription,
      images: heroImage ? [heroImage] : [],
    },
  };
}

export default async function LiveTenantHomePage({
  params,
}: {
  params: Promise<{ subdomain: string }>;
}) {
  const { subdomain } = await params;
  const site = await db.findSiteByIdentifier(subdomain);

  if (!site || !site.isPublished) {
    notFound();
  }

  const layoutData = resolveLayoutData(site.layoutData);
  if (!layoutData || !layoutData.content) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 font-sans p-6 text-center">
        <h2 className="text-xl font-bold text-white mb-2">No Published Content Found</h2>
        <p className="text-sm text-slate-500">
          Open the editor, click &quot;Publish&quot;, and reload this page.
        </p>
      </div>
    );
  }

  return <TenantRenderer data={layoutData} />;
}