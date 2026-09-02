import { Suspense } from "react";
import JanmashtamiClient from "./JanmashtamiClient";

export const metadata = {
  title: "Sri Krishna Janmashtami Seva 2026 | Hare Krishna Movement Vizag",
  description:
    "Offer Sri Krishna Janmashtami sevas online — Vastrabharana, Chappan Bhog, Mandapa, Abhisheka, Annadana, Makhan Mishri, Go Seva, Tulasi Archana, Pushpalankara, Naivedhya, Japa Yagna and more.",
};

export default function JanmashtamiPage() {
  // Suspense is required: JanmashtamiClient calls useSearchParams() for the
  // ?seva= / &amount= deep link, and Next refuses to build a page that reads
  // search params outside a suspense boundary.
  return (
    <Suspense fallback={null}>
      <JanmashtamiClient />
    </Suspense>
  );
}
