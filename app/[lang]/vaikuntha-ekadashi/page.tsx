import VaikunthaEkadashiClient from "./VaikunthaEkadashiClient";
import { donationMetadata, donationJsonLd } from "@/lib/donationSeo";
import JsonLd from "@/components/seo/JsonLd";

import { localized } from "@/lib/i18n/seo";
const baseMetadata = donationMetadata("vaikuntha-ekadashi");

export default function VaikunthaEkadashiPage() {
  return (
    <>
      <JsonLd data={donationJsonLd("vaikuntha-ekadashi")} />
      <VaikunthaEkadashiClient />
    </>
  );
}

export const generateMetadata = localized(baseMetadata);
