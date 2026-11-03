import type { ReactNode } from "react";
import type { Metadata } from "next";
import { pageSeo, siteKeywords, breadcrumbJsonLd, SITE_URL } from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";

import { localized } from "@/lib/i18n/seo";
const baseMetadata: Metadata = pageSeo({
  title: "Srila Prabhupada",
  description:
    "The life and teachings of His Divine Grace A.C. Bhaktivedanta Swami Srila Prabhupada, founder-acharya of ISKCON, who inspires ISKCON Gambheeram Visakhapatnam.",
  path: "/founder",
  keywords: ["Srila Prabhupada", "founder acharya ISKCON", "A.C. Bhaktivedanta Swami Prabhupada biography", ...siteKeywords],
  image: "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1793324889281-1793324889228-prabhupada-home.avif",
});

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "A.C. Bhaktivedanta Swami Prabhupada",
  alternateName: "Srila Prabhupada",
  jobTitle: "Founder-Acharya of the International Society for Krishna Consciousness (ISKCON)",
  birthDate: "1896-09-01",
  birthPlace: "Calcutta, India",
  deathDate: "1977-11-14",
  deathPlace: "Vrindavan, India",
  image: "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1793324889281-1793324889228-prabhupada-home.avif",
  url: `${SITE_URL}/founder`,
};

export default function FounderLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <JsonLd data={personJsonLd} />
      <JsonLd data={breadcrumbJsonLd([{ name: "Srila Prabhupada", path: "/founder" }])} />
      {children}
    </>
  );
}

export const generateMetadata = localized(baseMetadata);
