import { donationMetadata, donationJsonLd } from "@/lib/donationSeo";
import JsonLd from "@/components/seo/JsonLd";
import RadhashtamiClient from "@/components/radhashtami/RadhashtamiClient";

export const metadata = donationMetadata("radhashtami");

export default function RadhashtamiPage() {
  return (
    <>
      <JsonLd data={donationJsonLd("radhashtami")} />
      <RadhashtamiClient />
    </>
  );
}
