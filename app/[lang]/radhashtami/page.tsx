import { donationMetadata, donationJsonLd } from "@/lib/donationSeo";
import JsonLd from "@/components/seo/JsonLd";
import RadhashtamiClient from "@/components/radhashtami/RadhashtamiClient";

import { localized } from "@/lib/i18n/seo";
const baseMetadata = donationMetadata("radhashtami");

export default function RadhashtamiPage() {
  return (
    <>
      <JsonLd data={donationJsonLd("radhashtami")} />
      <RadhashtamiClient />
    </>
  );
}

export const generateMetadata = localized(baseMetadata);
