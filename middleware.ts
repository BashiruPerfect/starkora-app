import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, images, and public assets
     */
    "/((?!api/|_next/|_static/|[\\w-]+\\.\\w+).*)",
  ],
};

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get("x-forwarded-host") || req.headers.get("host") || "";
  const host = hostname.split(":")[0].toLowerCase();

  // 1. Root platform hosts: serve main app directly
  const isInternalHost =
    host === "localhost" ||
    host === "127.0.0.1" ||
    host === "starkora.website" ||
    host === "www.starkora.website" ||
    host === "starkora.com" ||
    host === "www.starkora.com" ||
    host.endsWith(".vercel.app");

  if (isInternalHost) {
    return NextResponse.next();
  }

  // 2. Tenant Subdomains under your primary domain (e.g., brand.starkora.website)
  if (host.endsWith(".starkora.website")) {
    const subdomain = host.replace(".starkora.website", "");
    return NextResponse.rewrite(new URL(`/live/${subdomain}${url.pathname}`, req.url));
  }

  // Fallback for legacy .com if ever pointed
  if (host.endsWith(".starkora.com")) {
    const subdomain = host.replace(".starkora.com", "");
    return NextResponse.rewrite(new URL(`/live/${subdomain}${url.pathname}`, req.url));
  }

  // 3. Pro Tier Custom Domains (e.g., clientbrand.ng or clientbrand.com)
  return NextResponse.rewrite(new URL(`/live/${host}${url.pathname}`, req.url));
}