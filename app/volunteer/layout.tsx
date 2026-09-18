import type { Metadata } from "next";
import { pageSeo, siteKeywords } from "@/lib/seo";

export const metadata: Metadata = pageSeo({
  title: "Volunteer at ISKCON Vizag | Hare Krishna Movement Visakhapatnam",
  description:
    "Join the seva of the Hare Krishna Movement Visakhapatnam (ISKCON Vizag) — volunteer for temple programs, festivals and community service.",
  path: "/volunteer",
  keywords: ["volunteer ISKCON Vizag", "ISKCON seva", "temple volunteer Visakhapatnam", ...siteKeywords],
});

export default function VolunteerLayout({ children }: { children: React.ReactNode }) {
  return children;
}