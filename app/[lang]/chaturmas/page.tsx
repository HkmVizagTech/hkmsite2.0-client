import ChaturmasClient from "./ChaturmasClient";
import { donationMetadata, donationJsonLd } from "@/lib/donationSeo";
import JsonLd from "@/components/seo/JsonLd";

import { localized } from "@/lib/i18n/seo";
const baseMetadata = donationMetadata("chaturmas");

export default function ChaturmasPage() {
  return (
    <>
      <JsonLd data={donationJsonLd("chaturmas")} />
      <ChaturmasClient />
    </>
  );
}

export const generateMetadata = localized(baseMetadata);
