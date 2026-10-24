import KartikMaasClient from "./KartikMaasClient";
import { donationMetadata, donationJsonLd } from "@/lib/donationSeo";
import JsonLd from "@/components/seo/JsonLd";

export const metadata = donationMetadata("kartik-maas");

export default function KartikMaasPage() {
  return (
    <>
      <JsonLd data={donationJsonLd("kartik-maas")} />
      <KartikMaasClient />
    </>
  );
}
