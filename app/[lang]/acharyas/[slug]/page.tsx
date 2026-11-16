import { notFound } from "next/navigation";
import AcharyaView from "@/components/acharyas/AcharyaView";
import JsonLd from "@/components/seo/JsonLd";
import { ACHARYAS, acharyaBySlug, acharyaDescription, acharyaPersonJsonLd, acharyaSeoTitle } from "@/lib/acharyas";
import { pageSeo, SITE_URL } from "@/lib/seo";
import { localizedFn } from "@/lib/i18n/seo";

type Props = { params: Promise<{ lang: string; slug: string }> };

export function generateStaticParams() {
  return ACHARYAS.map((a) => ({ slug: a.slug }));
}

async function baseGenerateMetadata({ params }: Props) {
  const { slug } = await params;
  const a = acharyaBySlug(slug);
  if (!a) return {};
  const seo = pageSeo({
    title: acharyaSeoTitle(a),
    description: acharyaDescription(a),
    path: `/acharyas/${a.slug}`,
    image: a.portrait,
    keywords: [a.name, a.shortName, `${a.shortName} biography`, `${a.shortName} teachings`, a.category, "Gaudiya Vaishnava acharya", "disciplic succession", "ISKCON Vizag"],
  });
  return { ...seo, title: { absolute: acharyaSeoTitle(a) } };
}

export default async function AcharyaPage({ params }: Props) {
  const { slug } = await params;
  const a = acharyaBySlug(slug);
  if (!a) notFound();
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Acharyas", item: `${SITE_URL}/acharyas` },
          { "@type": "ListItem", position: 3, name: a.name, item: `${SITE_URL}/acharyas/${a.slug}` },
        ],
      },
      acharyaPersonJsonLd(a, SITE_URL),
    ],
  };
  return (
    <>
      <JsonLd data={jsonLd} />
      <AcharyaView a={a} />
    </>
  );
}

export const generateMetadata = localizedFn(baseGenerateMetadata);
