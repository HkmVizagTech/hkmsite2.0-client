import type { ReactNode } from "react";
import { pageSeo } from "@/lib/seo";

export const metadata = pageSeo({
  title: "My Orders — Matchless Gifts",
  description: "Track your Matchless Gifts orders from ISKCON Gambheeram Visakhapatnam.",
  path: "/shop/orders",
  noindex: true
});

export default function OrdersLayout({ children }: { children: ReactNode }) {
  return children;
}
