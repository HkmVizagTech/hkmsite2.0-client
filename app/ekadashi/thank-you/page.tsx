import type { Metadata } from "next";
import { Suspense } from "react";
import ThankYouClient from "@/components/ekadashi-campaign/ThankYouClient";

export const metadata: Metadata = {
  title: "Thank You | Ekadashi Seva — Hare Krishna Vaikuntham Temple",
  description:
    "Thank you for your generous Ekadashi donation to the Hare Krishna Vaikuntham Temple. Your seva has been received.",
  openGraph: {
    title: "Thank You — Ekadashi Seva",
    description:
      "Your Ekadashi seva offering has been received. Hare Krishna!",
    type: "website",
  },
};

export default function ThankYouPage() {
  // ThankYouClient reads the seva/amount from the URL (useSearchParams).
  return (
    <Suspense fallback={null}>
      <ThankYouClient />
    </Suspense>
  );
}