"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Sparkles } from "lucide-react";
import { sevas, getSevaHref } from "@/lib/sevaConfig";
import { FESTIVAL_PAGE } from "@/components/FestivalDonationsSection";
import SectionHeading from "@/components/site/SectionHeading";
import Reveal from "@/components/site/Reveal";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "") || "http://localhost:8080";

interface TileData {
  key: string;
  title: string;
  href: string;
  img: string;
  from?: number;
  badge?: string;
}

const inr = (n: number) => n.toLocaleString("en-IN");

/** GVD "Donate Generously, Support Our Seva" — square image tiles for every seva and live festival campaign. */
export default function SevaTiles() {
  const [festivals, setFestivals] = useState<TileData[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/festival-donations/all`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setFestivals(
          list
            .filter((c: any) => c?.slug && c?.title && c.active !== false && FESTIVAL_PAGE[c.slug])
            .map((c: any) => {
              const amounts = (c.donationOptions || [])
                .map((o: any) => Number(o?.amount))
                .filter((n: number) => Number.isFinite(n) && n > 0);
              return {
                key: `f-${c.slug}`,
                title: c.title,
                href: FESTIVAL_PAGE[c.slug],
                img: c.images?.[0] || "/assets/home-event-radhashtami.webp",
                from: amounts.length ? Math.min(...amounts) : undefined,
                badge: "Festival",
              } as TileData;
            })
        );
      })
      .catch(() => {});
  }, []);

  const sevaTiles: TileData[] = sevas.map((s) => ({
    key: s.slug,
    title: s.title,
    href: getSevaHref(s),
    img: s.image,
    from: s.tiers.length ? Math.min(...s.tiers.map((t) => t.amount)) : undefined,
  }));

  const tiles = [...festivals, ...sevaTiles];

  return (
    <section className="vk-section">
      <div className="vk-container">
        <SectionHeading
          align="center"
          eyebrow="Seva Opportunities"
          title="Donate Generously, Support Our Seva"
          subtitle="Every contribution to Hare Krishna Vaikuntham — temple construction, Anna Daan, Gau Seva or Gita Daan — helps share Krishna's mercy with thousands. All donations are eligible for 80G tax benefits."
        />
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-3 sm:grid-cols-3 md:gap-5 lg:grid-cols-4">
          {tiles.map((t, i) => (
            <Reveal key={t.key} delay={(i % 8) * 0.04}>
              <Link href={t.href} className="vk-tile group block aspect-square">
                <Image
                  src={t.img}
                  alt={t.title}
                  fill
                  sizes="(min-width: 1024px) 280px, (min-width: 640px) 33vw, 50vw"
                  className="object-cover"
                />
                {t.badge && (
                  <span className="absolute left-3 top-3 z-[2] inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-vk-800 shadow">
                    <Sparkles className="h-3 w-3" /> {t.badge}
                  </span>
                )}
                <div className="vk-tile-caption">
                  <h3 className="text-[15px] font-bold leading-tight text-white md:text-lg">{t.title}</h3>
                  <div className="mt-1.5 flex items-center justify-between gap-2">
                    {t.from ? (
                      <p className="text-xs text-white/80 md:text-[13px]">From ₹{inr(t.from)}</p>
                    ) : (
                      <span />
                    )}
                    <span className="inline-flex translate-y-1 items-center gap-1 rounded-full bg-[hsl(var(--gold))] px-2.5 py-1 text-[11px] font-bold text-ink opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      <Heart className="h-3 w-3 fill-current" /> Donate
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/donate" className="vk-btn-primary">
            View all sevas
          </Link>
        </div>
      </div>
    </section>
  );
}
