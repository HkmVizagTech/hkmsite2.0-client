import VijayadashamiClient from "./VijayadashamiClient";
import { donationMetadata, donationJsonLd } from "@/lib/donationSeo";
import JsonLd from "@/components/seo/JsonLd";

import { localized } from "@/lib/i18n/seo";
const baseMetadata = donationMetadata("vijayadashami");

export default function VijayadashamiPage() {
  return (
    <>
      <JsonLd data={donationJsonLd("vijayadashami")} />
      <VijayadashamiClient />
    </>
  );
}

export const generateMetadata = localized(baseMetadata);
