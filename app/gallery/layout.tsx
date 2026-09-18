import type { Metadata } from "next";
import { pageSeo, siteKeywords } from "@/lib/seo";

export const metadata: Metadata = pageSeo({
  title: "Gallery — ISKCON Vizag Temple Photos | Hare Krishna Movement Visakhapatnam",
  description:
    "Photos from ISKCON Visakhapatnam (Hare Krishna Movement, Vizag) — the deities, festivals, temple programs and community seva at Hare Krishna Vaikuntham Cultural Centre.",
  path: "/gallery",
  keywords: ["ISKCON Vizag photos", "Hare Krishna temple photos", "ISKCON temple pictures", ...siteKeywords],
});

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return children;
}