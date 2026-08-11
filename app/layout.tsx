import type { Metadata } from "next";
import { Poppins, Playfair_Display } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import ReduxProvider from "@/components/ReduxProvider";
import MetaPixel from "@/components/MetaPixel";
import ThemeProvider from "@/components/ThemeProvider";


const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://harekrishnavizag.org";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "ISKCON Gambheeram Visakhapatnam | Hare Krishna Movement Vizag",
    template: "%s · ISKCON Gambheeram Visakhapatnam",
  },
  description: "ISKCON Gambheeram Visakhapatnam (Hare Krishna Movement, Gambheeram) — spreading the timeless message of Lord Krishna through devotion, service, and community since 2008. Daily darshan, prasadam, festivals, and spiritual programs in Vizag.",
  keywords: ["ISKCON Gambheeram Visakhapatnam", "ISKCON Vizag", "ISKCON Gambheeram", "Hare Krishna Vizag", "Hare Krishna Movement Visakhapatnam", "Hare Krishna", "ISKCON", "Visakhapatnam", "Temple", "Spiritual", "Krishna", "Prabhupada", "Vaikuntham", "Vizag temple"],
  // NOTE: no sitewide `alternates.canonical` here on purpose. It was
  // previously set to "/" at this root level, which Next.js's metadata
  // merging then applied to EVERY page that didn't explicitly override
  // it — meaning every subpage on the site was telling Google "the
  // homepage is the canonical version of this content," actively
  // suppressing them from ranking independently. Confirmed live across
  // multiple pages before this fix. Canonical is now set per-page
  // instead (see app/page.tsx for the homepage's own).
  openGraph: {
    title: "ISKCON Gambheeram Visakhapatnam | Hare Krishna Movement Vizag",
    description: "ISKCON Gambheeram Visakhapatnam (Hare Krishna Movement, Gambheeram) — daily darshan, prasadam, festivals, and spiritual programs in Vizag since 2008.",
    type: "website",
    locale: "en_IN",
    siteName: "ISKCON Gambheeram Visakhapatnam",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "ISKCON Gambheeram Visakhapatnam | Hare Krishna Movement Vizag",
    description: "Spreading the timeless message of Lord Krishna through devotion, service, and community.",
  },
  robots: { index: true, follow: true },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "HinduTemple",
  name: "ISKCON Gambheeram Visakhapatnam",
  alternateName: [
    "Hare Krishna Movement Visakhapatnam",
    "Hare Krishna Vaikuntham",
    "ISKCON Gambheeram",
    "ISKCON Vizag",
    "Hare Krishna Movement Vizag",
  ],
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
  telephone: "+91 89777 61187",
  email: "social@hkmvizag.org",
  openingHours: "Mo-Su 04:30-20:30",
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is this ISKCON Gambheeram Visakhapatnam?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. This is ISKCON Gambheeram Visakhapatnam, also known as Hare Krishna Movement Vizag, located in Gambheeram, Visakhapatnam. We are a center of the International Society for Krishna Consciousness (ISKCON), serving the community since 2008.",
      },
    },
    {
      "@type": "Question",
      name: "Where is ISKCON Gambheeram Visakhapatnam located?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "ISKCON Gambheeram Visakhapatnam is located at Chaitanya Bhavan, Hare Krishna Vaikuntam Cultural Centre, IIM Road, opposite Akshaya Patra Foundation, Gambhiram, Visakhapatnam, Andhra Pradesh 531163.",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
  <html lang="en" className={`h-full antialiased overflow-x-hidden ${playfair.variable}`} suppressHydrationWarning>
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
      <body className={`${poppins.className} min-h-full flex flex-col overflow-x-hidden pb-[60px] lg:pb-0`}>
        <MetaPixel />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
        <ReduxProvider>
          <ThemeProvider>
            <AuthProvider>
              {children}
              <Toaster />
            </AuthProvider>
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
