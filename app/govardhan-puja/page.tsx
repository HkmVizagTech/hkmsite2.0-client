import { Suspense } from "react";
import { donationMetadata, donationJsonLd } from "@/lib/donationSeo";
import JsonLd from "@/components/seo/JsonLd";
import DonationSeoFallback from "@/components/seo/DonationSeoFallback";
import GovardhanPujaClient from "@/components/govardhan-puja/GovardhanPujaClient";

export const metadata = donationMetadata("govardhan-puja");

export default function GovardhanPujaPage() {
  return (
    <>
      <JsonLd data={donationJsonLd("govardhan-puja")} />
      <Suspense fallback={<DonationSeoFallback page="govardhan-puja" />}>
        <GovardhanPujaClient />
      </Suspense>
    </>
  );
}