import type { ReactNode } from "react";
import { pageSeo } from "@/lib/seo";

import { localized } from "@/lib/i18n/seo";
const baseMetadata = pageSeo({
  title: "Track Your Order — Matchless Gifts",
  description: "Track your Matchless Gifts order using your order number or phone number.",
  path: "/track",
  noindex: true
});

export default function TrackLayout({ children }: { children: ReactNode }) {
  return children;
}

export const generateMetadata = localized(baseMetadata);
