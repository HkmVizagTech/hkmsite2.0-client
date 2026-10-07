import type { ReactNode } from "react";
import type { Metadata } from "next";
import { pageSeo, siteKeywords, breadcrumbJsonLd } from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";

export const metadata: Metadata = pageSeo({
  title: "About Our Temple — Hare Krishna Vaikuntham, Vizag",
  description:
    "About ISKCON Gambheeram Visakhapatnam (Hare Krishna Vaikuntham, Hare Krishna Movement Vizag): our history, Srila Prabhupada's mission and our seva in Vizag since 2008.",
  path: "/about",
  keywords: ["about ISKCON Gambheeram Visakhapatnam", "ISKCON Visakhapatnam history", "Hare Krishna Movement Vizag", ...siteKeywords],
  image: "/assets/vizag-temple-4.jpeg",
});

export default function AboutLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "About Us", path: "/about" }])} />
      {children}
    </>
  );
}
