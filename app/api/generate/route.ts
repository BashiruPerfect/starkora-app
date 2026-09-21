import { NextResponse } from "next/server";
import OpenAI from "openai";

export const maxDuration = 60;

const rawKey = (process.env.OPENAI_API_KEY || "").replace(/["']/g, "").trim();
const openai = rawKey ? new OpenAI({ apiKey: rawKey }) : null;

function buildFallbackPageData(
  businessName: string,
  businessType: string,
  location: string,
  description: string,
  phone?: string
) {
  const cleanName = businessName.replace(/^welcome\s+to\s+/i, "").replace(/^the\s+/i, "").trim() || "Business";
  const cleanType = businessType.replace(/^welcome\s+to\s+/i, "").trim() || "Services";
  const cleanLoc = location || "Lagos, Nigeria";
  const cleanPhone = phone?.trim() || "+2348012345678";
  const brandSlug = cleanName.toLowerCase().replace(/[^a-z0-9]/g, "");

  return {
    pages: {
      home: {
        content: [
          {
            type: "NavbarBlock",
            props: { id: "nav-home", brandName: cleanName, ctaLabel: "Contact Us", ctaLink: "/contact" },
          },
          {
            type: "HeroBlock",
            props: {
              id: "hero-home",
              badgeText: "PREMIER SERVICE",
              heading: `${cleanName}`,
              subheading:
                description ||
                `Providing premier ${cleanType} solutions across ${cleanLoc} with verified quality, prompt delivery, and complete customer satisfaction.`,
              ctaText: "Explore Services",
              ctaLink: "/services",
              imageUrl:
                "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80",
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
                {
                  title: "Verified Craftsmanship",
                  description: `Uncompromising quality standards across every ${cleanType} engagement.`,
                },
                {
                  title: "Punctual Delivery",
                  description: `Prompt turnaround tailored to our clients in ${cleanLoc}.`,
                },
                {
                  title: "Direct Communication",
                  description: "Seamless WhatsApp and phone availability with zero hidden charges.",
                },
              ],
            },
          },
          {
            type: "TestimonialBlock",
            props: {
              id: "test-home",
              quote: `Working with ${cleanName} was effortless. Their attention to detail and punctuality exceeded all expectations.`,
              author: "Alhaji Ibrahim Danjuma",
              role: "Managing Director",
              company: "Danjuma Holdings",
            },
          },
          {
            type: "ContactWhatsAppBlock",
            props: {
              id: "contact-home",
              title: `Connect With ${cleanName}`,
              subtitle: "Reach out via WhatsApp or submit an inquiry below for immediate response.",
              phoneNumber: cleanPhone,
              whatsappMessage: `Hello ${cleanName}, I would like to inquire about your ${cleanType}.`,
              email: `contact@${brandSlug || "business"}.com`,
              location: cleanLoc,
            },
          },
          {
            type: "FooterBlock",
            props: {
              id: "footer-home",
              copyrightText: `© ${new Date().getFullYear()} ${cleanName}. Powered by STARKORA.`,
            },
          },
        ],
        root: { props: { title: `${cleanName} | Home`, palette: "indigo", font: "inter" } },
      },
      about: {
        content: [
          {
            type: "NavbarBlock",
            props: { id: "nav-about", brandName: cleanName, ctaLabel: "Contact", ctaLink: "/contact" },
          },
          {
            type: "HeroBlock",
            props: {
              id: "hero-about",
              badgeText: "OUR STORY",
              heading: `About ${cleanName}`,
              subheading: `Dedicated to delivering exceptional ${cleanType} solutions with integrity, precision, and customer-first focus.`,
              ctaText: "Our Services",
              ctaLink: "/services",
              imageUrl:
                "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80",
              theme: "dark",
            },
          },
          {
            type: "FeatureGridBlock",
            props: {
              id: "feat-about",
              sectionBadge: "OUR VALUES",
              sectionTitle: "Principles That Guide Every Engagement",
              features: [
                {
                  title: "Integrity First",
                  description: "Transparent communication, honest pricing, and accountability at every stage.",
                },
                {
                  title: "Client Success",
                  description: "Our success is defined exclusively by the satisfaction and growth of our clientele.",
                },
                {
                  title: "Continuous Innovation",
                  description: "Adopting modern industry workflows to keep you ahead of market demands.",
                },
              ],
            },
          },
          {
            type: "FooterBlock",
            props: {
              id: "footer-about",
              copyrightText: `© ${new Date().getFullYear()} ${cleanName}. Powered by STARKORA.`,
            },
          },
        ],
        root: { props: { title: `About Us | ${cleanName}`, palette: "indigo", font: "inter" } },
      },
      services: {
        content: [
          {
            type: "NavbarBlock",
            props: { id: "nav-services", brandName: cleanName, ctaLabel: "Inquire", ctaLink: "/contact" },
          },
          {
            type: "HeroBlock",
            props: {
              id: "hero-services",
              badgeText: "PACKAGES",
              heading: "Our Service Offerings",
              subheading: `Comprehensive ${cleanType} packages engineered to deliver immediate value and long-term durability.`,
              ctaText: "Book Service",
              ctaLink: "/contact",
              imageUrl:
                "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=80",
              theme: "gradient",
            },
          },
          {
            type: "PricingBlock",
            props: {
              id: "pricing-services",
              sectionTitle: "Transparent Pricing Tiers",
              sectionSubtitle: "Simple, flexible plans designed for your growth.",
              plans: [
                {
                  name: "Standard Package",
                  price: "₦35,000",
                  features: `Essential ${cleanType} Delivery\nDirect WhatsApp Support\nStandard Quality Assurance`,
                  isPopular: false,
                  ctaText: "Select Standard",
                },
                {
                  name: "Executive Tier",
                  price: "₦95,000",
                  features: `Priority ${cleanType} Execution\nDedicated Support Line\nExtended Warranty\nCustom Specifications`,
                  isPopular: true,
                  ctaText: "Select Executive",
                },
              ],
            },
          },
          {
            type: "FooterBlock",
            props: {
              id: "footer-services",
              copyrightText: `© ${new Date().getFullYear()} ${cleanName}. Powered by STARKORA.`,
            },
          },
        ],
        root: { props: { title: `Services | ${cleanName}`, palette: "indigo", font: "inter" } },
      },
      contact: {
        content: [
          {
            type: "NavbarBlock",
            props: { id: "nav-contact", brandName: cleanName, ctaLabel: "Home", ctaLink: "/" },
          },
          {
            type: "HeroBlock",
            props: {
              id: "hero-contact",
              badgeText: "GET IN TOUCH",
              heading: `Contact ${cleanName}`,
              subheading: "Have questions or need a customized quote? Send us an inquiry or message us on WhatsApp.",
              ctaText: "Chat on WhatsApp",
              ctaLink: "#contact",
              imageUrl:
                "https://images.unsplash.com/photo-1534536281715-e28d76689b4d?w=800&auto=format&fit=crop&q=80",
              theme: "dark",
            },
          },
          {
            type: "ContactWhatsAppBlock",
            props: {
              id: "contact-main",
              title: "Direct Communication Channels",
              subtitle: "We respond promptly to all business inquiries during working hours.",
              phoneNumber: cleanPhone,
              whatsappMessage: `Hello ${cleanName}, I would like to make an inquiry about your ${cleanType}.`,
              email: `contact@${brandSlug || "business"}.com`,
              location: cleanLoc,
            },
          },
          {
            type: "FooterBlock",
            props: {
              id: "footer-contact",
              copyrightText: `© ${new Date().getFullYear()} ${cleanName}. Powered by STARKORA.`,
            },
          },
        ],
        root: { props: { title: `Contact Us | ${cleanName}`, palette: "indigo", font: "inter" } },
      },
    },
  };
}

export async function POST(req: Request) {
  try {
    const { businessName, businessType, description, location, phone } = await req.json();

    if (!businessName || !businessType) {
      return NextResponse.json({ error: "Business name and type are required." }, { status: 400 });
    }

    const cleanName = businessName.replace(/^welcome\s+to\s+/i, "").replace(/^the\s+/i, "").trim();
    const cleanType = businessType.replace(/^welcome\s+to\s+/i, "").trim();
    const cleanPhone = phone?.trim() || "+2348012345678";

    if (openai) {
      try {
        const prompt = `
You are an elite conversion copywriter for STARKORA.
Create a complete 4-page website layout for:
Business Name: "${cleanName}"
Industry/Type: "${cleanType}"
Location: "${location || "Nigeria"}"
WhatsApp/Phone: "${cleanPhone}"
Description: "${description || "High quality business"}"

CRITICAL RULES:
1. Block types MUST be exact strings: "NavbarBlock", "HeroBlock", "FeatureGridBlock", "PricingBlock", "TestimonialBlock", "ContactWhatsAppBlock", "FooterBlock".
2. The block list for each page MUST be an array named "content".
3. Every block MUST have an "id" inside its "props".
4. For ContactWhatsAppBlock, set props.phoneNumber strictly to "${cleanPhone}".
5. Write tailored copy for "${cleanName}". Never output generic placeholder text.

Output structure:
{
  "pages": {
    "home": {
      "content": [
        { "type": "NavbarBlock", "props": { "id": "nav-1", "brandName": "${cleanName}", "ctaLabel": "Contact Us", "ctaLink": "/contact" } },
        { "type": "HeroBlock", "props": { "id": "hero-1", "badgeText": "PREMIER SERVICE", "heading": "${cleanName}", "subheading": "...", "ctaText": "Explore Services", "ctaLink": "/services", "imageUrl": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80", "theme": "gradient" } },
        { "type": "FeatureGridBlock", "props": { "id": "feat-1", "sectionBadge": "CAPABILITIES", "sectionTitle": "Why Choose Us", "features": [{ "title": "...", "description": "..." }] } },
        { "type": "TestimonialBlock", "props": { "id": "test-1", "quote": "...", "author": "...", "role": "...", "company": "..." } },
        { "type": "ContactWhatsAppBlock", "props": { "id": "contact-1", "title": "Contact Us", "subtitle": "...", "phoneNumber": "${cleanPhone}", "whatsappMessage": "Hello!", "email": "contact@business.com", "location": "${location || "Nigeria"}" } },
        { "type": "FooterBlock", "props": { "id": "footer-1", "copyrightText": "© 2026 ${cleanName}. Powered by STARKORA." } }
      ],
      "root": { "props": { "title": "${cleanName} | Home", "palette": "indigo", "font": "inter" } }
    },
    "about": {
      "content": [
        { "type": "NavbarBlock", "props": { "id": "nav-about", "brandName": "${cleanName}", "ctaLabel": "Contact", "ctaLink": "/contact" } },
        { "type": "HeroBlock", "props": { "id": "hero-about", "badgeText": "OUR STORY", "heading": "About ${cleanName}", "subheading": "...", "ctaText": "Our Services", "ctaLink": "/services", "imageUrl": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80", "theme": "dark" } },
        { "type": "FeatureGridBlock", "props": { "id": "feat-about", "sectionBadge": "OUR VALUES", "sectionTitle": "Core Principles", "features": [{ "title": "...", "description": "..." }] } },
        { "type": "FooterBlock", "props": { "id": "footer-about", "copyrightText": "© 2026 ${cleanName}. Powered by STARKORA." } }
      ],
      "root": { "props": { "title": "About Us | ${cleanName}", "palette": "indigo", "font": "inter" } }
    },
    "services": {
      "content": [
        { "type": "NavbarBlock", "props": { "id": "nav-services", "brandName": "${cleanName}", "ctaLabel": "Inquire", "ctaLink": "/contact" } },
        { "type": "HeroBlock", "props": { "id": "hero-services", "badgeText": "PACKAGES", "heading": "Our Services", "subheading": "...", "ctaText": "Book Now", "ctaLink": "/contact", "imageUrl": "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=80", "theme": "gradient" } },
        { "type": "PricingBlock", "props": { "id": "pricing-services", "sectionTitle": "Pricing Tiers", "sectionSubtitle": "...", "plans": [{ "name": "Standard Package", "price": "₦35,000", "features": "Full Delivery\nDirect Support", "isPopular": false, "ctaText": "Select Plan" }, { "name": "Executive Tier", "price": "₦95,000", "features": "Priority Support\nCustom Needs", "isPopular": true, "ctaText": "Select Executive" }] } },
        { "type": "FooterBlock", "props": { "id": "footer-services", "copyrightText": "© 2026 ${cleanName}. Powered by STARKORA." } }
      ],
      "root": { "props": { "title": "Services | ${cleanName}", "palette": "indigo", "font": "inter" } }
    },
    "contact": {
      "content": [
        { "type": "NavbarBlock", "props": { "id": "nav-contact", "brandName": "${cleanName}", "ctaLabel": "Home", "ctaLink": "/" } },
        { "type": "HeroBlock", "props": { "id": "hero-contact", "badgeText": "GET IN TOUCH", "heading": "Contact Us", "subheading": "...", "ctaText": "Chat on WhatsApp", "ctaLink": "#contact", "imageUrl": "https://images.unsplash.com/photo-1534536281715-e28d76689b4d?w=800&auto=format&fit=crop&q=80", "theme": "dark" } },
        { "type": "ContactWhatsAppBlock", "props": { "id": "contact-main", "title": "Direct Communication", "subtitle": "...", "phoneNumber": "${cleanPhone}", "whatsappMessage": "Hello ${cleanName}!", "email": "contact@business.com", "location": "${location || "Nigeria"}" } },
        { "type": "FooterBlock", "props": { "id": "footer-contact", "copyrightText": "© 2026 ${cleanName}. Powered by STARKORA." } }
      ],
      "root": { "props": { "title": "Contact Us | ${cleanName}", "palette": "indigo", "font": "inter" } }
    }
  }
}
`;

        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: "You output strictly valid JSON conforming exactly to the schema." },
            { role: "user", content: prompt },
          ],
          response_format: { type: "json_object" },
          temperature: 0.7,
        });

        const rawJson = JSON.parse(completion.choices[0].message.content || "{}");
        const resolvedPages = rawJson?.pages || rawJson?.website?.pages || rawJson?.site?.pages;

        if (resolvedPages?.home?.content && Array.isArray(resolvedPages.home.content)) {
          // Post-process to guarantee the merchant's exact phone number is bound to all contact blocks
          for (const pageSlug of ["home", "about", "services", "contact"]) {
            const page = resolvedPages[pageSlug];
            if (page && Array.isArray(page.content)) {
              for (const block of page.content) {
                if (block.type === "ContactWhatsAppBlock" && block.props) {
                  block.props.phoneNumber = cleanPhone;
                }
              }
            }
          }

          return NextResponse.json({ siteData: { pages: resolvedPages } });
        }
      } catch (aiError) {
        console.warn("OpenAI synthesis error, serving business fallback:", aiError);
      }
    }

    const fallbackData = buildFallbackPageData(businessName, businessType, location, description, cleanPhone);
    return NextResponse.json({ siteData: fallbackData });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Generation failed" }, { status: 500 });
  }
}