import SpecialOccasionClient from "./SpecialOccasionClient";
import { donationMetadata, donationJsonLd } from "@/lib/donationSeo";
import JsonLd from "@/components/seo/JsonLd";

export const metadata = donationMetadata("special-occasion");

export default function SpecialOccasionPage() {
  return (
    <>
      <JsonLd data={donationJsonLd("special-occasion")} />
      <SpecialOccasionClient />
    </>
  );
}
