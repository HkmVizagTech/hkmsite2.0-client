import AlankaraVastraClient from "@/components/vastra-campaign/AlankaraVastraClient";
import { donationMetadata, donationJsonLd } from "@/lib/donationSeo";
import JsonLd from "@/components/seo/JsonLd";

export const metadata = donationMetadata("alankara-vastra-seva");

export default function AlankaraVastraSevaPage() {
  return (
    <>
      <JsonLd data={donationJsonLd("alankara-vastra-seva")} />
      <AlankaraVastraClient />
    </>
  );
}
