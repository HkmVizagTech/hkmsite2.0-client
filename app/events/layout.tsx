import type { Metadata } from "next";
import { pageSeo, siteKeywords } from "@/lib/seo";

export const metadata: Metadata = pageSeo({
  title: "Events & Festivals | ISKCON Vizag — Hare Krishna Movement Visakhapatnam",
  description:
    "Upcoming events and festivals at ISKCON Visakhapatnam (Hare Krishna Movement, Vizag) — Janmashtami, Ratha Yatra, Ekadashi and community programs at the temple.",
  path: "/events",
  keywords: ["ISKCON Vizag events", "Hare Krishna festival Vizag", "ISKCON festival dates", ...siteKeywords],
});

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return children;
}