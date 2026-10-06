import type { Metadata } from "next";
import { Poppins, Playfair_Display, Plus_Jakarta_Sans, Noto_Sans_Telugu } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import ReduxProvider from "@/components/ReduxProvider";
import MetaPixel from "@/components/MetaPixel";
import ThemeProvider from "@/components/ThemeProvider";
import BottomNavSpace from "@/components/BottomNavSpace";
import { siteKeywords, ORG_ALT_NAMES, TITLE_TEMPLATE, DEFAULT_OG_IMAGE } from "@/lib/seo";
import { LocaleProvider } from "@/components/i18n/LocaleProvider";
import LanguageToggle from "@/components/i18n/LanguageToggle";
import { getLocale } from "@/lib/i18n/server";


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

// Telugu script (the Latin fonts above have no Telugu glyphs). It sits in
// every font stack as a fallback, so Telugu text picks it up automatically.
const telugu = Noto_Sans_Telugu({
  subsets: ["telugu"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-telugu",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.harekrishnavizag.org";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // Every page title reads "Topic | ISKCON Gambheeram Visakhapatnam";
  // pages pass only their topic (see pageSeo in lib/seo.ts).
  title: {
    default: "ISKCON Gambheeram Visakhapatnam | Hare Krishna Temple, Vizag",
    template: TITLE_TEMPLATE,
  },
  description:
    "ISKCON Gambheeram Visakhapatnam — Hare Krishna temple and Vaikuntham cultural centre in Vizag. Daily darshan, prasadam, festivals and seva since 2008.",
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
    title: "ISKCON Gambheeram Visakhapatnam | Hare Krishna Temple, Vizag",
    description: "ISKCON Gambheeram Visakhapatnam — daily darshan, prasadam, festivals, and spiritual programs in Vizag since 2008.",
    type: "website",
    locale: "en_IN",
    siteName: "ISKCON Gambheeram Visakhapatnam",
    url: SITE_URL,
    images: [{ url: DEFAULT_OG_IMAGE, width: 1280, height: 720, alt: "Hare Krishna Vaikuntham Temple — ISKCON Gambheeram Visakhapatnam" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ISKCON Gambheeram Visakhapatnam | Hare Krishna Temple, Vizag",
    description: "Spreading the timeless message of Lord Krishna through devotion, service, and community.",
    images: [DEFAULT_OG_IMAGE],
  },
  robots: { index: true, follow: true },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "HinduTemple",
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
    streetAddress: "Chaitanya Bhavan, Hare Krishna Vaikuntam Cultural Centre, IIM Rd, opp. Akshaya Patra Foundation, Gambhiram",
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
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"], opens: "04:30", closes: "05:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"], opens: "07:15", closes: "12:20" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"], opens: "16:15", closes: "20:15" },
  ],
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
  alternateName: ["Hare Krishna Movement Vizag", "ISKCON Visakhapatnam"],
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


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  return (
  <html lang={locale} className={`h-full antialiased overflow-x-clip ${playfair.variable} ${poppins.variable} ${jakarta.variable} ${telugu.variable}`} suppressHydrationWarning>
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
        <ReduxProvider>
          <ThemeProvider>
            <AuthProvider>
              <LocaleProvider locale={locale}>
                {children}
                <LanguageToggle />
              </LocaleProvider>
              <Toaster />
            </AuthProvider>
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
