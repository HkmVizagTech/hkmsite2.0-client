import VaikunthaEkadashiClient from "./VaikunthaEkadashiClient";
import { donationMetadata, donationJsonLd } from "@/lib/donationSeo";
import JsonLd from "@/components/seo/JsonLd";

export const metadata = donationMetadata("vaikuntha-ekadashi");

export default function VaikunthaEkadashiPage() {
  return (
    <>
      <JsonLd data={donationJsonLd("vaikuntha-ekadashi")} />
      <VaikunthaEkadashiClient />
    </>
  );
}
