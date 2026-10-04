import type { Metadata } from "next";
import { Suspense } from "react";
import ThankYouClient from "@/components/ekadashi-campaign/ThankYouClient";
import { pageSeo } from "@/lib/seo";

export const metadata = pageSeo({
  title: "Thank You — Ekadashi Seva",
  description: "Your Ekadashi seva offering to ISKCON Gambheeram Visakhapatnam has been received. Hare Krishna!",
  path: "/ekadashi/thank-you",
  noindex: true
});

export default function ThankYouPage() {
  // ThankYouClient reads the seva/amount from the URL (useSearchParams).
  return (
    <Suspense fallback={null}>
      <ThankYouClient />
    </Suspense>
  );
}