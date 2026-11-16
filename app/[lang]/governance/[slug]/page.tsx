import { notFound } from "next/navigation";
import MemberView from "@/components/governance/MemberView";
import JsonLd from "@/components/seo/JsonLd";
import { COUNCIL, councilDescription, councilMember, councilPersonJsonLd } from "@/lib/governance";
import { pageSeo, SITE_URL } from "@/lib/seo";
import { localizedFn } from "@/lib/i18n/seo";

type Props = { params: Promise<{ lang: string; slug: string }> };

export function generateStaticParams() {
  return COUNCIL.map((m) => ({ slug: m.slug }));
}

async function baseGenerateMetadata({ params }: Props) {
  const { slug } = await params;
  const m = councilMember(slug);
  if (!m) return {};
  return pageSeo({
    title: `${m.name}: ${m.roles[0]}`,
    description: councilDescription(m),
    path: `/governance/${m.slug}`,
    image: m.image,
  });
}

export default async function MemberPage({ params }: Props) {
  const { slug } = await params;
  const m = councilMember(slug);
  if (!m) notFound();
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Governance", item: `${SITE_URL}/governance` },
          { "@type": "ListItem", position: 3, name: m.name, item: `${SITE_URL}/governance/${m.slug}` },
        ],
      },
      councilPersonJsonLd(m, SITE_URL),
    ],
  };
  return (
    <>
      <JsonLd data={jsonLd} />
      <MemberView m={m} />
    </>
  );
}

export const generateMetadata = localizedFn(baseGenerateMetadata);
