import type { Metadata } from "next";
import { Poppins, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import ReduxProvider from "@/components/ReduxProvider";


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
    default: "ISKCON Visakhapatnam | Hare Krishna Movement Vizag",
    template: "%s · ISKCON Visakhapatnam",
  },
  description: "ISKCON Visakhapatnam (Hare Krishna Movement, Gambheeram) — spreading the timeless message of Lord Krishna through devotion, service, and community since 2008. Daily darshan, prasadam, festivals, and spiritual programs in Vizag.",
  keywords: ["ISKCON Visakhapatnam", "ISKCON Vizag", "ISKCON Gambheeram", "Hare Krishna Vizag", "Hare Krishna Movement Visakhapatnam", "Hare Krishna", "ISKCON", "Visakhapatnam", "Temple", "Spiritual", "Krishna", "Prabhupada", "Vaikuntham", "Vizag temple"],
  alternates: { canonical: "/" },
  openGraph: {
    title: "ISKCON Visakhapatnam | Hare Krishna Movement Vizag",
    description: "ISKCON Visakhapatnam (Hare Krishna Movement, Gambheeram) — daily darshan, prasadam, festivals, and spiritual programs in Vizag since 2008.",
    type: "website",
    locale: "en_IN",
    siteName: "ISKCON Visakhapatnam",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "ISKCON Visakhapatnam | Hare Krishna Movement Vizag",
    description: "Spreading the timeless message of Lord Krishna through devotion, service, and community.",
  },
  robots: { index: true, follow: true },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "HinduTemple",
  name: "ISKCON Visakhapatnam",
  alternateName: [
    "Hare Krishna Movement Visakhapatnam",
    "Hare Krishna Vaikuntham",
    "ISKCON Gambheeram",
    "ISKCON Vizag",
    "Hare Krishna Movement Vizag",
  ],
  description: "ISKCON Visakhapatnam, also known as Hare Krishna Movement Vizag, is a center of the International Society for Krishna Consciousness serving the Gambheeram area of Visakhapatnam since 2008.",
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
  telephone: "+91 96666 11108",
  email: "info.vizag@hkm-group.org",
  openingHours: "Mo-Su 04:30-20:30",
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is this ISKCON Visakhapatnam?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. This is ISKCON Visakhapatnam, also known as Hare Krishna Movement Vizag, located in Gambheeram, Visakhapatnam. We are a center of the International Society for Krishna Consciousness (ISKCON), serving the community since 2008.",
      },
    },
    {
      "@type": "Question",
      name: "Where is ISKCON Visakhapatnam located?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "ISKCON Visakhapatnam is located at Chaitanya Bhavan, Hare Krishna Vaikuntam Cultural Centre, IIM Road, opposite Akshaya Patra Foundation, Gambhiram, Visakhapatnam, Andhra Pradesh 531163.",
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
  <html lang="en" className={`h-full antialiased ${playfair.variable}`} suppressHydrationWarning>
      <body className={`${poppins.className} min-h-full flex flex-col`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
        <ReduxProvider>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
