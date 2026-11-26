import type { ReactNode } from "react";
import type { Metadata } from "next";
import { pageSeo, siteKeywords, breadcrumbJsonLd, SITE_URL, ORG_NAME } from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";

import { localized } from "@/lib/i18n/seo";
const OG_IMAGE = "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1795688484987-1795688482809-VolunteerDesktop1920x700.png";

const webPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${SITE_URL}/volunteer#webpage`,
  url: `${SITE_URL}/volunteer`,
  name: "Volunteer at ISKCON Vizag",
  description:
    "Volunteer at the ISKCON temple in Visakhapatnam. Serve at festivals, prasadam distribution and Subhojanam.",
  inLanguage: "en-IN",
  primaryImageOfPage: { "@type": "ImageObject", url: OG_IMAGE, width: 1920, height: 700 },
  isPartOf: { "@type": "WebSite", name: ORG_NAME, url: SITE_URL },
  about: { "@type": "Organization", name: ORG_NAME, url: SITE_URL },
};

const baseMetadata: Metadata = pageSeo({
  title: "Volunteer at ISKCON Vizag",
  description:
    "Volunteer at the ISKCON temple in Visakhapatnam. Serve at festivals, prasadam distribution and Subhojanam. Open to everyone; register in a minute.",
  path: "/volunteer",
  keywords: [
    "volunteer ISKCON Vizag",
    "volunteer in Visakhapatnam",
    "temple volunteer Visakhapatnam",
    "seva opportunities Vizag",
    "register as a volunteer ISKCON",
    "seva volunteer",
    ...siteKeywords,
  ],
  image: OG_IMAGE,
});

export default function VolunteerLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <JsonLd data={webPageJsonLd} />
      <JsonLd data={breadcrumbJsonLd([{ name: "Volunteer", path: "/volunteer" }])} />
      {children}
    </>
  );
}

export const generateMetadata = localized(baseMetadata);
