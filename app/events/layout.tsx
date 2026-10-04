import type { ReactNode } from "react";
import type { Metadata } from "next";
import { pageSeo, siteKeywords } from "@/lib/seo";

export const metadata: Metadata = pageSeo({
  title: "Events & Programs",
  description:
    "Upcoming festivals, programs and events at ISKCON Gambheeram Visakhapatnam — register online and join the celebrations in Vizag.",
  path: "/events",
  childTemplate: true,
  keywords: ["ISKCON Vizag events", "Hare Krishna programs Visakhapatnam", "temple events Vizag", ...siteKeywords],
  image: "/assets/home-event-janmashtami.webp",
});

export default function EventsLayout({ children }: { children: ReactNode }) {
  // Breadcrumbs are emitted per page (posts/events have deeper trails).
  return children;
}
