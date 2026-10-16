import CampaignerRegisterClient from "@/components/campaign/CampaignerRegisterClient";
import { pageSeo } from "@/lib/seo";

import { localized } from "@/lib/i18n/seo";
const baseMetadata = pageSeo({
  title: "Become a Janmashtami Seva Campaigner",
  description: "Create your Janmashtami seva campaign page and invite friends and family to offer seva at ISKCON Gambheeram Visakhapatnam.",
  path: "/janmashtami/register"
});

export default function JanmashtamiCampaignerRegisterPage() {
  return <CampaignerRegisterClient campaignType="JANMASHTAMI" />;
}

export const generateMetadata = localized(baseMetadata);
