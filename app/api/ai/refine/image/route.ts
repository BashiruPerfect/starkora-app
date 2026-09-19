import { NextResponse } from "next/server";
import OpenAI from "openai";

const rawKey = (process.env.OPENAI_API_KEY || "").replace(/["']/g, "").trim();
const openai = rawKey ? new OpenAI({ apiKey: rawKey }) : null;

export async function POST(req: Request) {
  try {
    const { prompt, businessName, businessType } = await req.json();

    if (!prompt && !businessType) {
      return NextResponse.json(
        { error: "A prompt or business category is required." },
        { status: 400 }
      );
    }

    if (!openai) {
      // High-resolution commercial fallback if OpenAI key is not configured
      const keyword = encodeURIComponent(businessType || prompt || "business");
      return NextResponse.json({
        url: `https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80&sig=${Date.now()}`,
      });
    }

    // Refine prompt for realistic commercial web photography
    const optimizedPrompt = `Professional commercial website photography for ${businessName || "a premier business"}, a ${businessType || "modern company"}. Context: ${prompt}. Photorealistic, high-end 8k resolution, elegant lighting, clean modern aesthetic, no text or watermarks in the image.`;

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: optimizedPrompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    const generatedUrl = response.data?.[0]?.url;

    if (!generatedUrl) {
      throw new Error("No image was returned by the AI engine.");
    }

    return NextResponse.json({ url: generatedUrl });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to generate image" },
      { status: 500 }
    );
  }
}