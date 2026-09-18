import type { Metadata } from "next";
import { pageSeo, siteKeywords } from "@/lib/seo";

export const metadata: Metadata = pageSeo({
  title: "Srila Prabhupada — Founder-Acharya of ISKCON | Hare Krishna Movement Visakhapatnam",
  description:
    "The life and teachings of A.C. Bhaktivedanta Swami Prabhupada, founder-acharya of ISKCON and the Hare Krishna Movement, honoured at ISKCON Visakhapatnam.",
  path: "/founder",
  keywords: ["Srila Prabhupada", "ISKCON founder", "Bhaktivedanta Swami", "Hare Krishna Movement", ...siteKeywords],
});

export default function FounderLayout({ children }: { children: React.ReactNode }) {
  return children;
}