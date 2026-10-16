import type { ReactNode } from "react";
import type { Metadata } from "next";
import { pageSeo, siteKeywords, breadcrumbJsonLd } from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";

import { localized } from "@/lib/i18n/seo";
const baseMetadata: Metadata = pageSeo({
  title: "Temple Address & Directions, Vizag",
  description:
    "Visit ISKCON Gambheeram Visakhapatnam at Door No 8-22, IIM Road, near Akshaya Patra Kitchen, Gambhiram, Vizag 531163. Call +91 89777 61187 · darshan from 4:30 AM.",
  path: "/contact",
  keywords: ["ISKCON Gambheeram Visakhapatnam address", "ISKCON Vizag contact", "ISKCON temple phone number Vizag", "Hare Krishna temple Gambheeram directions", ...siteKeywords],
});

export default function ContactLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Contact Us", path: "/contact" }])} />
      {children}
    </>
  );
}

export const generateMetadata = localized(baseMetadata);
