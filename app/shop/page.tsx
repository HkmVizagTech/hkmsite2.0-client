import type { Metadata } from "next";
import ShopCatalogPageClient from "@/components/shop/ShopCatalogPageClient";
import { SITE_URL, SHOP_NAME, shopKeywords, shopMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  title: { absolute: shopMetadata.title },
  description: shopMetadata.description,
  keywords: shopKeywords,
  alternates: { canonical: "/shop" },
  openGraph: {
    title: shopMetadata.ogTitle,
    description: shopMetadata.ogDescription,
    type: "website",
    locale: "en_IN",
    siteName: `${SHOP_NAME} — Hare Krishna Movement Visakhapatnam`,
    url: `${SITE_URL}/shop`,
  },
  twitter: {
    card: "summary_large_image",
    title: shopMetadata.ogTitle,
    description: shopMetadata.ogDescription,
  },
  robots: { index: true, follow: true },
};

const storeJsonLd = {
  "@context": "https://schema.org",
  "@type": "Store",
  "@id": `${SITE_URL}/shop#store`,
  name: "Matchless Gifts — ISKCON Vizag Shop",
  alternateName: ["Hare Krishna Movement Vizag Shop", "Hare Krishna Movement Visakhapatnam Store", "ISKCON Visakhapatnam Temple Store"],
  url: `${SITE_URL}/shop`,
  description: shopMetadata.description,
  image: "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1789648085166-1789648084187-shop-desk.webp",
  priceRange: "₹",
  currency: "INR",
  paymentAccepted: "Credit Card, Debit Card, UPI, Razorpay",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Chaitanya Bhavan, Hare Krishna Vaikuntam Cultural Centre, IIM Rd, opp. Akshaya Patra Foundation, Gambhiram",
    addressLocality: "Visakhapatnam",
    addressRegion: "Andhra Pradesh",
    postalCode: "531163",
    addressCountry: "IN",
  },
  geo: { "@type": "GeoCoordinates", latitude: 17.8791762, longitude: 83.372373 },
  telephone: "+91 89777 61187",
  email: "social@hkmvizag.org",
  sameAs: [
    "https://www.facebook.com/hkm.vizag/",
    "https://www.instagram.com/harekrishnavizag/",
    "https://www.youtube.com/user/harekrishnavizag",
    "https://x.com/hkm_vizag",
  ],
  department: { "@id": `${SITE_URL}/#organization` },
};

export default function ShopPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(storeJsonLd) }} />
      <ShopCatalogPageClient />
    </>
  );
}