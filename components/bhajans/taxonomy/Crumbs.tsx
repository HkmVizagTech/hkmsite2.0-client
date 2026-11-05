import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export default function Crumbs({ trail }: { trail: { name: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-5 flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-1 text-[13px] text-vk-800">
      <Link href="/" className="inline-flex min-h-[32px] items-center gap-1 hover:text-vk-600"><Home className="h-3.5 w-3.5" aria-hidden /> Home</Link>
      <ChevronRight className="h-3.5 w-3.5 opacity-60" aria-hidden />
      <Link href="/bhajans" className="hover:text-vk-600">Bhajans</Link>
      {trail.map((t, i) => (
        <span key={t.name} className="flex min-w-0 items-center gap-1.5">
          <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-60" aria-hidden />
          {t.href && i < trail.length - 1 ? (
            <Link href={t.href} className="hover:text-vk-600">{t.name}</Link>
          ) : (
            <span className="max-w-[60vw] truncate font-semibold text-ink" aria-current="page">{t.name}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
