import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export async function POST(req: Request) {
  try {
    const { currentLayout, instruction } = await req.json();

    if (!instruction) {
      return NextResponse.json({ error: "Instruction prompt is required" }, { status: 400 });
    }

    // 1. Live OpenAI Engine (if key exists)
    if (openai) {
      const prompt = `
You are an expert web developer and copywriter for STARKORA.
Current layout JSON:
${JSON.stringify(currentLayout)}

User instruction:
"${instruction}"

Available Root props:
- root.props.title: string
- root.props.palette: "indigo" | "emerald" | "gold" | "crimson" | "minimal"
- root.props.font: "inter" | "jakarta" | "playfair" | "cinzel" | "space" | "mono"

Allowed components:
- NavbarBlock, HeroBlock, FeatureGridBlock, PricingBlock, TestimonialBlock, ContactWhatsAppBlock, FooterBlock.

Return ONLY a valid JSON object matching: { content: [...], root: { props: { ... } } }.
Do not include markdown or explanations.
`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You output strictly valid JSON conforming to the layout schema." },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
      });

      const updated = JSON.parse(completion.choices[0].message.content || "{}");
      return NextResponse.json({ layoutData: updated });
    }

    // 2. Offline Deterministic Engine
    const cloned = JSON.parse(JSON.stringify(currentLayout));
    const lower = instruction.toLowerCase();

    if (!cloned.root) cloned.root = { props: {} };
    if (!cloned.root.props) cloned.root.props = {};

    // Theme & Font Keyword Matching
    if (lower.includes("gold") || lower.includes("luxury") || lower.includes("prestige")) {
      cloned.root.props.palette = "gold";
      cloned.root.props.font = "cinzel";
    } else if (lower.includes("emerald") || lower.includes("green") || lower.includes("fintech") || lower.includes("growth")) {
      cloned.root.props.palette = "emerald";
      cloned.root.props.font = "jakarta";
    } else if (lower.includes("crimson") || lower.includes("red") || lower.includes("bold") || lower.includes("creative")) {
      cloned.root.props.palette = "crimson";
      cloned.root.props.font = "space";
    } else if (lower.includes("minimal") || lower.includes("clean") || lower.includes("monochrome") || lower.includes("studio")) {
      cloned.root.props.palette = "minimal";
      cloned.root.props.font = "inter";
    } else if (lower.includes("indigo") || lower.includes("tech") || lower.includes("modern") || lower.includes("blue")) {
      cloned.root.props.palette = "indigo";
      cloned.root.props.font = "inter";
    }

    // Font-only keywords
    if (lower.includes("serif") || lower.includes("editorial")) {
      cloned.root.props.font = "playfair";
    } else if (lower.includes("code") || lower.includes("mono") || lower.includes("developer")) {
      cloned.root.props.font = "mono";
    }

    // Copy adjustments
    if (lower.includes("professional") || lower.includes("corporate")) {
      const hero = cloned.content.find((b: any) => b.type === "HeroBlock");
      if (hero) {
        hero.props.heading = "Institutional Excellence & Industry Leadership";
        hero.props.subheading = "Delivering premier enterprise solutions engineered for scale, reliability, and measurable client success.";
        hero.props.ctaText = "Schedule Consultation";
      }
    }

    // Pricing injection
    if (lower.includes("pricing") || lower.includes("price")) {
      const hasPricing = cloned.content.some((b: any) => b.type === "PricingBlock");
      if (!hasPricing) {
        cloned.content.splice(2, 0, {
          type: "PricingBlock",
          props: {
            id: `pricing-${Date.now()}`,
            sectionTitle: "Transparent Pricing Tiers",
            sectionSubtitle: "Simple, flexible plans designed for your growth.",
            plans: [
              {
                name: "Standard",
                price: "₦35,000",
                features: "Complete Setup\nWhatsApp Direct Support\nStandard SLA",
                isPopular: false,
                ctaText: "Get Started",
              },
              {
                name: "Enterprise Pro",
                price: "₦95,000",
                features: "Dedicated Manager\nPriority Turnaround\n24/7 Support\nCustom Domain Included",
                isPopular: true,
                ctaText: "Select Pro",
              },
            ],
          },
        });
      }
    }

    return NextResponse.json({ layoutData: cloned });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to refine layout" }, { status: 500 });
  }
}