import type { ReactNode } from "react";
import type { Metadata } from "next";
import { pageSeo, siteKeywords, breadcrumbJsonLd } from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";

export const metadata: Metadata = pageSeo({
  title: "Vaishnava Calendar 2026",
  description:
    "Ekadashi dates, festivals and appearance days for 2026 from the Gaudiya Vaishnava calendar, from ISKCON Gambheeram Visakhapatnam.",
  path: "/vaishnav-calendar",
  keywords: ["Vaishnava calendar 2026", "Ekadashi dates 2026", "ISKCON calendar 2026", "Hindu festival dates 2026", ...siteKeywords],
});

export default function VaishnavCalendarLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Vaishnava Calendar", path: "/vaishnav-calendar" }])} />
      {children}
    </>
  );
}
