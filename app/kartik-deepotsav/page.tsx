import KartikDeepotsavClient from "./KartikDeepotsavClient";
import { donationMetadata, donationJsonLd } from "@/lib/donationSeo";
import JsonLd from "@/components/seo/JsonLd";

export const metadata = donationMetadata("kartik-deepotsav");

export default function KartikDeepotsavPage() {
  return (
    <>
      <JsonLd data={donationJsonLd("kartik-deepotsav")} />
      <KartikDeepotsavClient />
    </>
  );
}
