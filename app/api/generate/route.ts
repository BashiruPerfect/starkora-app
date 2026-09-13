import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export async function POST(req: Request) {
  try {
    const { businessName, businessType, description, location } = await req.json();

    if (!businessName || !businessType) {
      return NextResponse.json(
        { error: "Business name and type are required." },
        { status: 400 }
      );
    }

    // 1. If OPENAI_API_KEY is configured, call OpenAI with strict JSON output
    if (openai) {
      const prompt = `
You are an expert web copywriter and UI designer for STARKORA.
Create a complete high-converting landing page structure for:
- Business Name: ${businessName}
- Industry/Type: ${businessType}
- Location: ${location || "Nigeria"}
- Details: ${description || "Premier services in the region"}

Return ONLY a valid JSON object matching this exact schema:
{
  "content": [
    {
      "type": "NavbarBlock",
      "props": {
        "id": "navbar-1",
        "brandName": "${businessName}",
        "ctaLabel": "Contact Us",
        "ctaLink": "#contact"
      }
    },
    {
      "type": "HeroBlock",
      "props": {
        "id": "hero-1",
        "heading": "string (high-converting hero title)",
        "subheading": "string (1-2 sentence compelling value proposition)",
        "ctaText": "string (e.g., 'Book Now', 'Order Delivery', 'Get Quote')",
        "ctaLink": "#contact",
        "theme": "gradient"
      }
    },
    {
      "type": "FeatureGridBlock",
      "props": {
        "id": "features-1",
        "sectionTitle": "string (e.g. 'Why Choose Us')",
        "features": [
          { "title": "string", "description": "string" },
          { "title": "string", "description": "string" },
          { "title": "string", "description": "string" }
        ]
      }
    },
    {
      "type": "ContactWhatsAppBlock",
      "props": {
        "id": "contact-1",
        "title": "string (e.g. 'Get in Touch with ${businessName}')",
        "subtitle": "string",
        "phoneNumber": "+2348012345678",
        "whatsappMessage": "Hello ${businessName}, I would like to inquire about your services.",
        "email": "info@${businessName.toLowerCase().replace(/[^a-z0-9]/g, "")}.com",
        "location": "${location || "Lagos, Nigeria"}"
      }
    },
    {
      "type": "FooterBlock",
      "props": {
        "id": "footer-1",
        "copyrightText": "© ${new Date().getFullYear()} ${businessName}. Powered by STARKORA."
      }
    }
  ],
  "root": {
    "props": {
      "title": "${businessName} | Official Website"
    }
  }
}
`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You output strictly valid JSON matching the user schema." },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
      });

      const rawJson = completion.choices[0].message.content || "{}";
      const siteData = JSON.parse(rawJson);
      return NextResponse.json({ siteData });
    }

    // 2. Fallback Engine: Deterministic full 5-block synthesis
    const fallbackSiteData = {
      content: [
        {
          type: "NavbarBlock",
          props: {
            id: "navbar-1",
            brandName: businessName,
            ctaLabel: "Contact Now",
            ctaLink: "#contact",
          },
        },
        {
          type: "HeroBlock",
          props: {
            id: "hero-1",
            heading: `${businessName}: Premier ${businessType}`,
            subheading: description || `Delivering top-tier ${businessType} solutions in ${location || "Nigeria"} with unmatched quality, reliability, and speed.`,
            ctaText: "Chat with Us",
            ctaLink: "#contact",
            theme: "gradient",
          },
        },
        {
          type: "FeatureGridBlock",
          props: {
            id: "features-1",
            sectionTitle: `Why Clients Choose ${businessName}`,
            features: [
              {
                title: "Prompt Delivery",
                description: `Fast and reliable execution across ${location || "all service regions"} without compromise.`,
              },
              {
                title: "Certified Excellence",
                description: "Built on rigorous operational standards guaranteeing customer satisfaction.",
              },
              {
                title: "Dedicated Support",
                description: "Direct access to our customer care team anytime via WhatsApp and phone.",
              },
            ],
          },
        },
        {
          type: "ContactWhatsAppBlock",
          props: {
            id: "contact-1",
            title: `Reach Out to ${businessName}`,
            subtitle: `We are active and ready to assist you. Click below to chat directly with our team.`,
            phoneNumber: "+2348012345678",
            whatsappMessage: `Hello ${businessName}, I would like to make an inquiry.`,
            email: `contact@${businessName.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`,
            location: location || "Lagos, Nigeria",
          },
        },
        {
          type: "FooterBlock",
          props: {
            id: "footer-1",
            copyrightText: `© 2026 ${businessName}. Powered by STARKORA.`,
          },
        },
      ],
      root: {
        props: {
          title: `${businessName} | Official Website`,
        },
      },
    };

    return NextResponse.json({ siteData: fallbackSiteData });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to generate website" },
      { status: 500 }
    );
  }
}