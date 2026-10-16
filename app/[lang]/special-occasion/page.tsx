import SpecialOccasionClient from "./SpecialOccasionClient";
import { donationMetadata, donationJsonLd } from "@/lib/donationSeo";
import JsonLd from "@/components/seo/JsonLd";

import { localized } from "@/lib/i18n/seo";
const baseMetadata = donationMetadata("special-occasion");

export default function SpecialOccasionPage() {
  return (
    <>
      <JsonLd data={donationJsonLd("special-occasion")} />
      <SpecialOccasionClient />
    </>
  );
}

export const generateMetadata = localized(baseMetadata);
