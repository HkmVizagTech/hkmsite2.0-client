import { donationMetadata, donationJsonLd, faqJsonLd } from "@/lib/donationSeo";
import JsonLd from "@/components/seo/JsonLd";
import SevaCampaignClient from "@/components/seva-campaign/SevaCampaignClient";
import { ANNA_DAAN_CAMPAIGN } from "@/lib/sevaCampaignConfig";

import { localized } from "@/lib/i18n/seo";
const baseMetadata = donationMetadata("anna-daan-seva");

export default function AnnaDaanSevaPage() {
  return (
    <>
      <JsonLd data={donationJsonLd("anna-daan-seva")} />
      <JsonLd data={faqJsonLd(ANNA_DAAN_CAMPAIGN.faqs)} />
      <SevaCampaignClient slug={ANNA_DAAN_CAMPAIGN.slug} />
    </>
  );
}

export const generateMetadata = localized(baseMetadata);
