import TaxonomyIndexPage, { indexMetadata } from "@/components/bhajans/taxonomy/TaxonomyIndexPage";
import { localized } from "@/lib/i18n/seo";

export const generateMetadata = localized(indexMetadata("mood"));

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  return <TaxonomyIndexPage type="mood" lang={(await params).lang} />;
}
