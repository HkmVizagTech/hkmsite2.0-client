import { donationMetadata, donationJsonLd } from "@/lib/donationSeo";
import JsonLd from "@/components/seo/JsonLd";
import PitruPakshaClient from "@/components/pitru-paksha/PitruPakshaClient";

import { localized } from "@/lib/i18n/seo";
const baseMetadata = donationMetadata("pitru-paksha");

export default function PitruPakshaPage() {
  return (
    <>
      <JsonLd data={donationJsonLd("pitru-paksha")} />
      <PitruPakshaClient />
    </>
  );
}

export const generateMetadata = localized(baseMetadata);
