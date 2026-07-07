import RegisterClient from "./RegisterClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Start Your Fundraising Campaign | Square Foot Seva",
  description:
    "Create your personal Square Foot Seva fundraising campaign for the Hare Krishna Vaikuntham Temple and share it with friends and family.",
};

export default function CampaignerRegisterPage() {
  return <RegisterClient />;
}
