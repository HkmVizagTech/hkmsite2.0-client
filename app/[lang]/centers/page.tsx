import type { Metadata } from "next";
import PageLayout from "@/components/PageLayout";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Home } from "lucide-react";
import JsonLd from "@/components/seo/JsonLd";
import CentersExplorer from "@/components/centers/CentersExplorer";
import { pageSeo, siteKeywords, breadcrumbJsonLd, SITE_URL } from "@/lib/seo";
import { CENTERS } from "@/lib/centers";

import { localized } from "@/lib/i18n/seo";

const PATH = "/centers";

// Header artwork. It carries its own title, so no overlay or text sits on it.
const HEADER_IMAGE =
  "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1793693661448-1793693661152-harekrishnabanner1920x730.png";
const HEADER_RATIO = 1920 / 730;

const baseMetadata: Metadata = pageSeo({
  title: "Our Centers: Hare Krishna Movement Temples in India & Abroad",
  description:
    "Hare Krishna Movement temples and centres across India and abroad: Bengaluru, Jaipur, Hyderabad, Pune, Mumbai and more. Addresses, darshan timings and contacts.",
  path: PATH,
  keywords: ["Hare Krishna Movement centers", "Hare Krishna temples India", "ISKCON centers", "Hare Krishna Mandir near me", ...siteKeywords],
});

export const generateMetadata = localized(baseMetadata);

export default function CentersPage() {
  const listJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Hare Krishna Movement centres",
    itemListElement: CENTERS.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      url: `${SITE_URL}/centers/${c.slug}`,
    })),
  };

  return (
    <PageLayout>
      <JsonLd data={breadcrumbJsonLd([{ name: "Our Centers", path: PATH }])} />
      <JsonLd data={listJsonLd} />
      <main className="bg-white pt-[var(--header-h)]">
        <section className="bg-gradient-to-b from-vk-50 to-white pb-8 pt-6">
          <div className="vk-container">
            <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-1.5 text-xs font-medium text-ink/55">
              <Link href="/" className="inline-flex items-center gap-1 hover:text-vk-700">
                <Home className="h-3.5 w-3.5" /> Home
              </Link>
              <ChevronRight className="h-3.5 w-3.5 opacity-60" />
              <span className="text-ink" aria-current="page">
                Our Centers
              </span>
            </nav>
            <div style={{ aspectRatio: HEADER_RATIO }} className="relative w-full overflow-hidden rounded-2xl shadow-[0_24px_60px_-28px_rgba(10,18,51,0.5)] md:rounded-3xl">
              <Image src={HEADER_IMAGE} alt="Hare Krishna Temples Worldwide" fill priority sizes="(min-width: 1280px) 1200px, 100vw" className="object-cover" />
            </div>
            <div className="mt-6 max-w-3xl">
              <h1 className="text-2xl font-bold tracking-tight text-ink md:text-3xl">Our Centers</h1>
              <p className="mt-2 text-ink/65">
                Temples and centres of the Hare Krishna Movement across India and abroad, each welcoming visitors for darshan, kirtan and prasadam.
              </p>
            </div>
          </div>
        </section>
        <section className="vk-section">
          <div className="vk-container">
            <p className="mb-8 max-w-3xl text-ink/70">
              Every centre follows Srila Prabhupada&apos;s teachings and is run independently. Choose a centre to see its deities, address, timings and how to reach.
            </p>
            <CentersExplorer />
            <p className="mt-10 text-center text-xs text-ink/45">
              Details are compiled from public listings. Please confirm timings with the centre before you travel.
            </p>
          </div>
        </section>
      </main>
    </PageLayout>
  );
}
