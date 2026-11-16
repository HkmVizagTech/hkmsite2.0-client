import TemplesList, { type TempleCardData } from "@/components/temples/TemplesList";
import JsonLd from "@/components/seo/JsonLd";
import { TEMPLES } from "@/lib/templesData";
import { getPlace, placePhotoUrl } from "@/lib/places";
import { pageSeo, SITE_URL } from "@/lib/seo";
import { localized } from "@/lib/i18n/seo";

// Google rating / first photo per temple refresh daily (see lib/places.ts)
export const revalidate = 86400;

const baseMetadata = pageSeo({
  title: "Vaishnava Temples of Andhra Pradesh: Timings, History & How to Reach",
  description:
    "A pilgrimage guide to the Vishnu temples of Andhra Pradesh, from Simhachalam near Vizag to Tirumala, Annavaram and Ahobilam: darshan timings, history and directions.",
  path: "/temples",
});

export const generateMetadata = localized(baseMetadata);

export default async function TemplesPage() {
  const places = await Promise.all(TEMPLES.map((t) => getPlace(t.placeQuery)));
  const cards: TempleCardData[] = TEMPLES.map((t, i) => ({
    slug: t.slug, name: t.name, shortName: t.shortName, teluguName: t.teluguName, deity: t.deity, form: t.form,
    town: t.town, district: t.district, region: t.region, summary: t.summary, fromVizag: t.fromVizag,
    photo: places[i]?.photos[0] ? placePhotoUrl(places[i]!.photos[0].name, 800) : undefined,
    rating: places[i]?.rating,
    ratingCount: places[i]?.ratingCount,
  }));
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Vaishnava Temples of Andhra Pradesh", item: `${SITE_URL}/temples` },
        ],
      },
      {
        "@type": "ItemList",
        name: "Vaishnava Temples of Andhra Pradesh",
        itemListElement: TEMPLES.map((t, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE_URL}/temples/${t.slug}`, name: t.name })),
      },
    ],
  };
  return (
    <>
      <JsonLd data={jsonLd} />
      <TemplesList temples={cards} />
    </>
  );
}
