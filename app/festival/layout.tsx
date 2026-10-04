import type { ReactNode } from "react";
import { pageSeo, breadcrumbJsonLd } from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";

export const metadata = pageSeo({
  title: "Temple Festivals",
  description: "Celebrate Vaishnava festivals at ISKCON Gambheeram Visakhapatnam — Janmashtami, Radhashtami, Govardhan Puja, Rath Yatra and more. Offer festival seva.",
  path: "/festival",
  image: "/assets/home-event-janmashtami.webp"
});

export default function FestivalLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Festivals", path: "/festival" }])} />
      {children}
    </>
  );
}
