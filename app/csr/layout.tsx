import type { Metadata } from "next";
import { siteKeywords } from "@/lib/seo";

export const metadata: Metadata = {
  title: {
    absolute: "CSR — ISKCON Vizag | Hare Krishna Movement Visakhapatnam",
  },
  description:
    "Partner with Hare Krishna Movement Visakhapatnam (ISKCON Vizag) for your CSR initiatives — Annadaan food distribution, Subhojanam hospital meals, Gau Seva cow protection, Gita Daan and value education programs. 80G tax exemption available.",
  keywords: [
    "ISKCON Vizag CSR",
    "Hare Krishna Movement Vizag CSR",
    "CSR partner India",
    "Annadaan CSR",
    "Subhojanam hospital meals",
    "Gau Seva",
    "Gita Daan",
    ...siteKeywords,
  ],
  alternates: { canonical: "/csr" },
  openGraph: {
    title: "CSR — ISKCON Vizag | Hare Krishna Movement Visakhapatnam",
    description:
      "Feed the hungry, care for cows, educate children and uplift society. Partner with Hare Krishna Movement Visakhapatnam for Annadaan, Subhojanam, Gau Seva, Gita Daan and value education CSR programs.",
    images: [
      "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1783677363792-1783677363601-462395264797134589073566144398536696847591n.jpg",
    ],
  },
};

export default function CsrLayout({ children }: { children: React.ReactNode }) {
  return children;
}
