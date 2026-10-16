import { donationMetadata, donationJsonLd } from "@/lib/donationSeo";
import JsonLd from "@/components/seo/JsonLd";
import SqftCampaignClient from "../sqft-seva-campaign/SqftCampaignClient";
import { BRICK_CAMPAIGN } from "@/lib/campaignConfig";
import { siteKeywords } from "@/lib/seo";

import { localized } from "@/lib/i18n/seo";
const baseMetadata = donationMetadata("brick-seva-campaign");

export default function BrickSevaCampaignPage() {
  return (
    <>
      <JsonLd data={donationJsonLd("brick-seva-campaign")} />
      <SqftCampaignClient campaignType="BRICK" />
    </>
  );
}

export const generateMetadata = localized(baseMetadata);
