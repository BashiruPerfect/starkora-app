import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import TenantRenderer from "../TenantRenderer";
import type { Data } from "@puckeditor/core";
import type { ComponentProps, RootProps } from "@/puck.config";
import type { Metadata } from "next";

type PageSlug = "home" | "about" | "services" | "contact";

function resolveLayoutData(rawLayoutData: string, slug: string): Data<ComponentProps, RootProps> | null {
  try {
    const parsed = JSON.parse(rawLayoutData);
    if (parsed.pages && typeof parsed.pages === "object") {
      const target = slug.toLowerCase() as PageSlug;
      return parsed.pages[target] || parsed.pages["home"] || null;
    }
    if (parsed.content) return parsed as Data<ComponentProps, RootProps>;
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

  const layoutData = resolveLayoutData(site.layoutData, slug);
  const siteTitle = layoutData?.root?.props?.title || `${slug.toUpperCase()} | ${site.name}`;
  return { title: siteTitle };
}

export default async function LiveTenantSubPage({
  params,
}: {
  params: Promise<{ subdomain: string; slug: string }>;
}) {
  const { subdomain, slug } = await params;
  const site = await db.findSiteByIdentifier(subdomain);

  if (!site || !site.isPublished) notFound();

  const layoutData = resolveLayoutData(site.layoutData, slug);
  if (!layoutData || !layoutData.content) notFound();

  return <TenantRenderer data={layoutData} />;
}