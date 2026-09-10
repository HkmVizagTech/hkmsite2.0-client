import type { Metadata } from "next";
import EkadashiCampaignClient from "@/components/ekadashi-campaign/EkadashiCampaignClient";
import { fetchEkadashiCampaign, DEFAULT_CAMPAIGN } from "@/lib/ekadashiCampaign";

export const revalidate = 0;

// Since /ekadashi is a static route (no dynamic params), runtime metadata
// isn't available — we export a solid generic default and the client
// component syncs the browser title/doc to the admin-configured meta title.
export const metadata: Metadata = {
  title: "Ekadashi Seva | Hare Krishna Vaikuntham Temple, Visakhapatnam",
  description:
    "Donate for Ekadashi seva at the Hare Krishna Vaikuntham Temple, Visakhapatnam. Sponsor sacred puja, bhog, and temple seva on this most auspicious day.",
  openGraph: {
    title: "Ekadashi Seva — Hare Krishna Vaikuntham Temple",
    description:
      "Offer seva on Ekadashi at the Hare Krishna Vaikuntham Temple. Your donation sustains daily worship, sacred bhog, and festive arrangements.",
    type: "website",
    images: [
      {
        url: DEFAULT_CAMPAIGN.ogImage,
        width: 1200,
        height: 630,
        alt: "Ekadashi Seva — Hare Krishna Vaikuntham Temple",
      },
    ],
  },
};

export default async function EkadashiPage() {
  const campaign = await fetchEkadashiCampaign();
  return <EkadashiCampaignClient campaign={campaign} />;
}