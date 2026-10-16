import { NextResponse, type NextRequest } from "next/server";
import { LOCALE_COOKIE } from "@/lib/i18n/config";
import { stripLocale } from "@/lib/i18n/routing";

// Language routing. Public pages live under app/[lang]/ and are prerendered
// once per language, so they are served from the CDN cache instead of being
// rendered on every request (which the old cookie-on-the-server approach
// forced on every page).
//
//   /te/x  -> Telugu, as-is (this is the URL Google indexes for Telugu);
//            remembers the choice so links to /y stay in Telugu.
//   /en/x  -> 308 to /x (one English URL, no duplicate).
//   /x     -> rewritten to /en/x, or to /te/x for a visitor who chose Telugu.
//
// Staff tools (/admin, /donations/admin), API proxies and files are skipped.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const prefix = pathname.match(/^\/(en|te)(?=\/|$)/)?.[1];

  if (prefix === "en") {
    const url = request.nextUrl.clone();
    url.pathname = stripLocale(pathname);
    return NextResponse.redirect(url, 308);
  }

  if (prefix === "te") {
    const res = NextResponse.next();
    if (request.cookies.get(LOCALE_COOKIE)?.value !== "te") {
      res.cookies.set(LOCALE_COOKIE, "te", { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
    }
    return res;
  }

  const lang = request.cookies.get(LOCALE_COOKIE)?.value === "te" ? "te" : "en";
  const url = request.nextUrl.clone();
  url.pathname = `/${lang}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    // Everything except API proxies, Next internals, staff tools and files
    // (anything with a dot: /robots.txt, /sitemap.xml, /assets/x.webp …).
    "/((?!api|_next|_vercel|admin|donations/admin|.*\\..*).*)",
  ],
};
