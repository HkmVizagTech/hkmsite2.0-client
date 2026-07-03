import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import ReduxProvider from "@/components/ReduxProvider";


const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://hkmsite2-0-client-9fyg.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Hare Krishna Movement Visakhapatnam",
    template: "%s · Hare Krishna Movement Visakhapatnam",
  },
  description: "Spreading the timeless message of Lord Krishna through devotion, service, and community. Experience divine darshan, prasadam, and spiritual programs.",
  keywords: ["Hare Krishna", "ISKCON", "Visakhapatnam", "Temple", "Spiritual", "Krishna", "Prabhupada", "Vaikuntham", "Vizag temple"],
  alternates: { canonical: "/" },
  openGraph: {
    title: "Hare Krishna Movement Visakhapatnam",
    description: "Spreading the timeless message of Lord Krishna through devotion, service, and community.",
    type: "website",
    locale: "en_IN",
    siteName: "Hare Krishna Movement Vizag",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "Hare Krishna Movement Visakhapatnam",
    description: "Spreading the timeless message of Lord Krishna through devotion, service, and community.",
  },
  robots: { index: true, follow: true },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "HinduTemple",
  name: "Hare Krishna Movement Visakhapatnam",
  alternateName: "Hare Krishna Vaikuntham",
  url: SITE_URL,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Hare Krishna Marg",
    addressLocality: "Visakhapatnam",
    addressRegion: "Andhra Pradesh",
    postalCode: "530003",
    addressCountry: "IN",
  },
  telephone: "+91 98765 43210",
  email: "info@harekrishnavizag.org",
  openingHours: "Mo-Su 04:30-20:30",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
  <html lang="en" className={`h-full antialiased`} suppressHydrationWarning>
      <body className={`${poppins.className} min-h-full flex flex-col`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
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
