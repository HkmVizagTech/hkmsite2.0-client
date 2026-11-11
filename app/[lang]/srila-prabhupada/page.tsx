import SrilaPrabhupadaClient from "@/components/srila-prabhupada/SrilaPrabhupadaClient";
import { donationMetadata, donationJsonLd } from "@/lib/donationSeo";
import JsonLd from "@/components/seo/JsonLd";
import { localized } from "@/lib/i18n/seo";

const baseMetadata = donationMetadata("srila-prabhupada");

export default function SrilaPrabhupadaPage() {
  return (
    <>
      <JsonLd data={donationJsonLd("srila-prabhupada")} />
      <SrilaPrabhupadaClient />
    </>
  );
}

export const generateMetadata = localized(baseMetadata);
