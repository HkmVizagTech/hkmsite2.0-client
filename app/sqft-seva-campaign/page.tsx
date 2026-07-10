import SqftCampaignClient from "./SqftCampaignClient";

export const metadata = {
  title: "Square Foot Seva | Hare Krishna Vaikuntham Temple, Visakhapatnam",
  description:
    "Be a part of the Hare Krishna Vaikuntham Temple in the making. Sponsor one or more square feet of construction at ₹6,000 per square foot and receive prasadam, a contribution certificate and 80G tax exemption.",
  openGraph: {
    title: "Square Foot Seva — Hare Krishna Vaikuntham Temple",
    description:
      "Sponsor the sacred ground of the rising temple. Every square foot becomes a permanent part of the Lord's abode.",
    images: ["/assets/home-temple-construction-banner.webp"],
  },
};

export default function SqftSevaCampaignPage() {
  return <SqftCampaignClient />;
}
