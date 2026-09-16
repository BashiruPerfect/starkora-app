import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import TenantRenderer from "./TenantRenderer";
import type { Data } from "@puckeditor/core";
import type { ComponentProps, RootProps } from "@/puck.config";
import type { Metadata } from "next";

type PageSlug = "home" | "about" | "services" | "contact";

function resolveLayoutData(rawLayoutData: string, slug: string = "home"): Data<ComponentProps, RootProps> | null {
  try {
    const parsed = JSON.parse(rawLayoutData);

    // 1. Multi-page structure: Extract specific slug or fallback to home
    if (parsed.pages && typeof parsed.pages === "object") {
      const targetSlug = slug.toLowerCase() as PageSlug;
      return parsed.pages[targetSlug] || parsed.pages["home"] || null;
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
  searchParams,
}: {
  params: Promise<{ subdomain: string }>;
  searchParams: Promise<{ page?: string }>;
}): Promise<Metadata> {
  const { subdomain } = await params;
  const { page } = await searchParams;
  const site = await db.findSiteByIdentifier(subdomain);

  if (!site) return { title: "Site Not Found | STARKORA" };

  const layoutData = resolveLayoutData(site.layoutData, page || "home");
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

export default async function LiveTenantPage({
  params,
  searchParams,
}: {
  params: Promise<{ subdomain: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { subdomain } = await params;
  const { page } = await searchParams;
  const site = await db.findSiteByIdentifier(subdomain);

  if (!site || !site.isPublished) {
    notFound();
  }

  const layoutData = resolveLayoutData(site.layoutData, page || "home");
  if (!layoutData || !layoutData.content) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 font-sans p-6 text-center">
        <h2 className="text-xl font-bold text-white mb-2">No Published Content Found</h2>
        <p className="text-sm text-slate-500">
          Open the editor and click &quot;Publish&quot; to push your pages to the live edge.
        </p>
      </div>
    );
  }

  const contactBlock = layoutData.content.find((b) => b.type === "ContactWhatsAppBlock");
  const heroBlock = layoutData.content.find((b) => b.type === "HeroBlock");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: site.name,
    description: heroBlock?.props?.subheading || "Premier services.",
    telephone: contactBlock?.props?.phoneNumber || "",
    email: contactBlock?.props?.email || "",
    address: {
      "@type": "PostalAddress",
      streetAddress: contactBlock?.props?.location || "Nigeria",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {site.metaPixelId && (
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${site.metaPixelId}');
              fbq('track', 'PageView');
            `,
          }}
        />
      )}

      {site.googleAnalyticsId && (
        <>
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${site.googleAnalyticsId}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${site.googleAnalyticsId}');
              `,
            }}
          />
        </>
      )}

      <TenantRenderer data={layoutData} />
    </>
  );
}