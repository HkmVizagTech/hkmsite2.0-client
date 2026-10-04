import ChaturmasClient from "./ChaturmasClient";
import { donationMetadata, donationJsonLd } from "@/lib/donationSeo";
import JsonLd from "@/components/seo/JsonLd";

export const metadata = donationMetadata("chaturmas");

export default function ChaturmasPage() {
  return (
    <>
      <JsonLd data={donationJsonLd("chaturmas")} />
      <ChaturmasClient />
    </>
  );
}
