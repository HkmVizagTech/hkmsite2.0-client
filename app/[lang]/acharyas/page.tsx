import AcharyasView from "@/components/acharyas/AcharyasView";
import JsonLd from "@/components/seo/JsonLd";
import { ACHARYAS, ACHARYAS_PAINTING, acharyaPersonJsonLd } from "@/lib/acharyas";
import { pageSeo, SITE_URL } from "@/lib/seo";
import { localized } from "@/lib/i18n/seo";

const baseMetadata = pageSeo({
  title: "Our Acharyas: The Disciplic Succession (Guru Parampara)",
  description:
    "The spiritual teachers through whom the teachings of Lord Chaitanya have come down to us, from the Six Goswamis of Vrindavan to Srila Prabhupada: their lives, teachings, books and pastimes.",
  path: "/acharyas",
  image: ACHARYAS_PAINTING,
  keywords: ["acharyas", "guru parampara", "disciplic succession", "Gaudiya Vaishnava acharyas", "Six Goswamis", "Srila Prabhupada", "Bhaktisiddhanta Sarasvati Thakura", "Bhaktivinoda Thakura", "ISKCON Vizag"],
});

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Acharyas", item: `${SITE_URL}/acharyas` },
      ],
    },
    {
      "@type": "ItemList",
      name: "Acharyas of the Brahma-Madhva-Gaudiya Sampradaya",
      numberOfItems: ACHARYAS.length,
      itemListElement: ACHARYAS.map((a, i) => ({ "@type": "ListItem", position: i + 1, item: acharyaPersonJsonLd(a, SITE_URL) })),
    },
  ],
};

export default function AcharyasPage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <AcharyasView />
    </>
  );
}

export const generateMetadata = localized(baseMetadata);
