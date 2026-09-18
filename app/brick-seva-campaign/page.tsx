import { Suspense } from "react";
import SqftCampaignClient from "../sqft-seva-campaign/SqftCampaignClient";
import { BRICK_CAMPAIGN } from "@/lib/campaignConfig";
import { siteKeywords } from "@/lib/seo";

export const metadata = {
  title: { absolute: BRICK_CAMPAIGN.metaTitle },
  description: BRICK_CAMPAIGN.metaDesc,
  keywords: [
    "Brick Seva ISKCON Vizag",
    "brick seva ISKCON",
    "brick donation temple",
    "Hare Krishna temple construction",
    ...siteKeywords,
  ],
  alternates: { canonical: "/brick-seva-campaign" },
  openGraph: {
    title: BRICK_CAMPAIGN.ogTitle,
    description: BRICK_CAMPAIGN.ogDesc,
    images: [BRICK_CAMPAIGN.ogImage],
  },
};

export default function BrickSevaCampaignPage() {
  return (
    <Suspense fallback={null}>
      <SqftCampaignClient campaignType="BRICK" />
    </Suspense>
  );
}
