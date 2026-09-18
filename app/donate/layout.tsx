import type { Metadata } from "next";
import { pageSeo, siteKeywords, shopKeywords } from "@/lib/seo";

export const metadata: Metadata = pageSeo({
  title: "Donate to ISKCON Vizag | Hare Krishna Movement Visakhapatnam — Donations & Seva",
  description:
    "Donate online to the Hare Krishna Movement Visakhapatnam (ISKCON, Gambheeram, Vizag). Support annadanam, Gau Seva cow protection, Gita distribution, temple construction and daily temple sevas — with 80G tax exemption.",
  path: "/donate",
  keywords: [
    "Donate ISKCON Vizag",
    "donate to hare krishna temple",
    "ISKCON donation",
    "Hare Krishna Movement donation",
    "temple donation Vizag",
    "annadanam donation",
    ...siteKeywords,
    ...shopKeywords,
  ],
});

export default function DonateLayout({ children }: { children: React.ReactNode }) {
  return children;
}