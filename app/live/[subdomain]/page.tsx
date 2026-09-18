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

      {/* Meta Pixel Dynamic Injection - Pro Tier Only */}
      {site.subscriptionStatus === "active" && site.metaPixelId && (
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

      {/* Google Analytics 4 Dynamic Injection - Pro Tier Only */}
      {site.subscriptionStatus === "active" && site.googleAnalyticsId && (
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

      {/* Free Tier Watermark Badge - Automatically removed when site is upgraded to Pro */}
      {site.subscriptionStatus !== "active" && (
        <aside aria-label="Platform attribution" className="fixed bottom-4 right-4 z-50">
          <a
            href="https://starkora-app.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-900/90 hover:bg-slate-900 text-white text-[11px] font-semibold tracking-wide border border-slate-700/80 shadow-2xl backdrop-blur-md transition hover:scale-105"
          >
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <span>Built with <strong>STARKORA</strong></span>
          </a>
        </aside>
      )}

      <TenantRenderer data={layoutData} />
    </>
  );
}