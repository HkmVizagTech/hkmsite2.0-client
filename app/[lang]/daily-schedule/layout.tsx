import type { ReactNode } from "react";
import type { Metadata } from "next";
import { pageSeo, siteKeywords, breadcrumbJsonLd } from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";

import { localized } from "@/lib/i18n/seo";
const baseMetadata: Metadata = pageSeo({
  title: "ISKCON Vizag Darshan & Aarti Timings",
  description:
    "Daily darshan and aarti timings at ISKCON Gambheeram Visakhapatnam — Mangala Aarti 4:30 AM, darshan 7:15 AM–12:20 PM and 4:15 PM–8:15 PM.",
  path: "/daily-schedule",
  keywords: ["ISKCON Vizag darshan timings", "ISKCON Gambheeram temple timings", "aarti timings Visakhapatnam", "temple schedule Vizag", ...siteKeywords],
  image: "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1795608007880-1795608006993-DailyScheduleDesktopFull1920x700.png",
});

export default function DailyScheduleLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Daily Schedule", path: "/daily-schedule" }])} />
      {children}
    </>
  );
}

export const generateMetadata = localized(baseMetadata);
