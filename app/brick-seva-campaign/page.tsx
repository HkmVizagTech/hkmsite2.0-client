import { Suspense } from "react";
import { donationMetadata, donationJsonLd } from "@/lib/donationSeo";
import JsonLd from "@/components/seo/JsonLd";
import DonationSeoFallback from "@/components/seo/DonationSeoFallback";
import SqftCampaignClient from "../sqft-seva-campaign/SqftCampaignClient";
import { BRICK_CAMPAIGN } from "@/lib/campaignConfig";
import { siteKeywords } from "@/lib/seo";

export const metadata = donationMetadata("brick-seva-campaign");

export default function BrickSevaCampaignPage() {
  return (
    <>
      <JsonLd data={donationJsonLd("brick-seva-campaign")} />
      <Suspense fallback={<DonationSeoFallback page="brick-seva-campaign" />}>
        <SqftCampaignClient campaignType="BRICK" />
      </Suspense>
    </>
  );
}
