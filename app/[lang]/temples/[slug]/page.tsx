import { notFound } from "next/navigation";
import TempleView from "@/components/temples/TempleView";
import type { TempleCardData } from "@/components/temples/TemplesList";
import JsonLd from "@/components/seo/JsonLd";
import { TEMPLES } from "@/lib/templesData";
import { getPlace, mapsSearchUrl, placePhotoUrl } from "@/lib/places";
import { pageSeo, SITE_URL } from "@/lib/seo";
import { localizedFn } from "@/lib/i18n/seo";

type Props = { params: Promise<{ lang: string; slug: string }> };

// Google details (rating, hours, photos, reviews) refresh daily (see lib/places.ts)
export const revalidate = 86400;

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
  const place = await getPlace(tm.placeQuery);
  const directions = place?.mapsUri ?? mapsSearchUrl(tm.placeQuery);

  // up to 3 other temples in the same region (fallback: any), with their first Google photo
  const others = TEMPLES.filter((t) => t.slug !== tm.slug);
  const same = others.filter((t) => t.region === tm.region);
  const pick = [...same, ...others.filter((t) => t.region !== tm.region)].slice(0, 3);
  const pickPlaces = await Promise.all(pick.map((t) => getPlace(t.placeQuery)));
  const nearby: TempleCardData[] = pick.map((t, i) => ({
    slug: t.slug, name: t.name, shortName: t.shortName, teluguName: t.teluguName, deity: t.deity, form: t.form,
    town: t.town, district: t.district, region: t.region, summary: t.summary, fromVizag: t.fromVizag,
    photo: pickPlaces[i]?.photos[0] ? placePhotoUrl(pickPlaces[i]!.photos[0].name, 300) : undefined,
  }));

  const url = `${SITE_URL}/temples/${tm.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Vaishnava Temples of Andhra Pradesh", item: `${SITE_URL}/temples` },
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
        address: { "@type": "PostalAddress", streetAddress: tm.address, addressLocality: tm.town, addressRegion: "Andhra Pradesh", addressCountry: "IN" },
        ...(place?.lat && place?.lng ? { geo: { "@type": "GeoCoordinates", latitude: place.lat, longitude: place.lng } } : {}),
        ...(place?.mapsUri ? { hasMap: place.mapsUri } : {}),
        ...(tm.website ? { sameAs: [tm.website] } : {}),
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
      <TempleView temple={tm} place={place} directions={directions} nearby={nearby} />
    </>
  );
}
