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

// Consistent per-page metadata — title/description/canonical/OG in one shape.
export function pageSeo(page: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
}): Metadata {
  return {
    title: { absolute: page.title },
    description: page.description,
    keywords: page.keywords || siteKeywords,
    alternates: { canonical: page.path },
    openGraph: {
      title: page.title,
      description: page.description,
      type: "website",
      locale: "en_IN",
      siteName: ORG_NAME,
      url: `${SITE_URL}${page.path}`,
    },
    robots: { index: true, follow: true },
  };
}