import TaxonomyIndexPage, { indexMetadata } from "@/components/bhajans/taxonomy/TaxonomyIndexPage";
import { localized } from "@/lib/i18n/seo";

export const generateMetadata = localized(indexMetadata("festival"));

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  return <TaxonomyIndexPage type="festival" lang={(await params).lang} />;
}
