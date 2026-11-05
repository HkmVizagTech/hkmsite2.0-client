import PlaylistPage, { playlistMetadata } from "@/components/bhajans/taxonomy/PlaylistPage";
import { localizedFn } from "@/lib/i18n/seo";

type P = { params: Promise<{ slug: string; lang: string }> };

export const generateMetadata = localizedFn(async ({ params }: P) => playlistMetadata("mood", (await params).slug));

export async function generateStaticParams() {
  return [];
}

export default async function Page({ params }: P) {
  const { slug, lang } = await params;
  return <PlaylistPage type="mood" slug={slug} lang={lang} />;
}
