import type { ReactNode } from "react";
import { donationMetadata, donationJsonLd } from "@/lib/donationSeo";
import JsonLd from "@/components/seo/JsonLd";

// /subhojanam's page is a client component, so its metadata and
// structured data live here.
export const metadata = donationMetadata("subhojanam");

export default function SubhojanamLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <JsonLd data={donationJsonLd("subhojanam")} />
      {children}
    </>
  );
}
