import DamodarClient from "./DamodarClient";
import { donationMetadata, donationJsonLd } from "@/lib/donationSeo";
import JsonLd from "@/components/seo/JsonLd";

export const metadata = donationMetadata("damodar");

export default function DamodarPage() {
  return (
    <>
      <JsonLd data={donationJsonLd("damodar")} />
      <DamodarClient />
    </>
  );
}
