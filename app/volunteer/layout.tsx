import type { ReactNode } from "react";
import type { Metadata } from "next";
import { pageSeo, siteKeywords, breadcrumbJsonLd } from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";

export const metadata: Metadata = pageSeo({
  title: "Volunteer at the Temple",
  description:
    "Volunteer at ISKCON Gambheeram Visakhapatnam — help with festivals, prasadam distribution, Subhojanam and temple services. Register online.",
  path: "/volunteer",
  keywords: ["volunteer ISKCON Vizag", "temple volunteer Visakhapatnam", "seva volunteer", ...siteKeywords],
  image: "/assets/janmashtami-sk1.webp",
});

export default function VolunteerLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Volunteer", path: "/volunteer" }])} />
      {children}
    </>
  );
}
