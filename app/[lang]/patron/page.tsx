import JsonLd from "@/components/seo/JsonLd";
import PatronClient from "@/components/patron/PatronClient";
import { pageSeo, breadcrumbJsonLd, absUrl, SITE_URL, ORG_NAME } from "@/lib/seo";
import { localized } from "@/lib/i18n/seo";

const baseMetadata = pageSeo({
  title: "Become a Patron of Hare Krishna Vaikuntham Temple, Vizag",
  description:
    "Become a patron of the Hare Krishna Vaikuntham temple at Gambheeram, Visakhapatnam. Get your family name inscribed in the temple, special blessings and a place in the Hall of Devotional Fame.",
  path: "/patron",
  keywords: [
    "become a patron ISKCON Vizag",
    "temple patron Visakhapatnam",
    "Hare Krishna Vaikuntham patron",
    "donate temple construction Vizag",
    "ISKCON Gambheeram patron",
    "Hall of Devotional Fame",
  ],
});

const pageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Become a Patron — Empower a Legacy of Devotion",
  url: `${SITE_URL}/patron`,
  description: baseMetadata.description,
  primaryImageOfPage: absUrl("/assets/vizag-temple-1.jpeg"),
  isPartOf: { "@type": "WebSite", name: ORG_NAME, url: SITE_URL },
  about: { "@type": "Place", name: "Hare Krishna Vaikuntham Cultural Centre, Gambheeram, Visakhapatnam" },
};

export default function PatronPage() {
  return (
    <>
      <JsonLd data={pageJsonLd} />
      <JsonLd data={breadcrumbJsonLd([{ name: "Become a Patron", path: "/patron" }])} />
      <PatronClient />
    </>
  );
}

export const generateMetadata = localized(baseMetadata);
