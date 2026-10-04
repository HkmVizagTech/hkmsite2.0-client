import type { ReactNode } from "react";
import { pageSeo } from "@/lib/seo";

export const metadata = pageSeo({
  title: "Checkout — Matchless Gifts",
  description: "Complete your Matchless Gifts order from ISKCON Gambheeram Visakhapatnam.",
  path: "/shop/checkout",
  noindex: true
});

export default function CheckoutLayout({ children }: { children: ReactNode }) {
  return children;
}
