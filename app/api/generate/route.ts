import { NextResponse } from "next/server";
import OpenAI from "openai";

export const maxDuration = 60;

const rawKey = (process.env.OPENAI_API_KEY || "").replace(/["']/g, "").trim();
const openai = rawKey ? new OpenAI({ apiKey: rawKey }) : null;

async function generateCustomHeroImage(businessName: string, businessType: string, description: string) {
  if (!openai) {
    return "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80";
  }

  try {
    const prompt = `High-end commercial website hero photography for ${businessName}, a ${businessType}. Context: ${description || "modern premium business"}. Photorealistic, 8k resolution, cinematic natural lighting, clean architectural aesthetic, no text, no watermarks.`;

    const imgResponse = await openai.images.generate({
      model: "gpt-image-1-mini",
      prompt,
      n: 1,
      size: "1024x1024",
      quality: "medium",
    });

    const item = imgResponse.data?.[0];
    if (item?.b64_json) {
      return `data:image/png;base64,${item.b64_json}`;
    }
    return item?.url || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80";
  } catch (err) {
    console.warn("AI Image generation in background failed, using verified fallback photo:", err);
    return "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80";
  }
}

export async function POST(req: Request) {
  try {
    const { businessName, businessType, description, location, phone } = await req.json();

    if (!businessName || !businessType) {
      return NextResponse.json({ error: "Business name and type are required." }, { status: 400 });
    }

    const cleanName = businessName.replace(/^welcome\s+to\s+/i, "").replace(/^the\s+/i, "").trim();
    const cleanType = businessType.replace(/^welcome\s+to\s+/i, "").trim();
    const cleanLoc = location || "Lagos, Nigeria";
    const cleanPhone = phone?.trim() || "+2348012345678";
    const brandSlug = cleanName.toLowerCase().replace(/[^a-z0-9]/g, "");

    // 1. Synthesize Custom Hero Photo and Copywriting in Parallel
    const [heroPhotoUrl, aiCompletion] = await Promise.all([
      generateCustomHeroImage(cleanName, cleanType, description),
      openai
        ? openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
              {
                role: "system",
                content:
                  "You are an elite conversion copywriter for STARKORA. You output strictly valid JSON conforming exactly to the layout schema. Write compelling, high-converting Nigerian/regional commercial copy. Never repeat raw prompt phrases verbatim.",
              },
              {
                role: "user",
                content: `
Create a complete 4-page website layout for:
Business Name: "${cleanName}"
Industry: "${cleanType}"
Location: "${cleanLoc}"
Phone: "${cleanPhone}"
Description: "${description || "High-growth premium enterprise"}"

Allowed Block Types:
- NavbarBlock (props: id, brandName, ctaLabel, ctaLink)
- HeroBlock (props: id, layout ["text-left"|"image-left"|"centered"], badgeText, heading, subheading, ctaText, ctaLink, imageUrl, theme ["light"|"dark"|"gradient"])
- FeatureGridBlock (props: id, sectionBadge, sectionTitle, features [{ title, description }])
- GalleryGridBlock (props: id, sectionTitle, sectionSubtitle, layout ["3-column"|"card-grid"], items [{ title, description, imageUrl }])
- PricingBlock (props: id, sectionTitle, sectionSubtitle, plans [{ name, price, features, isPopular, ctaText }])
- TestimonialBlock (props: id, quote, author, role, company)
- ContactWhatsAppBlock (props: id, title, subtitle, phoneNumber, whatsappMessage, email, location)
- NewsletterBlock (props: id, title, subtitle, buttonText)
- FooterBlock (props: id, copyrightText)

Root props:
- title: string
- palette: "sapphire" | "indigo" | "emerald" | "gold" | "crimson" | "minimal"
- font: "inter" | "jakarta" | "playfair" | "cinzel" | "space" | "mono"

Required Output Structure:
{
  "pages": {
    "home": { "content": [...], "root": { "props": { "title": "${cleanName} | Home", "palette": "sapphire", "font": "jakarta" } } },
    "about": { "content": [...], "root": { "props": { "title": "About Us | ${cleanName}", "palette": "sapphire", "font": "jakarta" } } },
    "services": { "content": [...], "root": { "props": { "title": "Services | ${cleanName}", "palette": "sapphire", "font": "jakarta" } } },
    "contact": { "content": [...], "root": { "props": { "title": "Contact Us | ${cleanName}", "palette": "sapphire", "font": "jakarta" } } }
  }
}
`,
              },
            ],
            response_format: { type: "json_object" },
            temperature: 0.7,
          })
        : Promise.resolve(null),
    ]);

    let finalPages: any = null;

    if (aiCompletion) {
      try {
        const rawJson = JSON.parse(aiCompletion.choices[0].message.content || "{}");
        const resolved = rawJson?.pages || rawJson?.website?.pages || rawJson?.site?.pages;
        if (resolved?.home?.content && Array.isArray(resolved.home.content)) {
          finalPages = resolved;
        }
      } catch (parseErr) {
        console.warn("AI JSON parse error, falling back:", parseErr);
      }
    }

    // 2. Fallback structure if AI format fails
    if (!finalPages) {
      finalPages = {
        home: {
          content: [
            { type: "NavbarBlock", props: { id: "nav-home", brandName: cleanName, ctaLabel: "Contact Us", ctaLink: "/contact" } },
            {
              type: "HeroBlock",
              props: {
                id: "hero-home",
                layout: "text-left",
                badgeText: "PREMIER SERVICE",
                heading: `${cleanName}`,
                subheading: description || `Industry-leading ${cleanType} solutions across ${cleanLoc} with verified quality and rapid turnaround.`,
                ctaText: "Explore Services",
                ctaLink: "/services",
                imageUrl: heroPhotoUrl,
                theme: "gradient",
              },
            },
            {
              type: "FeatureGridBlock",
              props: {
                id: "feat-home",
                sectionBadge: "WHY CHOOSE US",
                sectionTitle: `Why Clients Choose ${cleanName}`,
                features: [
                  { title: "Verified Craftsmanship", description: `Uncompromising quality standards across every ${cleanType} deliverable.` },
                  { title: "Punctual Delivery", description: `Fast execution aligned with your timeline in ${cleanLoc}.` },
                  { title: "Transparent Pricing", description: "Clear pricing models and direct support with zero hidden fees." },
                ],
              },
            },
            {
              type: "GalleryGridBlock",
              props: {
                id: "gallery-home",
                sectionTitle: "Featured Showcase",
                sectionSubtitle: `Explore recent projects and deliverables from ${cleanName}.`,
                layout: "3-column",
                items: [
                  { title: "Executive Standard", description: "Bespoke execution with premium materials.", imageUrl: heroPhotoUrl },
                  { title: "Custom Solutions", description: "Tailored directly to unique customer requirements.", imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80" },
                  { title: "Rapid Turnaround", description: "Delivered promptly without compromising excellence.", imageUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=80" },
                ],
              },
            },
            {
              type: "ContactWhatsAppBlock",
              props: {
                id: "contact-home",
                title: `Connect With ${cleanName}`,
                subtitle: "Leave an inquiry below or contact our team directly.",
                phoneNumber: cleanPhone,
                whatsappMessage: `Hello ${cleanName}!`,
                email: `contact@${brandSlug || "business"}.com`,
                location: cleanLoc,
              },
            },
            { type: "FooterBlock", props: { id: "footer-home", copyrightText: `© ${new Date().getFullYear()} ${cleanName}. Powered by STARKORA.` } },
          ],
          root: { props: { title: `${cleanName} | Home`, palette: "sapphire", font: "jakarta" } },
        },
        about: {
          content: [
            { type: "NavbarBlock", props: { id: "nav-about", brandName: cleanName, ctaLabel: "Contact", ctaLink: "/contact" } },
            {
              type: "HeroBlock",
              props: {
                id: "hero-about",
                layout: "image-left",
                badgeText: "OUR STORY",
                heading: `About ${cleanName}`,
                subheading: `Dedicated to delivering exceptional ${cleanType} solutions with integrity, precision, and customer-first focus.`,
                ctaText: "Our Services",
                ctaLink: "/services",
                imageUrl: heroPhotoUrl,
                theme: "dark",
              },
            },
            { type: "FooterBlock", props: { id: "footer-about", copyrightText: `© ${new Date().getFullYear()} ${cleanName}. Powered by STARKORA.` } },
          ],
          root: { props: { title: `About Us | ${cleanName}`, palette: "sapphire", font: "jakarta" } },
        },
        services: {
          content: [
            { type: "NavbarBlock", props: { id: "nav-services", brandName: cleanName, ctaLabel: "Inquire", ctaLink: "/contact" } },
            {
              type: "PricingBlock",
              props: {
                id: "pricing-services",
                sectionTitle: "Curated Packages",
                sectionSubtitle: "Simple, transparent pricing tailored to your needs.",
                plans: [
                  { name: "Standard Package", price: "₦35,000", features: "Full Service Delivery\nDirect Consultation\nStandard Assurance", isPopular: false, ctaText: "Select Plan" },
                  { name: "Executive Tier", price: "₦95,000", features: "Priority Execution\nDedicated Support Line\nCustom Specifications", isPopular: true, ctaText: "Select Executive" },
                ],
              },
            },
            { type: "FooterBlock", props: { id: "footer-services", copyrightText: `© ${new Date().getFullYear()} ${cleanName}. Powered by STARKORA.` } },
          ],
          root: { props: { title: `Services | ${cleanName}`, palette: "sapphire", font: "jakarta" } },
        },
        contact: {
          content: [
            { type: "NavbarBlock", props: { id: "nav-contact", brandName: cleanName, ctaLabel: "Home", ctaLink: "/" } },
            {
              type: "ContactWhatsAppBlock",
              props: {
                id: "contact-main",
                title: "Direct Communication",
                subtitle: "We respond promptly to all incoming communications.",
                phoneNumber: cleanPhone,
                whatsappMessage: `Hello ${cleanName}!`,
                email: `contact@${brandSlug || "business"}.com`,
                location: cleanLoc,
              },
            },
            { type: "FooterBlock", props: { id: "footer-contact", copyrightText: `© ${new Date().getFullYear()} ${cleanName}. Powered by STARKORA.` } },
          ],
          root: { props: { title: `Contact Us | ${cleanName}`, palette: "sapphire", font: "jakarta" } },
        },
      };
    }

    // 3. Bind the Custom AI Image and Merchant Phone across all generated pages
    for (const slug of ["home", "about", "services", "contact"]) {
      const page = finalPages[slug];
      if (page && Array.isArray(page.content)) {
        for (const block of page.content) {
          if (block.type === "HeroBlock" && block.props && !block.props.imageUrl?.startsWith("data:")) {
            block.props.imageUrl = heroPhotoUrl;
          }
          if (block.type === "ContactWhatsAppBlock" && block.props) {
            block.props.phoneNumber = cleanPhone;
          }
        }
      }
    }

    return NextResponse.json({ siteData: { pages: finalPages } });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Generation failed" }, { status: 500 });
  }
}