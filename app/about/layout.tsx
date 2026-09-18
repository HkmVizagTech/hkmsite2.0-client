import type { Metadata } from "next";
import { pageSeo, siteKeywords } from "@/lib/seo";

export const metadata: Metadata = pageSeo({
  title: "About ISKCON Vizag | Hare Krishna Movement Visakhapatnam",
  description:
    "About ISKCON Visakhapatnam (Hare Krishna Movement, Gambheeram, Vizag) — our history, founder-acharya Srila Prabhupada, and our mission of service to Lord Krishna since 2008.",
  path: "/about",
  keywords: ["about ISKCON Vizag", "Hare Krishna Movement history", "ISKCON Gambheeram", ...siteKeywords],
});

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}