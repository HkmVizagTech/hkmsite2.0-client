import { notFound } from "next/navigation";
import TempleView from "@/components/temples/TempleView";
import type { TempleCardData } from "@/components/temples/TemplesList";
import JsonLd from "@/components/seo/JsonLd";
import { TEMPLES } from "@/lib/templesData";
import { TEMPLE_PHOTOS } from "@/lib/templePhotos";
import { pageSeo, SITE_URL } from "@/lib/seo";
import { localizedFn } from "@/lib/i18n/seo";

type Props = { params: Promise<{ lang: string; slug: string }> };

export function generateStaticParams() {
  return TEMPLES.map((t) => ({ slug: t.slug }));
}

const find = (slug: string) => TEMPLES.find((t) => t.slug === slug);

async function baseGenerateMetadata({ params }: Props) {
  const { slug } = await params;
  const tm = find(slug);
  if (!tm) return {};
  return pageSeo({
    title: `${tm.shortName} Temple Timings, History & How to Reach`,
    description: tm.summary,
    path: `/temples/${tm.slug}`,
  });
}

export const generateMetadata = localizedFn(baseGenerateMetadata);

export default async function TemplePage({ params }: Props) {
  const { slug } = await params;
  const tm = find(slug);
  if (!tm) notFound();

  // up to 3 other temples in the same region (fallback: any), with their first Google photo
  const others = TEMPLES.filter((t) => t.slug !== tm.slug);
  const same = others.filter((t) => t.region === tm.region);
  const pick = [...same, ...others.filter((t) => t.region !== tm.region)].slice(0, 3);
  const nearby: TempleCardData[] = pick.map((t) => ({
    slug: t.slug, name: t.name, shortName: t.shortName, teluguName: t.teluguName, deity: t.deity, form: t.form,
    town: t.town, state: t.state, district: t.district, region: t.region, summary: t.summary, fromVizag: t.fromVizag,
    photo: TEMPLE_PHOTOS[t.slug]?.[0]?.src,
  }));

  const url = `${SITE_URL}/temples/${tm.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Hindu Temples in India", item: `${SITE_URL}/temples` },
          { "@type": "ListItem", position: 3, name: tm.shortName, item: url },
        ],
      },
      {
        "@type": "HinduTemple",
        "@id": `${url}#temple`,
        name: tm.name,
        alternateName: tm.teluguName,
        description: tm.summary,
        url,
        address: { "@type": "PostalAddress", streetAddress: tm.address, addressLocality: tm.town, addressRegion: tm.state, addressCountry: "IN" },
        hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(tm.placeQuery)}`,
        ...(tm.website ? { sameAs: [tm.website] } : {}),
        ...(TEMPLE_PHOTOS[tm.slug]?.length ? { image: TEMPLE_PHOTOS[tm.slug].map((p) => p.src) } : {}),
        isAccessibleForFree: true,
        publicAccess: true,
      },
      {
        "@type": "FAQPage",
        mainEntity: tm.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      },
    ],
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <TempleView temple={tm} photos={TEMPLE_PHOTOS[tm.slug] ?? []} nearby={nearby} />
    </>
  );
}
