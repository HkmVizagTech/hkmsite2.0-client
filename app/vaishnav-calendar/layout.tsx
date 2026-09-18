import type { Metadata } from "next";
import { pageSeo, siteKeywords } from "@/lib/seo";

export const metadata: Metadata = pageSeo({
  title: "Vaishnava Calendar — Ekadashi & Festival Dates | ISKCON Vizag",
  description:
    "The Vaishnava calendar with Ekadashi dates and festival days for the Hare Krishna Movement Visakhapatnam (ISKCON Vizag, Hare Krishna Vaikuntham Temple).",
  path: "/vaishnav-calendar",
  keywords: ["Ekadashi dates", "Vaishnava calendar", "ISKCON festival calendar", ...siteKeywords],
});

export default function VaishnavCalendarLayout({ children }: { children: React.ReactNode }) {
  return children;
}