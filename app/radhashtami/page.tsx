import { Suspense } from "react";
import { donationMetadata, donationJsonLd } from "@/lib/donationSeo";
import JsonLd from "@/components/seo/JsonLd";
import DonationSeoFallback from "@/components/seo/DonationSeoFallback";
import RadhashtamiClient from "@/components/radhashtami/RadhashtamiClient";

export const metadata = donationMetadata("radhashtami");

export default function RadhashtamiPage() {
  return (
    <>
      <JsonLd data={donationJsonLd("radhashtami")} />
      <Suspense fallback={<DonationSeoFallback page="radhashtami" />}>
        <RadhashtamiClient />
      </Suspense>
    </>
  );
}
