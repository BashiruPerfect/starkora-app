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

  // 1. Root and internal platform routes: Let them pass directly
  const isInternalHost =
    host === "localhost" ||
    host === "127.0.0.1" ||
    host === "starkora.com" ||
    host === "app.starkora.com";

  if (isInternalHost) {
    // If accessing the root on localhost/starkora.com, continue as normal
    return NextResponse.next();
  }

  // 2. Subdomain extraction for starkora.com (e.g., clientbrand.starkora.com)
  if (host.endsWith(".starkora.com")) {
    const subdomain = host.replace(".starkora.com", "");
    return NextResponse.rewrite(new URL(`/live/${subdomain}${url.pathname}`, req.url));
  }

  // 3. Custom Domains (e.g., mybrand.ng or clientbrand.com)
  // Rewrite directly to the live tenant resolver
  return NextResponse.rewrite(new URL(`/live/${host}${url.pathname}`, req.url));
}