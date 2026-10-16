import type { ReactNode } from "react";
import { pageSeo } from "@/lib/seo";

import { localized } from "@/lib/i18n/seo";
const baseMetadata = pageSeo({
  title: "Donor Portal",
  description: "View your donations and receipts with ISKCON Gambheeram Visakhapatnam.",
  path: "/donor/login",
  noindex: true
});

export default function DonorLayout({ children }: { children: ReactNode }) {
  return children;
}

export const generateMetadata = localized(baseMetadata);
