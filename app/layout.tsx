import type { Metadata } from "next";
import { Poppins, Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import ReduxProvider from "@/components/ReduxProvider";
import MetaPixel from "@/components/MetaPixel";
import ThemeProvider from "@/components/ThemeProvider";
import BottomNavSpace from "@/components/BottomNavSpace";
import SmoothScroll from "@/components/SmoothScroll";
import PreacherRefCapture from "@/components/PreacherRefCapture";
import KrishnaMoments from "@/components/KrishnaMoments";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { siteKeywords, ORG_ALT_NAMES, TITLE_TEMPLATE, DEFAULT_OG_IMAGE } from "@/lib/seo";
import { TEMPLE, DARSHAN_HOURS, MAPS_URL } from "@/lib/templeInfo";


const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

// Display face for headings: the tight geometric sans the GVD-style layout
// uses for section titles, paired with Poppins for body copy.
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-jakarta",
});

// Indian scripts (the Latin fonts above have no glyphs for them). Stored in the project (app/fonts, the
// Noto Sans variable fonts from Google Fonts, script subset only) so the build never depends on downloading them.
// Each sits in every font stack as a fallback and is fetched only when that script is on the page
// (preload: false + unicode-range), so English visitors never pay for them.
const telugu = localFont({ src: "./fonts/noto-sans-telugu.woff2", weight: "400 700", variable: "--font-telugu", preload: false, display: "swap", declarations: [{ prop: "unicode-range", value: "U+0951-0952, U+0964-0965, U+0B83, U+0C00-0C7F, U+1CD5-1CD6, U+1CD8, U+1CDA, U+1CF2, U+200C-200D, U+25CC" }] });
const devanagari = localFont({ src: "./fonts/noto-sans-deva.woff2", weight: "400 700", variable: "--font-deva", preload: false, display: "swap", declarations: [{ prop: "unicode-range", value: "U+0900-097F, U+1CD0-1CF4, U+1CF7-1CF9, U+200C-200D, U+20A8, U+20B9, U+20F0, U+25CC, U+A830-A839, U+A8E0-A8FF, U+11B00-11B0A" }] });
const tamil = localFont({ src: "./fonts/noto-sans-tamil.woff2", weight: "400 700", variable: "--font-tamil", preload: false, display: "swap", declarations: [{ prop: "unicode-range", value: "U+0964-0965, U+0B82-0BFA, U+200C-200D, U+20B9, U+25CC" }] });
const kannada = localFont({ src: "./fonts/noto-sans-kannada.woff2", weight: "400 700", variable: "--font-kannada", preload: false, display: "swap", declarations: [{ prop: "unicode-range", value: "U+0951-0952, U+0964-0965, U+0B83, U+0C80-0CF3, U+1CD0, U+1CD2-1CD3, U+1CDA, U+1CF2, U+1CF4, U+200C-200D, U+20B9, U+25CC, U+A830-A835" }] });
const malayalam = localFont({ src: "./fonts/noto-sans-malayalam.woff2", weight: "400 700", variable: "--font-malayalam", preload: false, display: "swap", declarations: [{ prop: "unicode-range", value: "U+0307, U+0323, U+0951-0952, U+0964-0965, U+0B83, U+0D00-0D7F, U+1CDA, U+1CF2, U+200C-200D, U+20B9, U+25CC, U+A830-A832" }] });
const oriya = localFont({ src: "./fonts/noto-sans-oriya.woff2", weight: "400 700", variable: "--font-oriya", preload: false, display: "swap", declarations: [{ prop: "unicode-range", value: "U+0951-0952, U+0964-0965, U+0B01-0B77, U+1CDA, U+1CF2, U+200C-200D, U+20B9, U+25CC" }] });
const bengali = localFont({ src: "./fonts/noto-sans-bengali.woff2", weight: "400 700", variable: "--font-bengali", preload: false, display: "swap", declarations: [{ prop: "unicode-range", value: "U+0951-0952, U+0964-0965, U+0980-09FE, U+1CD0, U+1CD2, U+1CD5-1CD6, U+1CD8, U+1CE1, U+1CEA, U+1CED, U+1CF2, U+1CF5-1CF7, U+200C-200D, U+20B9, U+25CC, U+A8F1, U+11DF0-11DF1" }] });
const gujarati = localFont({ src: "./fonts/noto-sans-gujarati.woff2", weight: "400 700", variable: "--font-gujarati", preload: false, display: "swap", declarations: [{ prop: "unicode-range", value: "U+0951-0952, U+0964-0965, U+0A80-0AFF, U+200C-200D, U+20B9, U+25CC, U+A830-A839" }] });

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  // Used on a few display headings, not on the first screen, so it must not compete with the hero image.
  preload: false,
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.harekrishnavizag.org";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // Every page title reads "Topic | ISKCON Gambheeram Visakhapatnam";
  // pages pass only their topic (see pageSeo in lib/seo.ts).
  title: {
    default: "ISKCON Vizag Temple | ISKCON Gambheeram Visakhapatnam",
    template: TITLE_TEMPLATE,
  },
  description:
    "ISKCON temple in Vizag at Gambheeram, Visakhapatnam — the Hare Krishna Vaikuntham temple on IIM Road. Darshan & aarti timings, prasadam, festivals and seva since 2008.",
  keywords: siteKeywords,
  // NOTE: no sitewide `alternates.canonical` here on purpose. It was
  // previously set to "/" at this root level, which Next.js's metadata
  // merging then applied to EVERY page that didn't explicitly override
  // it — meaning every subpage on the site was telling Google "the
  // homepage is the canonical version of this content," actively
  // suppressing them from ranking independently. Confirmed live across
  // multiple pages before this fix. Canonical is now set per-page
  // instead (see app/page.tsx for the homepage's own).
  openGraph: {
    title: "ISKCON Vizag Temple | ISKCON Gambheeram Visakhapatnam",
    description: "ISKCON Gambheeram Visakhapatnam — the Hare Krishna Vaikuntham temple in Vizag. Daily darshan, prasadam, festivals and seva since 2008.",
    type: "website",
    locale: "en_IN",
    siteName: "ISKCON Gambheeram Visakhapatnam",
    url: SITE_URL,
    images: [{ url: DEFAULT_OG_IMAGE, width: 1280, height: 720, alt: "Hare Krishna Vaikuntham Temple — ISKCON Gambheeram Visakhapatnam" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ISKCON Vizag Temple | ISKCON Gambheeram Visakhapatnam",
    description: "The Hare Krishna Vaikuntham temple in Visakhapatnam — darshan, kirtan, prasadam and festivals for everyone.",
    images: [DEFAULT_OG_IMAGE],
  },
  robots: { index: true, follow: true },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  // A temple people visit: HinduTemple (a PlaceOfWorship) + TouristAttraction,
  // so it can surface for "temples in Visakhapatnam"-style searches too.
  "@type": ["HinduTemple", "TouristAttraction"],
  "@id": `${SITE_URL}/#organization`,
  name: "ISKCON Gambheeram Visakhapatnam",
  alternateName: ORG_ALT_NAMES,
  logo: `${SITE_URL}/assets/iskcon-gambheeram-logo.jpeg`,
  image: `${SITE_URL}/assets/vizag-temple-1.jpeg`,
  description: "ISKCON Gambheeram Visakhapatnam, also known as Hare Krishna Movement Vizag, is a center of the International Society for Krishna Consciousness serving the Gambheeram area of Visakhapatnam since 2008.",
  url: SITE_URL,
  foundingDate: "2008",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Door No: 8-22, IIM Rd, near Akshaya Patra Foundation Kitchen, Gambhiram",
    addressLocality: "Visakhapatnam",
    addressRegion: "Andhra Pradesh",
    postalCode: "531163",
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 17.8791762,
    longitude: 83.372373,
  },
  telephone: "+91 89777 61187",
  email: "social@hkmvizag.org",
  // Real opening pattern (three blocks — the deities rest midday), not a
  // single continuous window. Matches /daily-schedule exactly.
  // From lib/templeInfo.ts (same source as the visit guide and schedule).
  openingHoursSpecification: DARSHAN_HOURS.map((h) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    opens: h.opens,
    closes: h.closes,
  })),
  hasMap: MAPS_URL,
  publicAccess: true,
  containedInPlace: { "@type": "City", name: "Visakhapatnam", alternateName: "Vizag" },
  areaServed: [
    { "@type": "City", name: "Visakhapatnam" },
    { "@type": "State", name: "Andhra Pradesh" },
  ],
  knowsAbout: ["Krishna consciousness", "Bhagavad Gita", "Srimad Bhagavatam", "Annadanam", "Gau Seva", "Vaishnava festivals"],
  subjectOf: { "@type": "WebPage", url: `${SITE_URL}/iskcon-vizag-temple`, name: "ISKCON Temple in Vizag: Timings, Address & Darshan" },
  // Links Google's Knowledge Graph entity to our real, active social
  // profiles — a genuine local-SEO signal, distinct from (and in support
  // of) claiming/verifying the actual Google Business Profile listing.
  sameAs: [
    "https://www.facebook.com/hkm.vizag/",
    "https://www.instagram.com/harekrishnavizag/",
    "https://www.youtube.com/user/harekrishnavizag",
    "https://x.com/hkm_vizag",
  ],
};

const webSiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  // Google shows this as the site name in search results.
  name: "ISKCON Gambheeram Visakhapatnam",
  alternateName: ["ISKCON Vizag", "Hare Krishna Movement Vizag", "ISKCON Visakhapatnam"],
  description:
    "Hare Krishna temple, Vaikuntham cultural centre and online devotional store of ISKCON Gambheeram Visakhapatnam.",
  publisher: { "@id": `${SITE_URL}/#organization` },
  inLanguage: "en-IN",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/shop?search={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

// A hint to Google about which pages matter most. Google decides on its own whether to show "sitelinks" under the
// result, so this raises the odds but guarantees nothing.
const KEY_PAGES: [string, string][] = [
  ["Donate Online", "/donate"],
  ["Square Foot Seva", "/sqft-seva-campaign"],
  ["Brick Seva", "/brick-seva-campaign"],
  ["Anna Daan Seva", "/anna-daan-seva"],
  ["Gau Seva", "/gau-seva"],
  ["Kartik Maas Seva", "/kartik-maas"],
  ["Emergency Food Relief", "/emergency-relief"],
  ["Daily Temple Schedule", "/daily-schedule"],
  ["Contact & Visit", "/contact"],
];
const siteNavJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "@id": `${SITE_URL}/#key-pages`,
  itemListElement: KEY_PAGES.map(([name, path], i) => ({
    "@type": "SiteNavigationElement",
    position: i + 1,
    name,
    url: `${SITE_URL}${path}`,
  })),
};

// Static on purpose: nothing here reads cookies or headers, so every public
// page can be prerendered and served from the CDN. The page's language comes
// from app/[lang]/layout.tsx (which also corrects <html lang> for Telugu).
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
  <html lang="en" className={`h-full antialiased overflow-x-clip ${playfair.variable} ${poppins.variable} ${jakarta.variable} ${telugu.variable} ${devanagari.variable} ${tamil.variable} ${kannada.variable} ${malayalam.variable} ${oriya.variable} ${bengali.variable} ${gujarati.variable}`} suppressHydrationWarning>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XVDQNJK24G"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XVDQNJK24G');
          `}
        </Script>
      </head>
      <body className={`${poppins.className} min-h-full flex flex-col overflow-x-clip pb-[var(--bottom-nav-space)]`}>
        <MetaPixel />
        <BottomNavSpace />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteNavJsonLd) }}
        />
        <ReduxProvider>
          <ThemeProvider>
            <AuthProvider>
              <SmoothScroll />
              <PreacherRefCapture />
              <KrishnaMoments />
              {children}
              <Toaster />
              <Analytics />
              <SpeedInsights />
            </AuthProvider>
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
