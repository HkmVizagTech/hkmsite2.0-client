import type { ReactNode } from "react";
import type { Metadata } from "next";
import { pageSeo, siteKeywords, breadcrumbJsonLd } from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";

export const metadata: Metadata = pageSeo({
  title: "CSR Partnership",
  description:
    "Partner with ISKCON Gambheeram Visakhapatnam on CSR: Subhojanam hospital meals, Annadaan, Gau Seva, Gita Daan and value education. 80G available.",
  path: "/csr",
  keywords: ["ISKCON Vizag CSR", "CSR partner Visakhapatnam", "Annadaan CSR", "Subhojanam hospital meals CSR", ...siteKeywords],
  image: "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1783677363792-1783677363601-462395264797134589073566144398536696847591n.jpg",
});

export default function CsrLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "CSR Partnership", path: "/csr" }])} />
      {children}
    </>
  );
}
