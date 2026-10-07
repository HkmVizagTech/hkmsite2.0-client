import type { ReactNode } from "react";
import type { Metadata } from "next";
import { pageSeo, siteKeywords, breadcrumbJsonLd } from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";

export const metadata: Metadata = pageSeo({
  title: "ISKCON Vizag Darshan & Aarti Timings",
  description:
    "Daily darshan and aarti timings at ISKCON Gambheeram Visakhapatnam — Mangala Aarti 4:30 AM, darshan 7:15 AM–12:20 PM and 4:15 PM–8:15 PM.",
  path: "/daily-schedule",
  keywords: ["ISKCON Vizag darshan timings", "ISKCON Gambheeram temple timings", "aarti timings Visakhapatnam", "temple schedule Vizag", ...siteKeywords],
  image: "/assets/home-gallery-aarti.webp",
});

export default function DailyScheduleLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Daily Schedule", path: "/daily-schedule" }])} />
      {children}
    </>
  );
}
