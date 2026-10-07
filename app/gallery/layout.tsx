import type { ReactNode } from "react";
import type { Metadata } from "next";
import { pageSeo, siteKeywords, breadcrumbJsonLd } from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";

export const metadata: Metadata = pageSeo({
  title: "Today's Darshan & Temple Photos, Vizag",
  description:
    "Daily darshan photos of Sri Sri Radha Madan Mohan and moments from festivals, seva and community life at ISKCON Gambheeram Visakhapatnam.",
  path: "/gallery",
  keywords: ["ISKCON Vizag gallery", "daily darshan photos", "Radha Madan Mohan darshan", "ISKCON Gambheeram photos", ...siteKeywords],
  image: "/assets/home-gallery-radha-krishna.webp",
});

export default function GalleryLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Gallery", path: "/gallery" }])} />
      {children}
    </>
  );
}
