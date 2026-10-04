import { Suspense } from "react";
import JanmashtamiClient from "./JanmashtamiClient";
import { pageSeo } from "@/lib/seo";

export const metadata = pageSeo({
  title: "Janmashtami Sevas",
  description: "Offer Sri Krishna Janmashtami sevas online at ISKCON Gambheeram Visakhapatnam.",
  path: "/janmashtami3",
  canonical: "/janmashtami",
  noindex: true
});

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
