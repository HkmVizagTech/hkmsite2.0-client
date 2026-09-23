import { Suspense } from "react";
import PitruPakshaClient from "@/components/pitru-paksha/PitruPakshaClient";

export const metadata = {
  title: "Pitru Paksha Sevas | Hare Krishna Movement Vizag",
  description:
    "Honour your ancestors this Pitru Paksha — offer Annadana, Sadhu Bhojan, Gau Seva and other sacred sevas online at Hare Krishna Vaikuntham Temple, Visakhapatnam.",
  alternates: { canonical: "/pitru-paksha" },
  openGraph: {
    title: "Pitru Paksha Sevas — Hare Krishna Movement Vizag",
    description:
      "Pay homage to your forefathers this Pitru Paksha. Offer Annadana, Sadhu Bhojan, Gau Seva and more with devotion at HKM Vizag.",
    images: [
      "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1790142053890-1790142053377-pitrupakshadesk.webp",
    ],
  },
};

export default function PitruPakshaPage() {
  return (
    <Suspense fallback={null}>
      <PitruPakshaClient />
    </Suspense>
  );
}