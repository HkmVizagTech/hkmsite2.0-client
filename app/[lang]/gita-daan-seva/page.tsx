import { donationMetadata, donationJsonLd } from "@/lib/donationSeo";
import JsonLd from "@/components/seo/JsonLd";
import SevaCampaignClient from "@/components/seva-campaign/SevaCampaignClient";
import { GITA_DAAN_CAMPAIGN } from "@/lib/sevaCampaignConfig";

import { localized } from "@/lib/i18n/seo";
const baseMetadata = donationMetadata("gita-daan-seva");

export default function GitaDaanSevaPage() {
  return (
    <>
      <JsonLd data={donationJsonLd("gita-daan-seva")} />
      <SevaCampaignClient slug={GITA_DAAN_CAMPAIGN.slug} />
    </>
  );
}

export const generateMetadata = localized(baseMetadata);
