import { Suspense } from "react";
import RadhashtamiClient from "@/components/radhashtami/RadhashtamiClient";

export const metadata = {
  title: "Sri Radhashtami | Hare Krishna Movement Vizag",
  description:
    "Offer sacred Radhashtami sevas online — Yajamana, Annadana, Abhishekam, Pushpalankara, Naivedya and Gau Seva at Hare Krishna Vaikuntham Temple, Visakhapatnam.",
  alternates: { canonical: "/radhashtami" },
  openGraph: {
    title: "Sri Radhashtami Sevas — Hare Krishna Movement Vizag",
    description:
      "Celebrate the divine appearance of Srimati Radharani with sacred sevas at HKM Vizag. Yajamana, Annadana, Abhishekam, Pushpalankara, Naivedya and Gau Seva.",
    images: [
      "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1788946765218-1788946764659-Radhashtamidesk.webp",
    ],
  },
};

export default function RadhashtamiPage() {
  return (
    <Suspense fallback={null}>
      <RadhashtamiClient />
    </Suspense>
  );
}
