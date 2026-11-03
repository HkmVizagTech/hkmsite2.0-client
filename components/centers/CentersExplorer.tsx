"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, MapPin } from "lucide-react";
import { CENTERS, CENTER_REGIONS, type CenterRegion } from "@/lib/centers";

type Filter = "All" | CenterRegion;

// Our own temple's image (pinned first); same picture as the overview on /iskcon-vizag-temple.
const OUR_TEMPLE_IMAGE =
  "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1793691134023-1793691133192-WhiteStoneHinduTempleinForestClearing.png";

/** Region chips + the centre grid. Our own temple is always pinned first. */
export default function CentersExplorer() {
  const [filter, setFilter] = useState<Filter>("All");

  const counts = useMemo(() => {
    const m: Record<string, number> = { All: CENTERS.length };
    for (const c of CENTERS) m[c.region] = (m[c.region] || 0) + 1;
    return m;
  }, []);

  const list = filter === "All" ? CENTERS : CENTERS.filter((c) => c.region === filter);
  const filters: Filter[] = ["All", ...CENTER_REGIONS];

  return (
    <div>
      <div role="tablist" aria-label="Filter centres by region" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
        {filters.map((f) => {
          const active = f === filter;
          return (
            <button
              key={f}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setFilter(f)}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                active
                  ? "border-vk-700 bg-vk-700 text-white"
                  : "border-vk-200 bg-white text-ink/70 hover:border-vk-400 hover:text-vk-700"
              }`}
            >
              {f}
              <span className={`ml-1.5 text-xs ${active ? "text-white/70" : "text-ink/40"}`}>{counts[f] || 0}</span>
            </button>
          );
        })}
      </div>

      <ul className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filter === "All" && (
          <li className="sm:col-span-2 lg:col-span-3">
            <Link
              href="/iskcon-vizag-temple"
              className="group grid overflow-hidden rounded-2xl border border-gold/40 bg-white shadow-sm transition-shadow hover:shadow-md lg:grid-cols-[1.5fr_1fr]"
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-vk-100">
                <Image
                  src={OUR_TEMPLE_IMAGE}
                  alt="ISKCON Gambheeram, Visakhapatnam"
                  fill
                  sizes="(min-width: 1024px) 720px, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </div>
              <div className="flex flex-col justify-center p-6 lg:p-10">
                <span className="w-fit rounded-full bg-vk-50 px-3 py-1 text-xs font-semibold text-vk-700">Our temple</span>
                <h3 className="mt-4 text-xl font-semibold leading-snug text-ink md:text-2xl">ISKCON Gambheeram, Visakhapatnam</h3>
                <p className="mt-2 flex items-center gap-1.5 text-sm text-ink/60">
                  <MapPin className="h-3.5 w-3.5 shrink-0" /> Visakhapatnam, Andhra Pradesh
                </p>
                <p className="mt-4 text-sm leading-relaxed text-ink/70">
                  The Hare Krishna Vaikuntham temple on IIM Road, Gambheeram. Daily darshan, aarti, kirtan and prasadam since 2008.
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-vk-700">
                  Plan your visit <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>
            </Link>
          </li>
        )}
        {list.map((c) => (
          <li key={c.slug}>
            <Link
              href={`/centers/${c.slug}`}
              className="group block h-full overflow-hidden rounded-2xl border border-vk-100 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-vk-100">
                <Image
                  src={c.cardImage ?? c.image}
                  alt={c.name}
                  fill
                  sizes="(min-width: 1024px) 384px, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <div className="flex items-start justify-between gap-3 p-5">
                <div className="min-w-0">
                  <h3 className="font-semibold leading-snug text-ink">{c.name}</h3>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-ink/60">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">
                      {c.city}, {c.state}
                    </span>
                  </p>
                </div>
                <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-ink/30 transition-colors group-hover:text-vk-700" />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
