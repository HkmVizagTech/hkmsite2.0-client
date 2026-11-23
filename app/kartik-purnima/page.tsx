import KartikPurnimaClient from "./KartikPurnimaClient";
import { donationMetadata, donationJsonLd } from "@/lib/donationSeo";
import JsonLd from "@/components/seo/JsonLd";

export const metadata = donationMetadata("kartik-purnima");

export default function KartikPurnimaPage() {
  return (
    <>
      <JsonLd data={donationJsonLd("kartik-purnima")} />
      <KartikPurnimaClient />
    </>
  );
}
