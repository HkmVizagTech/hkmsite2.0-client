// Central SEO copy for the whole site. Every page-level metadata block,
// sitemap and JSON-LD nodes resolve from here so the phrasing (and the
// location-agnostic "Hare Krishna Movement / ISKCON" coverage the site is
// chasing) stays consistent instead of drifting per page.

import type { Metadata } from "next";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.harekrishnavizag.org";

export const ORG_NAME = "ISKCON Gambheeram Visakhapatnam";
export const SHOP_NAME = "Matchless Gifts";

export const ORG_ALT_NAMES = [
  "Hare Krishna Movement Visakhapatnam",
  "Hare Krishna Movement Vizag",
  "Hare Krishna Vaikuntham Cultural Centre",
  "Hare Krishna Vaikuntham Temple",
  "ISKCON Vizag",
  "ISKCON Visakhapatnam",
  "Hare Krishna Temple Visakhapatnam",
];

// Broad, location-agnostic + Vizag variants. The <meta keywords> tag is
// largely decorative to Google, but Bing and others still read it, and
// keeping every page honest with the same core vocabulary is harmless.
export const siteKeywords = [
  "ISKCON",
  "ISKCON Vizag",
  "ISKCON Visakhapatnam",
  "ISKCON Gambheeram Visakhapatnam",
  "Hare Krishna Movement",
  "Hare Krishna Movement Vizag",
  "Hare Krishna Movement Visakhapatnam",
  "Hare Krishna temple Vizag",
  "Hare Krishna Vaikuntham Cultural Centre",
  "Hare Krishna Vaikuntham Temple",
  "Krishna temple Visakhapatnam",
  "Hare Krishna",
  "Krishna",
  "Prabhupada",
  "Vaikuntham",
  "Visakhapatnam",
  "Gambheeram",
  "Annadanam",
  "Gau Seva",
  "Gita Daan",
  "Temple seva",
];

export const shopKeywords = [
  "ISKCON Vizag shop",
  "ISKCON Vizag online store",
  "Hare Krishna Vizag shop",
  "Hare Krishna Movement Vizag shop",
  "Hare Krishna Movement Visakhapatnam store",
  "ISKCON online shop",
  "Hare Krishna temple shop",
  "temple gift store",
  "Bhagavad Gita online",
  "puja items online",
  "japa mala",
  "devotional gifts",
];

export const shopMetadata = {
  title: "ISKCON Vizag Shop — Matchless Gifts | Hare Krishna Movement Online Store",
  description:
    "Shop the ISKCON Vizag temple store (Hare Krishna Movement, Visakhapatnam). Bhagavad Gita As It Is and Srila Prabhupada's books, puja essentials, japa malas, murtis and devotional gifts — every purchase funds temple sevas, annadanam and Go-seva.",
  ogTitle: "ISKCON Vizag Shop — Matchless Gifts",
  ogDescription:
    "The devotional store of the Hare Krishna Movement Visakhapatnam — books, puja items and sacred gifts, with every purchase supporting the temple's sevas.",
};

// Brand shown after every page title (via the root layout's title template)
// and in social cards. Pages pass only their topic, e.g. "Darshan & Aarti
// Timings" → "Darshan & Aarti Timings | ISKCON Gambheeram Visakhapatnam".
export const BRAND = ORG_NAME;
export const TITLE_TEMPLATE = `%s | ${BRAND}`;
export const withBrand = (topic: string) => `${topic} | ${BRAND}`;

// Default social-share image (the Hare Krishna Vaikuntham temple).
export const DEFAULT_OG_IMAGE = "/assets/vizag-temple-1.jpeg";

export const absUrl = (u: string) => (/^https?:\/\//.test(u) ? u : `${SITE_URL}${u.startsWith("/") ? "" : "/"}${u}`);

/**
 * Consistent per-page metadata: topic title (the brand is appended by the
 * root template), description (keep ≤155 chars), canonical, Open Graph and
 * Twitter cards with an image. `noindex` is for private / transactional
 * pages (checkout, donor area, thank-you pages).
 */
export function pageSeo(page: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  image?: string;
  noindex?: boolean;
  /** Canonical override (e.g. a duplicate campaign page pointing at the main one). */
  canonical?: string;
  /**
   * Set on a layout whose child pages define their own titles (blogs,
   * events): Next applies only the nearest parent's title template, so the
   * layout must pass the brand template on.
   */
  childTemplate?: boolean;
}): Metadata {
  const image = absUrl(page.image || DEFAULT_OG_IMAGE);
  const full = withBrand(page.title);
  return {
    title: page.childTemplate ? { default: page.title, template: TITLE_TEMPLATE } : page.title,
    description: page.description,
    keywords: page.keywords || siteKeywords,
    alternates: { canonical: page.canonical || page.path },
    openGraph: {
      title: full,
      description: page.description,
      type: "website",
      locale: "en_IN",
      siteName: ORG_NAME,
      url: `${SITE_URL}${page.path}`,
      images: [{ url: image, alt: full }],
    },
    twitter: { card: "summary_large_image", title: full, description: page.description, images: [image] },
    robots: page.noindex ? { index: false, follow: true } : { index: true, follow: true },
  };
}

/** schema.org BreadcrumbList for a page (Home is added automatically). */
export function breadcrumbJsonLd(trail: { name: string; path: string }[]) {
  const items = [{ name: "Home", path: "/" }, ...trail];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${SITE_URL}${it.path}`,
    })),
  };
}

/**
 * Remove a trailing brand an editor may have typed into a title
 * ("Indira Ekadashi · ISKCON Vizag", "… | Hare Krishna Movement Vizag") so
 * the root template doesn't append the brand a second time.
 */
export function stripBrand(title: string): string {
  return title
    .replace(/\s*[|·—–-]\s*(ISKCON|Hare Krishna|HKM)[^|·—–]*$/i, "")
    .trim();
}

/** Trim a description to ≤160 chars on a word boundary. */
export function clampDescription(text: string | undefined | null, max = 160): string {
  const t = (text || "").replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ") > 80 ? cut.lastIndexOf(" ") : cut.length).replace(/[,;:.\s]+$/, "")}…`;
}
