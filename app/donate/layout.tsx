import type { ReactNode } from "react";
import type { Metadata } from "next";
import { pageSeo, siteKeywords, breadcrumbJsonLd } from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";

export const metadata: Metadata = pageSeo({
  title: "Donate to the Temple",
  description:
    "Donate online to ISKCON Gambheeram Visakhapatnam — Annadanam, Gau Seva, Gita Daan, temple construction and festival sevas. 80G tax benefit.",
  path: "/donate",
  keywords: ["donate ISKCON Gambheeram Visakhapatnam", "ISKCON Vizag donation", "temple donation Vizag", "annadanam donation", "80G donation", ...siteKeywords],
  image: "https://res.cloudinary.com/ddmzeqpkc/image/upload/f_auto,q_auto/phase_1",
});

export default function DonateLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Donate", path: "/donate" }])} />
      {children}
    </>
  );
}
