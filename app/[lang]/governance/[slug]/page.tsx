import { notFound } from "next/navigation";
import MemberView from "@/components/governance/MemberView";
import { COUNCIL, councilMember } from "@/lib/governance";
import { pageSeo } from "@/lib/seo";
import { localizedFn } from "@/lib/i18n/seo";

type Props = { params: Promise<{ lang: string; slug: string }> };

export function generateStaticParams() {
  return COUNCIL.map((m) => ({ slug: m.slug }));
}

async function baseGenerateMetadata({ params }: Props) {
  const { slug } = await params;
  const m = councilMember(slug);
  if (!m) return {};
  return pageSeo({
    title: `${m.name}: ${m.roles[0]}`,
    description: m.bio[0].slice(0, 155),
    path: `/governance/${m.slug}`,
    image: m.image,
  });
}

export default async function MemberPage({ params }: Props) {
  const { slug } = await params;
  const m = councilMember(slug);
  if (!m) notFound();
  return <MemberView m={m} />;
}

export const generateMetadata = localizedFn(baseGenerateMetadata);
