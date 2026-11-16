import GovernanceView from "@/components/governance/GovernanceView";
import JsonLd from "@/components/seo/JsonLd";
import { COUNCIL, councilPersonJsonLd } from "@/lib/governance";
import { pageSeo, SITE_URL } from "@/lib/seo";
import { localized } from "@/lib/i18n/seo";

const baseMetadata = pageSeo({
  title: "Governance: Governing Council of the Hare Krishna Movement",
  description:
    "Meet the Governing Council of the Hare Krishna Movement, the senior devotees who guide its temples, Akshaya Patra and seva across India, including ISKCON Gambheeram Visakhapatnam.",
  path: "/governance",
});

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Governance", item: `${SITE_URL}/governance` },
      ],
    },
    {
      "@type": "ItemList",
      name: "Governing Council of the Hare Krishna Movement",
      itemListElement: COUNCIL.map((m, i) => ({ "@type": "ListItem", position: i + 1, item: councilPersonJsonLd(m, SITE_URL) })),
    },
  ],
};

export default function GovernancePage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <GovernanceView />
    </>
  );
}

export const generateMetadata = localized(baseMetadata);
