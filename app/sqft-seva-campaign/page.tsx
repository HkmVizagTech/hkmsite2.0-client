import { Suspense } from "react";
import { donationMetadata, donationJsonLd } from "@/lib/donationSeo";
import JsonLd from "@/components/seo/JsonLd";
import DonationSeoFallback from "@/components/seo/DonationSeoFallback";
import SqftCampaignClient from "./SqftCampaignClient";
import { siteKeywords } from "@/lib/seo";

export const metadata = donationMetadata("sqft-seva-campaign");

export default function SqftSevaCampaignPage() {
  return (
    <>
      <JsonLd data={donationJsonLd("sqft-seva-campaign")} />
      <Suspense fallback={<DonationSeoFallback page="sqft-seva-campaign" />}>
        <SqftCampaignClient />
      </Suspense>
    </>
  );
}
