import { NextResponse } from "next/server";
import OpenAI from "openai";
import { resolveNicheImages, type NicheImageSet } from "@/lib/images";

export const maxDuration = 60;

const rawKey = (process.env.OPENAI_API_KEY || "").replace(/["']/g, "").trim();
const openai = rawKey ? new OpenAI({ apiKey: rawKey }) : null;

async function generateAdaptiveHeroPhoto(
  businessName: string,
  businessType: string,
  description: string,
  fallbackImage: string
): Promise<string> {
  if (!openai) return fallbackImage;

  try {
    const prompt = `Professional commercial web photography for ${businessName}, a business specializing in ${businessType}. Context: ${description || "high quality specialized service"}. The scene must clearly show the actual environment, equipment, or service of this specific trade (e.g. if dental: dental clinic operatory, modern hygiene equipment, reassuring smile; if restaurant: gourmet plated meal, vibrant kitchen; if tailoring: bespoke fabrics, measuring tape, senator suit). Highly realistic, authentic lighting, clean architectural aesthetic, 8k resolution, no text, no watermarks.`;

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
    return item?.url || fallbackImage;
  } catch (err) {
    console.warn("AI Image generation failed, falling back to curated niche photo:", err);
    return fallbackImage;
  }
}

function buildSpecializedFallback(
  businessName: string,
  businessType: string,
  location: string,
  description: string,
  phone: string,
  images: NicheImageSet,
  heroPhoto: string
) {
  const brandSlug = businessName.toLowerCase().replace(/[^a-z0-9]/g, "");

  return {
    pages: {
      home: {
        content: [
          {
            type: "NavbarBlock",
            props: { id: "nav-home", brandName: businessName, ctaLabel: "Book Appointment", ctaLink: "/contact" },
          },
          {
            type: "HeroBlock",
            props: {
              id: "hero-home",
              layout: "text-left",
              badgeText: "PREMIER CARE & EXPERTISE",
              heading: businessName,
              subheading:
                description ||
                `Providing specialized, high-standard ${businessType} across ${location} with cutting-edge equipment, certified specialists, and complete client comfort.`,
              ctaText: "Explore Services",
              ctaLink: "/services",
              imageUrl: heroPhoto,
              theme: "gradient",
            },
          },
          {
            type: "AboutTeaserBlock",
            props: {
              id: "about-teaser-home",
              sectionBadge: "ABOUT OUR PRACTICE",
              heading: `Dedicated to Patient & Client Excellence`,
              storyText: `At ${businessName}, we combine compassionate care with modern technology. Every treatment plan and service engagement is customized to ensure lasting results and complete peace of mind.`,
              imageUrl: images.about,
              ctaText: "Read Full Story ➔",
              ctaLink: "/about",
            },
          },
          {
            type: "ServicesGridBlock",
            props: {
              id: "services-home",
              sectionBadge: "CORE PROCEDURES & SOLUTIONS",
              sectionTitle: "Specialized Clinical Offerings",
              sectionSubtitle: `State-of-the-art procedures tailored for comfort, precision, and visible results.`,
              services: [
                {
                  title: "Comprehensive Examination & Care",
                  description: "Full diagnostic assessment, hygiene check, and personalized treatment roadmap.",
                  price: "₦25,000",
                  ctaText: "Book Consultation",
                },
                {
                  title: "Advanced Aesthetic Restoration",
                  description: "State-of-the-art restorative procedures designed for long-term health and aesthetics.",
                  price: "₦65,000",
                  ctaText: "Schedule Session",
                },
                {
                  title: "Full Specialized Package",
                  description: "Complete turnkey clinical solution including follow-up reviews and dedicated care.",
                  price: "₦150,000",
                  ctaText: "Inquire Now",
                },
              ],
            },
          },
          {
            type: "GalleryGridBlock",
            props: {
              id: "gallery-home",
              sectionTitle: "Our Environment & Deliverables",
              sectionSubtitle: `Step inside our modern facility equipped with the latest diagnostic and care technology.`,
              items: [
                { title: "Sterile Modern Facility", description: "Pristine hygiene and comforting ambiance.", imageUrl: images.gallery[0] },
                { title: "Advanced Equipment", description: "Modern precision tools ensuring comfortable procedures.", imageUrl: images.gallery[1] },
                { title: "Satisfied Smiles & Outcomes", description: "Delivering confidence and health for every client.", imageUrl: images.gallery[2] },
              ],
            },
          },
          {
            type: "TestimonialBlock",
            props: {
              id: "test-home",
              sectionBadge: "VERIFIED EXPERIENCES",
              sectionTitle: "What Our Clients & Patients Say",
              testimonials: [
                {
                  quote: `My experience at ${businessName} completely exceeded expectations. The team is gentle, thorough, and the clinic is spotless.`,
                  author: "Dr. Kemi Adeyemi",
                  role: "Consultant Physician",
                  company: "Lagos University Teaching Hospital",
                  rating: 5,
                },
                {
                  quote: `The most comfortable procedure I've ever had. Clear pricing, modern equipment, and zero anxiety from start to finish.`,
                  author: "Emeka Okonkwo",
                  role: "Managing Director",
                  company: "Okonkwo Holdings",
                  rating: 5,
                },
                {
                  quote: `Professional staff, prompt appointments, and genuine care. I recommend ${businessName} to all my colleagues.`,
                  author: "Fatima Bello",
                  role: "Senior Partner",
                  company: "Bello & Associates",
                  rating: 5,
                },
              ],
            },
          },
          {
            type: "ContactWhatsAppBlock",
            props: {
              id: "contact-home",
              title: `Connect With ${businessName}`,
              subtitle: "Book an appointment or submit an inquiry below. We respond promptly.",
              phoneNumber: phone,
              whatsappMessage: `Hello ${businessName}, I would like to schedule a consultation.`,
              email: `contact@${brandSlug || "business"}.com`,
              location,
            },
          },
          {
            type: "FooterBlock",
            props: {
              id: "footer-home",
              brandName: businessName,
              tagline: `Premier ${businessType} in ${location}. Committed to highest medical & clinical standards.`,
              copyrightText: `© ${new Date().getFullYear()} ${businessName}. Powered by STARKORA.`,
              instagram: "https://instagram.com",
              whatsapp: `https://wa.me/${phone.replace(/[^0-9]/g, "")}`,
              twitter: "https://x.com",
              linkedin: "https://linkedin.com",
            },
          },
        ],
        root: { props: { title: `${businessName} | Home`, palette: "sapphire", font: "jakarta" } },
      },
      about: {
        content: [
          {
            type: "NavbarBlock",
            props: { id: "nav-about", brandName: businessName, ctaLabel: "Contact", ctaLink: "/contact" },
          },
          {
            type: "HeroBlock",
            props: {
              id: "hero-about",
              layout: "image-left",
              badgeText: "OUR STORY",
              heading: `About ${businessName}`,
              subheading: `Dedicated to elevating standards in ${businessType} through continuous education, advanced equipment, and genuine empathy.`,
              ctaText: "View Our Services",
              ctaLink: "/services",
              imageUrl: images.about,
              theme: "dark",
            },
          },
          {
            type: "FeatureGridBlock",
            props: {
              id: "feat-about",
              sectionBadge: "OUR VALUES",
              sectionTitle: "Principles That Guide Every Procedure",
              features: [
                { title: "Clinical Rigor", description: "Strict adherence to international hygiene and safety protocols." },
                { title: "Patient Comfort", description: "Minimally invasive techniques designed to eliminate procedural stress." },
                { title: "Transparent Care", description: "Upfront pricing, detailed treatment plans, and zero hidden costs." },
              ],
            },
          },
          {
            type: "FooterBlock",
            props: {
              id: "footer-about",
              brandName: businessName,
              tagline: `Premier ${businessType} in ${location}.`,
              copyrightText: `© ${new Date().getFullYear()} ${businessName}. Powered by STARKORA.`,
            },
          },
        ],
        root: { props: { title: `About Us | ${businessName}`, palette: "sapphire", font: "jakarta" } },
      },
      services: {
        content: [
          {
            type: "NavbarBlock",
            props: { id: "nav-services", brandName: businessName, ctaLabel: "Inquire", ctaLink: "/contact" },
          },
          {
            type: "PricingBlock",
            props: {
              id: "pricing-services",
              sectionTitle: "Treatment & Engagement Packages",
              sectionSubtitle: "Transparent clinical rates designed for comprehensive care.",
              plans: [
                {
                  name: "Routine Consultation & Checkup",
                  price: "₦25,000",
                  features: "Full Diagnostic Scan\nSpecialist Assessment\nHygiene Review & Advice",
                  isPopular: false,
                  ctaText: "Book Checkup",
                },
                {
                  name: "Comprehensive Specialized Treatment",
                  price: "₦75,000",
                  features: "Advanced Procedure\nLocal Anesthesia & Comfort Care\nPost-Treatment Review Included",
                  isPopular: true,
                  ctaText: "Book Specialized Plan",
                },
              ],
            },
          },
          {
            type: "FooterBlock",
            props: {
              id: "footer-services",
              brandName: businessName,
              tagline: `Premier ${businessType} in ${location}.`,
              copyrightText: `© ${new Date().getFullYear()} ${businessName}. Powered by STARKORA.`,
            },
          },
        ],
        root: { props: { title: `Services | ${businessName}`, palette: "sapphire", font: "jakarta" } },
      },
      contact: {
        content: [
          {
            type: "NavbarBlock",
            props: { id: "nav-contact", brandName: businessName, ctaLabel: "Home", ctaLink: "/" },
          },
          {
            type: "HeroBlock",
            props: {
              id: "hero-contact",
              badgeText: "GET IN TOUCH",
              heading: `Contact ${businessName}`,
              subheading: "Schedule your consultation or send an inquiry. Our care team responds promptly.",
              ctaText: "Chat on WhatsApp",
              ctaLink: "#contact",
              imageUrl: images.gallery[0],
              theme: "dark",
            },
          },
          {
            type: "ContactWhatsAppBlock",
            props: {
              id: "contact-main",
              title: "Direct Consultation Channels",
              subtitle: "We welcome new clients and patients during regular clinical hours.",
              phoneNumber: phone,
              whatsappMessage: `Hello ${businessName}!`,
              email: `contact@${brandSlug || "business"}.com`,
              location,
            },
          },
          {
            type: "FooterBlock",
            props: {
              id: "footer-contact",
              brandName: businessName,
              tagline: `Premier ${businessType} in ${location}.`,
              copyrightText: `© ${new Date().getFullYear()} ${businessName}. Powered by STARKORA.`,
            },
          },
        ],
        root: { props: { title: `Contact Us | ${businessName}`, palette: "sapphire", font: "jakarta" } },
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

    // 1. Resolve Niche Photography
    const nicheImages = resolveNicheImages(cleanType, cleanName);

    // 2. Synthesize AI Hero Image and Flagship Copy in Parallel
    const [heroPhotoUrl, aiCompletion] = await Promise.all([
      generateAdaptiveHeroPhoto(cleanName, cleanType, description, nicheImages.hero),
      openai
        ? openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
              {
                role: "system",
                content: `You are an elite industry-specialist conversion copywriter for STARKORA.
CRITICAL COPYWRITING DIRECTIVES:
1. Deeply understand the trade: If the user provides a Dental or Teeth business, write authentic dental copy (e.g. Painless Extractions, Laser Teeth Whitening, Orthodontics, Dental Implants, Pediatric Care, Smile Makeovers). If a Catering business, write culinary terms (Chef Tasting, Banquet Buffet, Plated Dinner).
2. FORBIDDEN WORDS: NEVER use generic corporate filler like "Punctual Delivery of Verified Craftsmanship" or "Turnkey Solutions" for a clinic or salon.
3. PRICING: Provide realistic Nigerian Naira (₦) rates suited to the actual services.
4. REVIEWS: Write 3 authentic reviews with credible client names, executive titles, and 5-star ratings.
5. JSON SCHEMA: Output MUST conform strictly to the specified structure.`,
              },
              {
                role: "user",
                content: `
Create a complete 4-page website layout for:
Business Name: "${cleanName}"
Industry: "${cleanType}"
Location: "${cleanLoc}"
Phone: "${cleanPhone}"
Description: "${description || "Specialized commercial business"}"

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
        console.warn("AI JSON parse error, using specialized fallback:", parseErr);
      }
    }

    if (!finalPages) {
      finalPages = buildSpecializedFallback(cleanName, cleanType, cleanLoc, description, cleanPhone, nicheImages, heroPhotoUrl).pages;
    }

    // 3. Post-Process: Guarantee Niche Visuals & Phone Across All Pages
    for (const slug of ["home", "about", "services", "contact"]) {
      const page = finalPages[slug];
      if (page && Array.isArray(page.content)) {
        for (const block of page.content) {
          if (block.type === "HeroBlock" && block.props) {
            if (!block.props.imageUrl || block.props.imageUrl.includes("photo-1486406146926") || block.props.imageUrl.includes("photo-1460925895917")) {
              block.props.imageUrl = heroPhotoUrl;
            }
          }
          if (block.type === "AboutTeaserBlock" && block.props) {
            if (!block.props.imageUrl || block.props.imageUrl.includes("photo-1522071820081")) {
              block.props.imageUrl = nicheImages.about;
            }
          }
          if (block.type === "GalleryGridBlock" && block.props && Array.isArray(block.props.items)) {
            block.props.items.forEach((item: any, i: number) => {
              if (!item.imageUrl || item.imageUrl.includes("photo-1509631179647") || item.imageUrl.includes("photo-1555396273")) {
                item.imageUrl = nicheImages.gallery[i % nicheImages.gallery.length];
              }
            });
          }
          if (block.type === "ContactWhatsAppBlock" && block.props) {
            block.props.phoneNumber = cleanPhone;
          }
          if (block.type === "FooterBlock" && block.props) {
            block.props.whatsapp = `https://wa.me/${cleanPhone.replace(/[^0-9]/g, "")}`;
            block.props.brandName = cleanName;
          }
        }
      }
    }

    return NextResponse.json({ siteData: { pages: finalPages } });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Generation failed" }, { status: 500 });
  }
}