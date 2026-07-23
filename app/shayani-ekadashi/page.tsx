import type { Metadata } from "next";
import ShayaniEkadashiClient from "@/components/ekadashi-campaign/ShayaniEkadashiClient";

export const metadata: Metadata = {
  title: "Shayani Ekadashi Seva | Hare Krishna Vaikuntham Temple, Visakhapatnam",
  description:
    "Donate on Shayani Ekadashi (Ashadhi Ekadashi) as Lord Vishnu begins His four months of divine rest. Sponsor seva at the Hare Krishna Vaikuntham Temple on one of the year's most sacred days.",
  openGraph: {
    title: "Shayani Ekadashi Seva — Hare Krishna Vaikuntham Temple",
    description:
      "Offer seva on Shayani Ekadashi at the Hare Krishna Vaikuntham Temple. Your donation sustains daily worship, sacred bhog, and festive arrangements during Chaturmas.",
    type: "website",
  },
};

export default function ShayaniEkadashiPage() {
  return <ShayaniEkadashiClient />;
}
