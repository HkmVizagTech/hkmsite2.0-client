import SqftCampaignClient from "../sqft-seva-campaign/SqftCampaignClient";
import { BRICK_CAMPAIGN } from "@/lib/campaignConfig";

export const metadata = {
  title: BRICK_CAMPAIGN.metaTitle,
  description: BRICK_CAMPAIGN.metaDesc,
  openGraph: {
    title: BRICK_CAMPAIGN.ogTitle,
    description: BRICK_CAMPAIGN.ogDesc,
    images: [BRICK_CAMPAIGN.ogImage],
  },
};

export default function BrickSevaCampaignPage() {
  return <SqftCampaignClient campaignType="BRICK" />;
}
