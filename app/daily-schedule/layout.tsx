import type { Metadata } from "next";
import { pageSeo, siteKeywords } from "@/lib/seo";

export const metadata: Metadata = pageSeo({
  title: "Temple Schedule & Darshan Timings | ISKCON Vizag — Hare Krishna Movement",
  description:
    "Daily temple schedule and darshan timings at ISKCON Visakhapatnam (Hare Krishna Vaikuntham Cultural Centre, Gambheeram) — morning and evening programs, aarti timings and prasadam.",
  path: "/daily-schedule",
  keywords: [
    "ISKCON Vizag darshan timings",
    "ISKCON temple schedule",
    "Hare Krishna temple timings Vizag",
    "temple aarti timing Visakhapatnam",
    ...siteKeywords,
  ],
});

export default function DailyScheduleLayout({ children }: { children: React.ReactNode }) {
  return children;
}