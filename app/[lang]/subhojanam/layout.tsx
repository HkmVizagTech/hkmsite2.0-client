import type { ReactNode } from "react";
import { donationMetadata, donationJsonLd } from "@/lib/donationSeo";
import JsonLd from "@/components/seo/JsonLd";

import { localized } from "@/lib/i18n/seo";
// /subhojanam's page is a client component, so its metadata and
// structured data live here.
const baseMetadata = donationMetadata("subhojanam");

export default function SubhojanamLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <JsonLd data={donationJsonLd("subhojanam")} />
      {children}
    </>
  );
}

export const generateMetadata = localized(baseMetadata);
