import type { ReactNode } from "react";
import { pageSeo } from "@/lib/seo";

import { localized } from "@/lib/i18n/seo";
const baseMetadata = pageSeo({
  title: "Checkout — Matchless Gifts",
  description: "Complete your Matchless Gifts order from ISKCON Gambheeram Visakhapatnam.",
  path: "/shop/checkout",
  noindex: true
});

export default function CheckoutLayout({ children }: { children: ReactNode }) {
  return children;
}

export const generateMetadata = localized(baseMetadata);
