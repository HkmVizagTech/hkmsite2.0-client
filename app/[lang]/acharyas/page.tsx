import AcharyasView from "@/components/acharyas/AcharyasView";
import JsonLd from "@/components/seo/JsonLd";
import { ACHARYAS_PAINTING, acharyaPersonJsonLd } from "@/lib/acharyas";
import { pageSeo, SITE_URL } from "@/lib/seo";
import { localized } from "@/lib/i18n/seo";
import { AcharyasProvider } from "@/components/acharyas/data";
import { acharyasIn, lite } from "@/lib/acharyasLocalized";
import { localizedPath } from "@/lib/i18n/routing";
import { isLocale } from "@/lib/i18n/config";

const seo = pageSeo({
  title: "Acharyas of the Gaudiya Vaishnava Parampara",
  description:
    "Meet the 20 acharyas of the Gaudiya Vaishnava parampara, from the Six Goswamis to Srila Prabhupada: their lives, teachings, books and lineage.",
  path: "/acharyas",
  image: ACHARYAS_PAINTING,
  keywords: ["acharyas", "guru parampara", "disciplic succession", "Gaudiya Vaishnava acharyas", "Six Goswamis", "Srila Prabhupada", "Bhaktisiddhanta Sarasvati Thakura", "Bhaktivinoda Thakura", "ISKCON Vizag"],
});
// 58 characters: an absolute title, so the long brand suffix is not added
const baseMetadata = { ...seo, title: { absolute: "Acharyas of the Gaudiya Vaishnava Parampara | ISKCON Vizag" } };

export default async function AcharyasPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const list = await acharyasIn(lang);
  const url = `${SITE_URL}${localizedPath("/acharyas", isLocale(lang) ? lang : "en")}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Acharyas", item: url },
        ],
      },
      {
        "@type": "ItemList",
        name: "Acharyas of the Brahma-Madhva-Gaudiya Sampradaya",
        inLanguage: lang,
        numberOfItems: list.length,
        itemListElement: list.map((a, i) => ({ "@type": "ListItem", position: i + 1, item: acharyaPersonJsonLd(a, SITE_URL, false) })),
      },
    ],
  };
  return (
    <>
      <JsonLd data={jsonLd} />
      <AcharyasProvider list={list.map(lite)}>
        <AcharyasView />
      </AcharyasProvider>
    </>
  );
}

export const generateMetadata = localized(baseMetadata);
