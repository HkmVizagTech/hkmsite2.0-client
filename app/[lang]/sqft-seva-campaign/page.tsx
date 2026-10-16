import { donationMetadata, donationJsonLd } from "@/lib/donationSeo";
import JsonLd from "@/components/seo/JsonLd";
import SqftCampaignClient from "./SqftCampaignClient";
import { siteKeywords } from "@/lib/seo";

import { localized } from "@/lib/i18n/seo";
const baseMetadata = donationMetadata("sqft-seva-campaign");

export default function SqftSevaCampaignPage() {
  return (
    <>
      <JsonLd data={donationJsonLd("sqft-seva-campaign")} />
      <SqftCampaignClient />
    </>
  );
}

export const generateMetadata = localized(baseMetadata);
