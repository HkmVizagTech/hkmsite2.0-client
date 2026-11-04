import type { ReactNode } from "react";
import type { Metadata } from "next";
import { pageSeo, siteKeywords } from "@/lib/seo";

import { localized } from "@/lib/i18n/seo";
const baseMetadata: Metadata = pageSeo({
  title: "Blog: Krishna Katha, Festivals, Ekadashi & Vaishnava Wisdom",
  description:
    "Read Krishna Katha, the meaning of Hindu festivals, Ekadashi dates and fasting rules, Bhagavad Gita wisdom and Srila Prabhupada's teachings from ISKCON Gambheeram, Visakhapatnam.",
  path: "/blogs",
  childTemplate: true,
  keywords: ["ISKCON blog", "Krishna Katha", "Hare Krishna articles", "Vaishnava festivals", ...siteKeywords],
});

export default function BlogsLayout({ children }: { children: ReactNode }) {
  // Breadcrumbs are emitted per page (posts/events have deeper trails).
  return children;
}

export const generateMetadata = localized(baseMetadata);
