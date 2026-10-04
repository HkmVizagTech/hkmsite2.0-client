import EkadashiCampaignClient from "@/components/ekadashi-campaign/EkadashiCampaignClient";
import { fetchEkadashiCampaign, DEFAULT_CAMPAIGN } from "@/lib/ekadashiCampaign";
import { donationMetadata, donationJsonLd } from "@/lib/donationSeo";
import JsonLd from "@/components/seo/JsonLd";

export const revalidate = 0;

// Since /ekadashi is a static route (no dynamic params), runtime metadata
// isn't available — we export a solid generic default and the client
// component syncs the browser title/doc to the admin-configured meta title.
export const metadata = donationMetadata("ekadashi");

export default async function EkadashiPage() {
  const campaign = await fetchEkadashiCampaign();
  return (
    <>
      <JsonLd data={donationJsonLd("ekadashi")} />
      <EkadashiCampaignClient campaign={campaign} />
    </>
  );
}