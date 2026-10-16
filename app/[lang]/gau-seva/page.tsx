import { donationMetadata, donationJsonLd } from "@/lib/donationSeo";
import JsonLd from "@/components/seo/JsonLd";
import SevaCampaignClient from "@/components/seva-campaign/SevaCampaignClient";
import { GAU_CAMPAIGN } from "@/lib/sevaCampaignConfig";

import { localized } from "@/lib/i18n/seo";
const baseMetadata = donationMetadata("gau-seva");

export default function GauSevaPage() {
  return (
    <>
      <JsonLd data={donationJsonLd("gau-seva")} />
      <SevaCampaignClient slug={GAU_CAMPAIGN.slug} />
    </>
  );
}

export const generateMetadata = localized(baseMetadata);
