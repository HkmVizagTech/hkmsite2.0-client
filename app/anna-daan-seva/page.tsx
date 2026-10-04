import { Suspense } from "react";
import { donationMetadata, donationJsonLd } from "@/lib/donationSeo";
import JsonLd from "@/components/seo/JsonLd";
import DonationSeoFallback from "@/components/seo/DonationSeoFallback";
import SevaCampaignClient from "@/components/seva-campaign/SevaCampaignClient";
import { ANNA_DAAN_CAMPAIGN } from "@/lib/sevaCampaignConfig";

export const metadata = donationMetadata("anna-daan-seva");

export default function AnnaDaanSevaPage() {
  return (
    <>
      <JsonLd data={donationJsonLd("anna-daan-seva")} />
      <Suspense fallback={<DonationSeoFallback page="anna-daan-seva" />}>
        <SevaCampaignClient slug={ANNA_DAAN_CAMPAIGN.slug} />
      </Suspense>
    </>
  );
}
