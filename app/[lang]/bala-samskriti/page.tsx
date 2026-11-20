import JsonLd from "@/components/seo/JsonLd";
import BalaSamskritiClient from "@/components/programs/BalaSamskritiClient";
import { breadcrumbJsonLd, pageSeo, SITE_URL, ORG_NAME } from "@/lib/seo";
import { localized } from "@/lib/i18n/seo";

// Registrations from this page are tracked in Admin → Programs (page link "bala-samskriti").
const baseMetadata = pageSeo({
  title: "Bala Samskriti: Vedic Culture & Values Course for Kids in Visakhapatnam",
  description:
    "A 3-month Sunday course for children aged 6 to 13: life skills, Bhagavad-gita for kids, meditation and Vedic culture. Starts 6 December 2026 at Gambhiram and Madhavadhara. Course fee ₹2,500.",
  path: "/bala-samskriti",
  keywords: ["bala samskriti", "kids course visakhapatnam", "bhagavad gita for kids", "vedic culture classes for children", "ISKCON Vizag kids program", "sunday classes for kids vizag"],
});

export const generateMetadata = localized(baseMetadata);

export default function BalaSamskritiPage() {
  const courseLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "Bala Samskriti: Vedic Culture & Values for Kids",
    description: "A 3-month Sunday course for children aged 6 to 13 covering life skills, the Bhagavad-gita for kids and meditation.",
    provider: { "@type": "Organization", name: ORG_NAME, sameAs: SITE_URL },
    offers: { "@type": "Offer", price: "2500", priceCurrency: "INR", category: "Paid" },
    hasCourseInstance: { "@type": "CourseInstance", courseMode: "onsite", startDate: "2026-12-06", courseSchedule: { "@type": "Schedule", repeatFrequency: "P1W", byDay: "https://schema.org/Sunday", startTime: "10:30", endTime: "13:30" } },
    url: `${SITE_URL}/bala-samskriti`,
  };
  return (
    <>
      <JsonLd data={courseLd} />
      <JsonLd data={breadcrumbJsonLd([{ name: "Bala Samskriti", path: "/bala-samskriti" }])} />
      <BalaSamskritiClient />
    </>
  );
}
