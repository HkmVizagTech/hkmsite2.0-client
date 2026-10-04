import { Suspense } from "react";
import { donationMetadata, donationJsonLd } from "@/lib/donationSeo";
import JsonLd from "@/components/seo/JsonLd";
import DonationSeoFallback from "@/components/seo/DonationSeoFallback";
import SevaCampaignClient from "@/components/seva-campaign/SevaCampaignClient";
import { GAU_CAMPAIGN } from "@/lib/sevaCampaignConfig";

export const metadata = donationMetadata("gau-seva");

export default function GauSevaPage() {
  return (
    <>
      <JsonLd data={donationJsonLd("gau-seva")} />
      <Suspense fallback={<DonationSeoFallback page="gau-seva" />}>
        <SevaCampaignClient slug={GAU_CAMPAIGN.slug} />
      </Suspense>
    </>
  );
}
