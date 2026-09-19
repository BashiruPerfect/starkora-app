import { NextResponse } from "next/server";
import OpenAI from "openai";

// Grant up to 60 seconds execution time for image generation
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const rawKey = (process.env.OPENAI_API_KEY || "").replace(/["']/g, "").trim();

    if (!rawKey) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY is not configured in Vercel Environment Variables." },
        { status: 400 }
      );
    }

    const { prompt, businessName, businessType } = await req.json();

    if (!prompt && !businessType) {
      return NextResponse.json(
        { error: "Please enter a description for the image." },
        { status: 400 }
      );
    }

    const openai = new OpenAI({ apiKey: rawKey });

    const optimizedPrompt = `Professional commercial web photography for ${businessName || "a modern business"}, a ${businessType || "company"}. Context: ${prompt}. Photorealistic, elegant lighting, clean modern aesthetic, 8k resolution, no text, no watermarks.`;

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: optimizedPrompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    const generatedUrl = response.data?.[0]?.url;

    if (!generatedUrl) {
      return NextResponse.json(
        { error: "OpenAI did not return an image URL." },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: generatedUrl });
  } catch (error: any) {
    console.error("AI Image Generation Error:", error);
    return NextResponse.json(
      {
        error:
          error?.message ||
          "Failed to generate image. Ensure your OpenAI account has an active credit balance.",
      },
      { status: 500 }
    );
  }
}