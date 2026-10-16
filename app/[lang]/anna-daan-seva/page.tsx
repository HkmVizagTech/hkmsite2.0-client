import { donationMetadata, donationJsonLd } from "@/lib/donationSeo";
import JsonLd from "@/components/seo/JsonLd";
import SevaCampaignClient from "@/components/seva-campaign/SevaCampaignClient";
import { ANNA_DAAN_CAMPAIGN } from "@/lib/sevaCampaignConfig";

import { localized } from "@/lib/i18n/seo";
const baseMetadata = donationMetadata("anna-daan-seva");

export default function AnnaDaanSevaPage() {
  return (
    <>
      <JsonLd data={donationJsonLd("anna-daan-seva")} />
      <SevaCampaignClient slug={ANNA_DAAN_CAMPAIGN.slug} />
    </>
  );
}

export const generateMetadata = localized(baseMetadata);
