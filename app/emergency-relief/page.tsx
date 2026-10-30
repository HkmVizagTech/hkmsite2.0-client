import EmergencyReliefClient from "./EmergencyReliefClient";
import { donationMetadata, donationJsonLd } from "@/lib/donationSeo";
import JsonLd from "@/components/seo/JsonLd";

// Indexed and in the sitemap, but deliberately not linked from the site menus, home page or donation grids:
// it is shared by direct link during an emergency.
export const metadata = donationMetadata("emergency-relief");

export default function EmergencyReliefPage() {
  return (
    <>
      <JsonLd data={donationJsonLd("emergency-relief")} />
      <EmergencyReliefClient />
    </>
  );
}
