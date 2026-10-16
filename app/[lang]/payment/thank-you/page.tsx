import { Suspense } from "react";
import ThankYouPageClient from "@/components/payment/ThankYouPageClient";
import { pageSeo } from "@/lib/seo";

import { localized } from "@/lib/i18n/seo";
const baseMetadata = pageSeo({
  title: "Thank You for Your Seva",
  description: "Your seva offering to ISKCON Gambheeram Visakhapatnam has been received. Hare Krishna!",
  path: "/payment/thank-you",
  noindex: true
});

export default function PaymentThankYouPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}> 
      <ThankYouPageClient />
    </Suspense>
  );
}

export const generateMetadata = localized(baseMetadata);
