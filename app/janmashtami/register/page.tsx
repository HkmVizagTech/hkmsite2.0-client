import CampaignerRegisterClient from "@/components/campaign/CampaignerRegisterClient";

export const metadata = {
  title: "Become a Janmashtami Seva Campaigner | HKM Vizag",
  description:
    "Register as a Sri Krishna Janmashtami seva campaigner for ISKCON Gambheeram Visakhapatnam. Get your personal link upon approval and invite friends and family to offer sevas.",
};

export default function JanmashtamiCampaignerRegisterPage() {
  return <CampaignerRegisterClient campaignType="JANMASHTAMI" />;
}
