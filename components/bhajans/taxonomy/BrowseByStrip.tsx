import Link from "next/link";
import { FOCUS } from "./ui";

const ITEMS = [
  { key: "authors", label: "Composers", href: "/bhajans/authors" },
  { key: "categories", label: "Categories", href: "/bhajans/categories" },
  { key: "moods", label: "Moods", href: "/bhajans/moods" },
  { key: "festivals", label: "Festivals", href: "/bhajans/festivals" },
  { key: "library", label: "Your Library", href: "/bhajans/library" },
];

/** Light pill strip: Composers · Categories · Moods · Festivals · Your Library. Scrolls sideways on phones. */
export default function BrowseByStrip({ active, className = "" }: { active?: "authors" | "categories" | "moods" | "festivals" | "library"; className?: string }) {
  return (
    <nav aria-label="Browse bhajans by" className={className}>
      <ul className="-mx-4 flex gap-2 overflow-x-auto px-4 py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:flex-wrap md:px-0">
        <li className="flex shrink-0 items-center pr-1 text-[13px] font-bold uppercase tracking-wider text-vk-700">Browse by</li>
        {ITEMS.map((i) => (
          <li key={i.key} className="shrink-0">
            <Link
              href={i.href}
              aria-current={active === i.key ? "page" : undefined}
              className={`inline-flex min-h-[44px] items-center rounded-full px-4 text-sm font-semibold ring-1 transition-colors motion-reduce:transition-none ${FOCUS} ${active === i.key ? "bg-vk-600 text-white ring-vk-600" : "bg-white text-vk-800 ring-vk-200 hover:bg-vk-50"}`}
            >
              {i.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
