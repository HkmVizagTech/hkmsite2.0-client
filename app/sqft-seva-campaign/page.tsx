import { Suspense } from "react";
import SqftCampaignClient from "./SqftCampaignClient";
import { siteKeywords } from "@/lib/seo";

export const metadata = {
  title: { absolute: "Square Foot Seva | Hare Krishna Vaikuntham Temple, Visakhapatnam" },
  description:
    "Be a part of the Hare Krishna Vaikuntham Temple (ISKCON Vizag) in the making. Sponsor one or more square feet of construction at ₹2,100 per square foot and receive prasadam, a contribution certificate and 80G tax exemption.",
  keywords: [
    "Square foot seva ISKCON",
    "temple construction donation",
    "Hare Krishna temple Visakhapatnam",
    ...siteKeywords,
  ],
  alternates: { canonical: "/sqft-seva-campaign" },
  openGraph: {
    title: "Square Foot Seva — Hare Krishna Vaikuntham Temple",
    description:
      "Sponsor the sacred ground of the rising temple. Every square foot becomes a permanent part of the Lord's abode.",
    images: ["https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1786528614525-1786528613759-ChatGPTImageAug122026022735PM.webp"],
  },
};

export default function SqftSevaCampaignPage() {
  return (
    <Suspense fallback={null}>
      <SqftCampaignClient />
    </Suspense>
  );
}
