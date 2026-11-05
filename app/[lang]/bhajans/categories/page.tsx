import TaxonomyIndexPage, { indexMetadata } from "@/components/bhajans/taxonomy/TaxonomyIndexPage";
import { localized } from "@/lib/i18n/seo";

export const generateMetadata = localized(indexMetadata("category"));

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  return <TaxonomyIndexPage type="category" lang={(await params).lang} />;
}
