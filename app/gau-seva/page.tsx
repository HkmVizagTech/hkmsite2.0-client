import { donationMetadata, donationJsonLd } from "@/lib/donationSeo";
import JsonLd from "@/components/seo/JsonLd";
import SevaCampaignClient from "@/components/seva-campaign/SevaCampaignClient";
import { GAU_CAMPAIGN } from "@/lib/sevaCampaignConfig";

export const metadata = donationMetadata("gau-seva");

export default function GauSevaPage() {
  return (
    <>
      <JsonLd data={donationJsonLd("gau-seva")} />
      <SevaCampaignClient slug={GAU_CAMPAIGN.slug} />
    </>
  );
}
