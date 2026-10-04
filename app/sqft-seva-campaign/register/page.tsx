import CampaignerRegisterClient from "@/components/campaign/CampaignerRegisterClient";
import { pageSeo } from "@/lib/seo";

export const metadata = pageSeo({
  title: "Square Foot Seva Fundraiser",
  description: "Create your own Square Foot Seva fundraising page and invite family and friends to help build the temple of ISKCON Gambheeram Visakhapatnam.",
  path: "/sqft-seva-campaign/register"
});

export default function CampaignerRegisterPage() {
  return <CampaignerRegisterClient campaignType="SQFT" />;
}
