import Link from "next/link";
import Avatar from "./Avatar";
import { FOCUS } from "./ui";
import { pickL10n, type TaxonomyItem } from "@/lib/bhajansTaxonomy";

/** "Fans also like": swipeable row of round composer avatars (peeks the next one on phones). */
export default function AuthorShelf({ title, items, lang }: { title: string; items: TaxonomyItem[]; lang: string }) {
  if (!items.length) return null;
  return (
    <section aria-label={title}>
      <h2 className="mb-3 font-serif-display text-xl font-bold text-ink sm:text-2xl">{title}</h2>
      <ul className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-4 px-4 pb-2 md:mx-0 md:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((a) => {
          const name = pickL10n(a.name, lang);
          return (
            <li key={a.slug} className="w-[132px] shrink-0 snap-start sm:w-[148px]">
              <Link href={`/bhajans/authors/${a.slug}`} className={`flex flex-col items-center rounded-2xl p-2 text-center hover:bg-vk-50 ${FOCUS}`}>
                <Avatar name={a.name.en || name} src={a.image} className="h-[108px] w-[108px] sm:h-[124px] sm:w-[124px]" sizes="130px" textClass="text-3xl" />
                <span className="mt-3 line-clamp-2 min-h-[2.5rem] text-[15px] font-bold leading-snug text-ink">{name}</span>
                <span className="text-[13px] text-vk-700">{a.songCount} bhajans</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
