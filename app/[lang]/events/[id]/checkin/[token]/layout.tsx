import type { Metadata } from "next";

import { localized } from "@/lib/i18n/seo";
// Personal check-in links (one per registration) must never be indexed.
const baseMetadata: Metadata = {
  title: "Event Check-in",
  robots: { index: false, follow: false },
};

export default function CheckinLayout({ children }: { children: React.ReactNode }) {
  return children;
}

export const generateMetadata = localized(baseMetadata);
