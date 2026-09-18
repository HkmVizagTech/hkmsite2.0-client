import type { Metadata } from "next";
import { pageSeo, siteKeywords } from "@/lib/seo";

export const metadata: Metadata = pageSeo({
  title: "Contact ISKCON Visakhapatnam | Hare Krishna Movement Vizag — Address & Timings",
  description:
    "Contact the Hare Krishna Movement Visakhapatnam (ISKCON Gambheeram) temple. Find our address at Hare Krishna Vaikuntham Cultural Centre, darshan timings, phone +91 89777 61187 and directions in Vizag.",
  path: "/contact",
  keywords: [
    "contact ISKCON Vizag",
    "ISKCON Vizag address",
    "Hare Krishna Movement contact",
    "ISKCON temple phone number",
    ...siteKeywords,
  ],
});

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}