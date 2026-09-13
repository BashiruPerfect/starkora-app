import { NextResponse } from "next/server";
import dns from "dns/promises";

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    if (!query) {
      return NextResponse.json({ error: "Domain query is required." }, { status: 400 });
    }

    // Sanitize input
    const cleanQuery = query
      .toLowerCase()
      .replace(/^(?:https?:\/\/)?/i, "")
      .replace(/\/.*$/, "")
      .replace(/\s+/g, "")
      .trim();

    // Strip existing TLD if user typed one
    const baseName = cleanQuery.split(".")[0];

    const tlds = [
      { extension: ".com", type: "global", retailPrice: 10 },
      { extension: ".ng", type: "nigerian", retailPrice: 15 },
      { extension: ".com.ng", type: "nigerian_local", retailPrice: 5 },
    ];

    const checkResults = await Promise.all(
      tlds.map(async (tld) => {
        const fullDomain = `${baseName}${tld.extension}`;
        let isAvailable = false;

        try {
          // Perform DNS NS record lookup
          const records = await dns.resolveNs(fullDomain);
          // If records exist, the domain is already registered
          isAvailable = records.length === 0;
        } catch (err: any) {
          // ENOTFOUND or ENODATA typically indicates the domain is not registered
          if (err.code === "ENOTFOUND" || err.code === "ENODATA" || err.code === "ESERVFAIL") {
            isAvailable = true;
          } else {
            isAvailable = false;
          }
        }

        return {
          domain: fullDomain,
          extension: tld.extension,
          available: isAvailable,
          priceUSD: tld.retailPrice,
          priceNGN: tld.retailPrice * 1500,
        };
      })
    );

    return NextResponse.json({ query: baseName, results: checkResults });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to query domain availability." },
      { status: 500 }
    );
  }
}