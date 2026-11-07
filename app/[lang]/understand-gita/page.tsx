import JsonLd from "@/components/seo/JsonLd";
import UnderstandGitaClient from "@/components/understand-gita/UnderstandGitaClient";
import { breadcrumbJsonLd, pageSeo, SITE_URL, ORG_NAME } from "@/lib/seo";
import { localized } from "@/lib/i18n/seo";
import { FAQS } from "@/lib/understandGita";

const baseMetadata = pageSeo({
  title: "Understand Gita in 18 Days: Free Online Bhagavad-gita Course",
  description:
    "Join the free Understand Gita in 18 Days course: 60 minutes of live online classes every day, Q&A with the instructor, recordings, study material and quizzes. Batches for adults, youth and kids.",
  path: "/understand-gita",
  keywords: ["understand gita in 18 days", "free bhagavad gita course online", "bhagavad gita class Visakhapatnam", "gita course for kids", "ISKCON Vizag gita class"],
});

export const generateMetadata = localized(baseMetadata);

export default function UnderstandGitaPage() {
  const courseLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "Understand Gita in 18 Days",
    description: "A free online Bhagavad-gita course with a 60-minute live class each day, Q&A, study material and quizzes.",
    provider: { "@type": "Organization", name: ORG_NAME, sameAs: SITE_URL },
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR", category: "Free" },
    hasCourseInstance: { "@type": "CourseInstance", courseMode: "online", courseWorkload: "PT60M per day for 18 days" },
    url: `${SITE_URL}/understand-gita`,
  };
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  return (
    <>
      <JsonLd data={courseLd} />
      <JsonLd data={faqLd} />
      <JsonLd data={breadcrumbJsonLd([{ name: "Understand Gita in 18 Days", path: "/understand-gita" }])} />
      <UnderstandGitaClient />
    </>
  );
}
