import CampaignerRegisterClient from "@/components/campaign/CampaignerRegisterClient";
import { pageSeo } from "@/lib/seo";

export const metadata = pageSeo({
  title: "Become a Janmashtami Seva Campaigner",
  description: "Create your Janmashtami seva campaign page and invite friends and family to offer seva at ISKCON Gambheeram Visakhapatnam.",
  path: "/janmashtami/register"
});

export default function JanmashtamiCampaignerRegisterPage() {
  return <CampaignerRegisterClient campaignType="JANMASHTAMI" />;
}
