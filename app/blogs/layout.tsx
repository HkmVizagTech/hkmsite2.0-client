import type { Metadata } from "next";
import { pageSeo, siteKeywords } from "@/lib/seo";

export const metadata: Metadata = pageSeo({
  title: "Blog — ISKCON Vizag | Hare Krishna Movement Visakhapatnam Articles",
  description:
    "Articles and updates from the Hare Krishna Movement Visakhapatnam (ISKCON Vizag) — Bhagavad Gita wisdom, festival stories, temple news and devotional life.",
  path: "/blogs",
  keywords: ["ISKCON Vizag blog", "Hare Krishna articles", "Bhagavad Gita wisdom", ...siteKeywords],
});

export default function BlogsLayout({ children }: { children: React.ReactNode }) {
  return children;
}