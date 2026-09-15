import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

function buildPageData(businessName: string, businessType: string, location: string, description: string) {
  const brandClean = businessName.toLowerCase().replace(/[^a-z0-9]/g, "");

  return {
    pages: {
      home: {
        content: [
          {
            type: "NavbarBlock",
            props: { id: "nav-home", brandName: businessName, ctaLabel: "Contact Us", ctaLink: "/contact" }
          },
          {
            type: "HeroBlock",
            props: {
              id: "hero-home",
              badgeText: "PREMIER SERVICE",
              heading: `${businessName}: Modern ${businessType}`,
              subheading: description || `Leading the standard in ${businessType} across ${location || "Nigeria"} with fast turnaround and verified excellence.`,
              ctaText: "Explore Services",
              ctaLink: "/services",
              imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80",
              theme: "gradient"
            }
          },
          {
            type: "FeatureGridBlock",
            props: {
              id: "feat-home",
              sectionBadge: "WHY CHOOSE US",
              sectionTitle: "Built For Measurable Results",
              features: [
                { title: "Rapid Execution", description: `Prompt turnaround tailored to client needs across ${location || "our region"}.` },
                { title: "Verified Reliability", description: "Standard operating quality guaranteed across every customer engagement." },
                { title: "Direct Contact", description: "Seamless WhatsApp and phone availability for transparent communication." }
              ]
            }
          },
          {
            type: "TestimonialBlock",
            props: {
              id: "test-home",
              quote: `Working with ${businessName} completely transformed our operational speed. Outstanding responsiveness and attention to detail.`,
              author: "Alhaji Ibrahim Danjuma",
              role: "Managing Director",
              company: "Danjuma Holdings"
            }
          },
          {
            type: "ContactWhatsAppBlock",
            props: {
              id: "contact-home",
              title: "Connect With Us Directly",
              subtitle: `Reach out to ${businessName} via WhatsApp or send an inquiry below.`,
              phoneNumber: "+2348012345678",
              whatsappMessage: `Hello ${businessName}, I would like to inquire about your services.`,
              email: `info@${brandClean || "business"}.com`,
              location: location || "Lagos, Nigeria"
            }
          },
          {
            type: "FooterBlock",
            props: { id: "footer-home", copyrightText: `© ${new Date().getFullYear()} ${businessName}. Powered by STARKORA.` }
          }
        ],
        root: { props: { title: `${businessName} | Official Website`, palette: "indigo", font: "inter" } }
      },

      about: {
        content: [
          {
            type: "NavbarBlock",
            props: { id: "nav-about", brandName: businessName, ctaLabel: "Work With Us", ctaLink: "/contact" }
          },
          {
            type: "HeroBlock",
            props: {
              id: "hero-about",
              badgeText: "OUR STORY & VALUES",
              heading: `About ${businessName}`,
              subheading: `Dedicated to delivering exceptional ${businessType} solutions with integrity, precision, and customer-first focus.`,
              ctaText: "View Our Services",
              ctaLink: "/services",
              imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80",
              theme: "dark"
            }
          },
          {
            type: "FeatureGridBlock",
            props: {
              id: "feat-about",
              sectionBadge: "OUR MISSION",
              sectionTitle: "Principles That Guide Every Project",
              features: [
                { title: "Integrity First", description: "Transparent communication, honest pricing, and accountability at every stage." },
                { title: "Customer Success", description: "Our metrics are defined exclusively by the satisfaction and growth of our clientele." },
                { title: "Continuous Innovation", description: "Adopting modern industry workflows to keep you ahead of market demands." }
              ]
            }
          },
          {
            type: "FooterBlock",
            props: { id: "footer-about", copyrightText: `© ${new Date().getFullYear()} ${businessName}. Powered by STARKORA.` }
          }
        ],
        root: { props: { title: `About Us | ${businessName}`, palette: "indigo", font: "inter" } }
      },

      services: {
        content: [
          {
            type: "NavbarBlock",
            props: { id: "nav-services", brandName: businessName, ctaLabel: "Inquire Now", ctaLink: "/contact" }
          },
          {
            type: "HeroBlock",
            props: {
              id: "hero-services",
              badgeText: "PACKAGES & SOLUTIONS",
              heading: "Our Service Offerings",
              subheading: `Comprehensive ${businessType} packages engineered to deliver immediate value and long-term durability.`,
              ctaText: "Book Service",
              ctaLink: "/contact",
              imageUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=80",
              theme: "gradient"
            }
          },
          {
            type: "PricingBlock",
            props: {
              id: "pricing-services",
              sectionTitle: "Transparent Pricing Tiers",
              sectionSubtitle: "Select the service package that fits your operational requirements.",
              plans: [
                {
                  name: "Standard Package",
                  price: "₦35,000",
                  features: "Essential Setup\nWhatsApp Direct Support\nStandard SLA Warranty",
                  isPopular: false,
                  ctaText: "Select Standard"
                },
                {
                  name: "Executive Tier",
                  price: "₦95,000",
                  features: "Priority Execution\nDedicated Support Line\nExtended Warranty\nCustom Requirements",
                  isPopular: true,
                  ctaText: "Select Executive"
                }
              ]
            }
          },
          {
            type: "FooterBlock",
            props: { id: "footer-services", copyrightText: `© ${new Date().getFullYear()} ${businessName}. Powered by STARKORA.` }
          }
        ],
        root: { props: { title: `Services & Pricing | ${businessName}`, palette: "indigo", font: "inter" } }
      },

      contact: {
        content: [
          {
            type: "NavbarBlock",
            props: { id: "nav-contact", brandName: businessName, ctaLabel: "Home", ctaLink: "/" }
          },
          {
            type: "HeroBlock",
            props: {
              id: "hero-contact",
              badgeText: "GET IN TOUCH",
              heading: `Contact ${businessName}`,
              subheading: "Have questions or need a customized quote? Send us an inquiry or message us on WhatsApp.",
              ctaText: "Chat on WhatsApp",
              ctaLink: "#contact",
              imageUrl: "https://images.unsplash.com/photo-1534536281715-e28d76689b4d?w=800&auto=format&fit=crop&q=80",
              theme: "dark"
            }
          },
          {
            type: "ContactWhatsAppBlock",
            props: {
              id: "contact-main",
              title: "Direct Communication Channels",
              subtitle: "We respond promptly to all business inquiries during working hours.",
              phoneNumber: "+2348012345678",
              whatsappMessage: `Hello ${businessName}, I would like to make an inquiry.`,
              email: `contact@${brandClean || "business"}.com`,
              location: location || "Lagos, Nigeria"
            }
          },
          {
            type: "FooterBlock",
            props: { id: "footer-contact", copyrightText: `© ${new Date().getFullYear()} ${businessName}. Powered by STARKORA.` }
          }
        ],
        root: { props: { title: `Contact Us | ${businessName}`, palette: "indigo", font: "inter" } }
      }
    }
  };
}

export async function POST(req: Request) {
  try {
    const { businessName, businessType, description, location } = await req.json();

    if (!businessName || !businessType) {
      return NextResponse.json({ error: "Business name and type are required." }, { status: 400 });
    }

    const multiPageData = buildPageData(businessName, businessType, location, description);
    return NextResponse.json({ siteData: multiPageData });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Generation failed" }, { status: 500 });
  }
}