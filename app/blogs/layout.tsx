import type { ReactNode } from "react";
import type { Metadata } from "next";
import { pageSeo, siteKeywords } from "@/lib/seo";

export const metadata: Metadata = pageSeo({
  title: "Krishna Katha Blog",
  description:
    "Articles on Krishna Katha, festivals, Srila Prabhupada's teachings and Vaishnava wisdom from ISKCON Gambheeram Visakhapatnam.",
  path: "/blogs",
  childTemplate: true,
  keywords: ["ISKCON blog", "Krishna Katha", "Hare Krishna articles", "Vaishnava festivals", ...siteKeywords],
});

export default function BlogsLayout({ children }: { children: ReactNode }) {
  // Breadcrumbs are emitted per page (posts/events have deeper trails).
  return children;
}
