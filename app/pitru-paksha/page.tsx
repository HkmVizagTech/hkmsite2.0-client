import { Suspense } from "react";
import { donationMetadata, donationJsonLd } from "@/lib/donationSeo";
import JsonLd from "@/components/seo/JsonLd";
import DonationSeoFallback from "@/components/seo/DonationSeoFallback";
import PitruPakshaClient from "@/components/pitru-paksha/PitruPakshaClient";

export const metadata = donationMetadata("pitru-paksha");

export default function PitruPakshaPage() {
  return (
    <>
      <JsonLd data={donationJsonLd("pitru-paksha")} />
      <Suspense fallback={<DonationSeoFallback page="pitru-paksha" />}>
        <PitruPakshaClient />
      </Suspense>
    </>
  );
}