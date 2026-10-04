import type { ReactNode } from "react";
import type { Metadata } from "next";
import { pageSeo, siteKeywords, breadcrumbJsonLd } from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";

export const metadata: Metadata = pageSeo({
  title: "Srila Prabhupada",
  description:
    "The life and teachings of His Divine Grace A.C. Bhaktivedanta Swami Srila Prabhupada, founder-acharya of ISKCON, who inspires ISKCON Gambheeram Visakhapatnam.",
  path: "/founder",
  keywords: ["Srila Prabhupada", "founder acharya ISKCON", "A.C. Bhaktivedanta Swami Prabhupada biography", ...siteKeywords],
  image: "https://res.cloudinary.com/ddmzeqpkc/image/upload/prabhupada_home",
});

export default function FounderLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Srila Prabhupada", path: "/founder" }])} />
      {children}
    </>
  );
}
