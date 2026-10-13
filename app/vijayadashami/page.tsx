import VijayadashamiClient from "./VijayadashamiClient";
import { donationMetadata, donationJsonLd } from "@/lib/donationSeo";
import JsonLd from "@/components/seo/JsonLd";

export const metadata = donationMetadata("vijayadashami");

export default function VijayadashamiPage() {
  return (
    <>
      <JsonLd data={donationJsonLd("vijayadashami")} />
      <VijayadashamiClient />
    </>
  );
}
