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

function buildFallbackPageData(
  businessName: string,
  businessType: string,
  location: string,
  description: string,
  phone?: string,
  heroPhotoUrl?: string
) {
  const cleanName = businessName.replace(/^welcome\s+to\s+/i, "").replace(/^the\s+/i, "").trim() || "Business";
  const cleanType = businessType.replace(/^welcome\s+to\s+/i, "").trim() || "Services";
  const cleanLoc = location || "Lagos, Nigeria";
  const cleanPhone = phone?.trim() || "+2348012345678";
  const brandSlug = cleanName.toLowerCase().replace(/[^a-z0-9]/g, "");
  const photo = heroPhotoUrl || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80";

  return {
    pages: {
      home: {
        content: [
          {
            type: "NavbarBlock",
            props: { id: "nav-home", brandName: cleanName, ctaLabel: "Inquire Now", ctaLink: "/contact" },
          },
          {
            type: "HeroBlock",
            props: {
              id: "hero-home",
              layout: "text-left",
              badgeText: "PREMIER SERVICE",
              heading: cleanName,
              subheading:
                description ||
                `Providing premier ${cleanType} solutions across${cleanLoc} with verified quality, prompt delivery, and complete customer satisfaction.`,
              ctaText: "Explore Packages",
              ctaLink: "/services",
              imageUrl: photo,
              theme: "gradient",
            },
          },
          {
            type: "AboutTeaserBlock",
            props: {
              id: "about-teaser-home",
              sectionBadge: "OUR STORY",
              heading: `Crafted with Purpose & Integrity`,
              storyText: `At ${cleanName}, we believe excellence is in the details. Delivering exceptional ${cleanType} solutions across${cleanLoc} for clients who value dependability and precision.`,
              imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1000&auto=format&fit=crop&q=80",
              ctaText: "Read Full Story ➔",
              ctaLink: "/about",
            },
          },
          {
            type: "ServicesGridBlock",
            props: {
              id: "services-home",
              sectionBadge: "WHAT WE OFFER",
              sectionTitle: "Specialized Service Offerings",
              sectionSubtitle: `Explore our specialized solutions engineered for measurable client satisfaction.`,
              services: [
                { title: "Standard Package", description: `Entry tier ${cleanType} delivery with dedicated consultation.`, price: "₦35,000", ctaText: "Inquire Now" },
                { title: "Executive Masterclass", description: `Priority engagement including full custom specifications.`, price: "₦85,000", ctaText: "Book Service" },
                { title: "Full Turnkey Suite", description: `Comprehensive execution tailored to executive requirements.`, price: "₦180,000", ctaText: "Request Quote" },
              ],
            },
          },
          {
            type: "GalleryGridBlock",
            props: {
              id: "gallery-home",
              sectionTitle: "Signature Portfolio",
              sectionSubtitle: `Explore recent deliverables and collection pieces from ${cleanName}.`,
              items: [
                { title: "Executive Standard", description: "Bespoke execution with premier materials.", imageUrl: photo },
                { title: "Custom Solutions", description: "Tailored directly to unique customer requirements.", imageUrl: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80" },
                { title: "Punctual Delivery", description: "Delivered promptly without compromising excellence.", imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80" },
              ],
            },
          },
          {
            type: "TestimonialBlock",
            props: {
              id: "test-home",
              sectionBadge: "CLIENT REVIEWS",
              sectionTitle: "Endorsed by Our Clientele",
              testimonials: [
                { quote: `Working with ${cleanName} was effortless. Their attention to detail and punctuality exceeded all expectations.`, author: "Alhaji Ibrahim Danjuma", role: "Managing Director", company: "Danjuma Holdings", rating: 5 },
                { quote: `The speed of execution and quality transformed our operations completely. Outstanding professionalism.`, author: "Chioma Adeleke", role: "Creative Director", company: "Adeleke Brand Studio", rating: 5 },
                { quote: `Their team delivers verified results with zero downtime. Highly recommended for any serious organization.`, author: "Tunde Babalola", role: "Principal Broker", company: "Apex Capital Properties", rating: 5 },
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
              whatsappMessage: `Hello ${cleanName}, I would like to inquire about your${cleanType}.`,
              email: `contact@${brandSlug || "business"}.com`,
              location: cleanLoc,
            },
          },
          {
            type: "FooterBlock",
            props: {
              id: "footer-home",
              brandName: cleanName,
              tagline: `Premier ${cleanType} solutions across${cleanLoc}. Engineered for excellence and verified dependability.`,
              copyrightText: `© ${new Date().getFullYear()}${cleanName}. Powered by STARKORA.`,
              instagram: "https://instagram.com",
              whatsapp: `https://wa.me/${cleanPhone.replace(/[^0-9]/g, "")}`,
              twitter: "https://x.com",
              linkedin: "https://linkedin.com",
            },
          },
        ],
        root: { props: { title: `${cleanName} | Home`, palette: "sapphire", font: "jakarta" } },
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
              layout: "image-left",
              badgeText: "OUR STORY",
              heading: `About ${cleanName}`,
              subheading: `Dedicated to delivering exceptional ${cleanType} solutions with integrity, precision, and customer-first focus.`,
              ctaText: "View Our Services",
              ctaLink: "/services",
              imageUrl: photo,
              theme: "dark",
            },
          },
          {
            type: "FeatureGridBlock",
            props: {
              id: "feat-about",
              sectionBadge: "OUR VALUES",
              sectionTitle: "Principles That Guide Every Project",
              features: [
                { title: "Integrity First", description: "Transparent communication, honest pricing, and accountability." },
                { title: "Client Success", description: "Our metrics are defined exclusively by client satisfaction." },
                { title: "Continuous Innovation", description: "Adopting modern industry workflows to keep you ahead." },
              ],
            },
          },
          {
            type: "FooterBlock",
            props: {
              id: "footer-about",
              brandName: cleanName,
              tagline: `Premier ${cleanType} solutions across${cleanLoc}.`,
              copyrightText: `© ${new Date().getFullYear()}${cleanName}. Powered by STARKORA.`,
            },
          },
        ],
        root: { props: { title: `About Us | ${cleanName}`, palette: "sapphire", font: "jakarta" } },
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
              badgeText: "SOLUTIONS",
              heading: "Our Service Offerings",
              subheading: `Comprehensive ${cleanType} packages engineered to deliver immediate value and long-term durability.`,
              ctaText: "Book Service",
              ctaLink: "/contact",
              imageUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=80",
              theme: "gradient",
            },
          },
          {
            type: "PricingBlock",
            props: {
              id: "pricing-services",
              sectionTitle: "Curated Packages",
              sectionSubtitle: "Simple, transparent pricing tailored to your needs.",
              plans: [
                { name: "Standard Package", price: "₦35,000", features: `Complete ${cleanType} Delivery\nDirect Support & Consultation\nStandard Quality Assurance`, isPopular: false, ctaText: "Select Plan" },
                { name: "Executive Tier", price: "₦95,000", features: `Priority Execution\nDedicated Support Line\nExtended Warranty\nCustom Specifications`, isPopular: true, ctaText: "Select Executive" },
              ],
            },
          },
          {
            type: "FooterBlock",
            props: {
              id: "footer-services",
              brandName: cleanName,
              tagline: `Premier ${cleanType} solutions across${cleanLoc}.`,
              copyrightText: `© ${new Date().getFullYear()}${cleanName}. Powered by STARKORA.`,
            },
          },
        ],
        root: { props: { title: `Services | ${cleanName}`, palette: "sapphire", font: "jakarta" } },
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
              imageUrl: "https://images.unsplash.com/photo-1534536281715-e28d76689b4d?w=800&auto=format&fit=crop&q=80",
              theme: "dark",
            },
          },
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
          {
            type: "FooterBlock",
            props: {
              id: "footer-contact",
              brandName: cleanName,
              tagline: `Premier ${cleanType} solutions across${cleanLoc}.`,
              copyrightText: `© ${new Date().getFullYear()}${cleanName}. Powered by STARKORA.`,
            },
          },
        ],
        root: { props: { title: `Contact Us | ${cleanName}`, palette: "sapphire", font: "jakarta" } },
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
    const cleanLoc = location || "Lagos, Nigeria";
    const cleanPhone = phone?.trim() || "+2348012345678";

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
                  "You are an elite conversion copywriter for STARKORA. Output strictly valid JSON conforming exactly to the layout schema. Write compelling, high-converting Nigerian/regional commercial copy. Never repeat raw prompt phrases verbatim.",
              },
              {
                role: "user",
                content: `
Create a complete, rich 4-page website layout for:
Business Name: "${cleanName}"
Industry: "${cleanType}"
Location: "${cleanLoc}"
Phone: "${cleanPhone}"
Description: "${description || "High-growth premium enterprise"}"

Allowed Block Types:
- NavbarBlock (props: id, brandName, ctaLabel, ctaLink)
- HeroBlock (props: id, layout ["text-left"|"image-left"|"centered"], badgeText, heading, subheading, ctaText, ctaLink, imageUrl, theme ["light"|"dark"|"gradient"])
- AboutTeaserBlock (props: id, sectionBadge, heading, storyText, imageUrl, ctaText, ctaLink)
- ServicesGridBlock (props: id, sectionBadge, sectionTitle, sectionSubtitle, services [{ title, description, price, ctaText }])
- GalleryGridBlock (props: id, sectionTitle, sectionSubtitle, items [{ title, description, imageUrl }])
- FeatureGridBlock (props: id, sectionBadge, sectionTitle, features [{ title, description }])
- PricingBlock (props: id, sectionTitle, sectionSubtitle, plans [{ name, price, features, isPopular, ctaText }])
- TestimonialBlock (props: id, sectionBadge, sectionTitle, testimonials [{ quote, author, role, company, rating }])
- ContactWhatsAppBlock (props: id, title, subtitle, phoneNumber, whatsappMessage, email, location)
- NewsletterBlock (props: id, title, subtitle, buttonText)
- FooterBlock (props: id, brandName, tagline, copyrightText, instagram, whatsapp, twitter, linkedin)

Root props:
- title: string
- palette: "sapphire" | "indigo" | "emerald" | "gold" | "crimson" | "minimal"
- font: "jakarta" | "inter" | "playfair" | "cinzel" | "space" | "mono"

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

    if (!finalPages) {
      finalPages = buildFallbackPageData(cleanName, cleanType, cleanLoc, description, cleanPhone, heroPhotoUrl).pages;
    }

    // Bind custom AI image and phone number across pages
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
          if (block.type === "FooterBlock" && block.props) {
            block.props.whatsapp = `https://wa.me/${cleanPhone.replace(/[^0-9]/g, "")}`;
          }
        }
      }
    }

    return NextResponse.json({ siteData: { pages: finalPages } });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Generation failed" }, { status: 500 });
  }
}