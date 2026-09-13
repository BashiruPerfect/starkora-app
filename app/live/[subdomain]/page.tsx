import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import TenantRenderer from "./TenantRenderer";
import type { Data } from "@puckeditor/core";
import type { ComponentProps } from "@/puck.config";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ subdomain: string }>;
}): Promise<Metadata> {
  const { subdomain } = await params;
  const site = await db.findSiteByIdentifier(subdomain);

  if (!site) {
    return {
      title: "Site Not Found | STARKORA",
    };
  }

  let layoutData: Data<ComponentProps> | null = null;
  try {
    layoutData = JSON.parse(site.layoutData);
  } catch {
    layoutData = null;
  }

  const heroBlock = layoutData?.content?.find((b) => b.type === "HeroBlock");
  const siteTitle = layoutData?.root?.props?.title || site.name || "STARKORA Generated Site";
  const siteDescription =
    heroBlock?.props?.subheading ||
    "Official website powered by STARKORA autonomous web platform.";
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
}: {
  params: Promise<{ subdomain: string }>;
}) {
  const { subdomain } = await params;
  const site = await db.findSiteByIdentifier(subdomain);

  if (!site || !site.isPublished) {
    notFound();
  }

  let layoutData: Data<ComponentProps> | null = null;
  try {
    layoutData = JSON.parse(site.layoutData);
  } catch (e) {
    console.error("Failed to parse site data for tenant", e);
    notFound();
  }

  if (!layoutData) {
    notFound();
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
      {/* Schema.org Microdata */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Meta Pixel Dynamic Injection */}
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

      {/* Google Analytics (GA4) Dynamic Injection */}
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