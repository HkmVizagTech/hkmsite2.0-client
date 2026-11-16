import { notFound } from "next/navigation";
import AcharyaView from "@/components/acharyas/AcharyaView";
import JsonLd from "@/components/seo/JsonLd";
import { ACHARYAS, acharyaBySlug, acharyaDescription, acharyaPersonJsonLd, acharyaSeoTitle } from "@/lib/acharyas";
import { pageSeo, SITE_URL } from "@/lib/seo";
import { localizedFn } from "@/lib/i18n/seo";
import { AcharyasProvider } from "@/components/acharyas/data";
import { acharyasIn, lite } from "@/lib/acharyasLocalized";
import { localizedPath } from "@/lib/i18n/routing";
import { isLocale } from "@/lib/i18n/config";

type Props = { params: Promise<{ lang: string; slug: string }> };

export function generateStaticParams() {
  return ACHARYAS.map((a) => ({ slug: a.slug }));
}

async function baseGenerateMetadata({ params }: Props) {
  const { slug, lang } = await params;
  const base = acharyaBySlug(slug);
  if (!base) return {};
  const a = (await acharyasIn(lang)).find((x) => x.slug === slug)!;
  const title = a.seoTitle ?? acharyaSeoTitle(base);
  const seo = pageSeo({
    title,
    description: a.seoDescription ?? acharyaDescription(base),
    path: `/acharyas/${base.slug}`,
    image: base.portrait,
    keywords: [a.name, base.name, a.shortName, `${base.shortName} biography`, `${base.shortName} teachings`, base.category, "Gaudiya Vaishnava acharya", "disciplic succession", "ISKCON Vizag"],
  });
  return { ...seo, title: { absolute: title } };
}

export default async function AcharyaPage({ params }: Props) {
  const { slug, lang } = await params;
  if (!acharyaBySlug(slug)) notFound();
  const list = await acharyasIn(lang);
  const a = list.find((x) => x.slug === slug)!;
  const url = `${SITE_URL}${localizedPath(`/acharyas/${a.slug}`, isLocale(lang) ? lang : "en")}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Acharyas", item: `${SITE_URL}/acharyas` },
          { "@type": "ListItem", position: 3, name: a.name, item: url },
        ],
      },
      { ...acharyaPersonJsonLd(a, SITE_URL), inLanguage: lang },
    ],
  };
  return (
    <>
      <JsonLd data={jsonLd} />
      <AcharyasProvider list={list.map((x) => (x.slug === a.slug ? x : lite(x)))}>
        <AcharyaView a={a} />
      </AcharyasProvider>
    </>
  );
}

export const generateMetadata = localizedFn(baseGenerateMetadata);
