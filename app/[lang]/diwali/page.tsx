import DiwaliClient from "./DiwaliClient";
import { donationMetadata, donationJsonLd } from "@/lib/donationSeo";
import JsonLd from "@/components/seo/JsonLd";

import { localized } from "@/lib/i18n/seo";
const baseMetadata = donationMetadata("diwali");

export default function DiwaliPage() {
  return (
    <>
      <JsonLd data={donationJsonLd("diwali")} />
      <DiwaliClient />
    </>
  );
}

export const generateMetadata = localized(baseMetadata);
