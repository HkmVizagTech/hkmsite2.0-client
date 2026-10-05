import { donationMetadata, donationJsonLd } from "@/lib/donationSeo";
import JsonLd from "@/components/seo/JsonLd";
import PitruPakshaClient from "@/components/pitru-paksha/PitruPakshaClient";

export const metadata = donationMetadata("pitru-paksha");

export default function PitruPakshaPage() {
  return (
    <>
      <JsonLd data={donationJsonLd("pitru-paksha")} />
      <PitruPakshaClient />
    </>
  );
}