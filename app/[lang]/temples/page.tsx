import TemplesList, { type TempleCardData } from "@/components/temples/TemplesList";
import JsonLd from "@/components/seo/JsonLd";
import { TEMPLES } from "@/lib/templesData";
import { TEMPLE_PHOTOS } from "@/lib/templePhotos";
import { pageSeo, SITE_URL } from "@/lib/seo";
import { localized } from "@/lib/i18n/seo";

const baseMetadata = pageSeo({
  title: "Hindu Temples in India: Darshan Timings, History & How to Reach",
  description:
    "Your guide to India's sacred temples: darshan and aarti timings, presiding deities, history and how to reach Simhachalam, Tirumala, Annavaram, Ahobilam and more.",
  path: "/temples",
});

export const generateMetadata = localized(baseMetadata);

export default function TemplesPage() {
  const cards: TempleCardData[] = TEMPLES.map((t) => ({
    slug: t.slug, name: t.name, shortName: t.shortName, teluguName: t.teluguName, deity: t.deity, form: t.form,
    town: t.town, state: t.state, district: t.district, region: t.region, summary: t.summary, fromVizag: t.fromVizag,
    photo: TEMPLE_PHOTOS[t.slug]?.[0]?.src,
  }));
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Hindu Temples in India", item: `${SITE_URL}/temples` },
        ],
      },
      {
        "@type": "ItemList",
        name: "Hindu Temples in India",
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
