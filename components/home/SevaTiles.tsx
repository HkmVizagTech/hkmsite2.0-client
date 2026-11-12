"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { sevas, getSevaHref } from "@/lib/sevaConfig";
import { FESTIVAL_PAGE } from "@/components/FestivalDonationsSection";
import SectionHeading from "@/components/site/SectionHeading";
import Reveal from "@/components/site/Reveal";
import { useT } from "@/components/i18n/LocaleProvider";
import { GoldSparkles } from "@/components/home/HomeMagic";

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
  const t = useT();
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


  const Card = ({ tile, imgClass, fit, sizes }: { tile: TileData; imgClass: string; fit: string; sizes: string }) => (
    <Link href={tile.href} className="hm-seva-card group flex h-full flex-col overflow-hidden rounded-2xl">
      <div className={`relative overflow-hidden ${imgClass}`}>
        {fit === "object-contain" && <Image src={tile.img} alt="" aria-hidden fill sizes="160px" className="scale-125 object-cover blur-2xl saturate-150" />}
        <Image src={tile.img} alt={t(tile.title)} fill sizes={sizes} className={`${fit} transition-transform duration-700 group-hover:scale-[1.04]`} />
        {tile.badge && (
          <span className="absolute left-3 top-3 z-[2] inline-flex items-center gap-1 rounded-full bg-[#0A1640]/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#FFE6A3] ring-1 ring-[#F6C752]/60 backdrop-blur">
            <Sparkles className="h-3 w-3" /> {t(tile.badge)}
          </span>
        )}
      </div>
      <div className="flex flex-1 items-center justify-between gap-3 p-4">
        <div className="min-w-0">
          <h3 className="text-[16px] font-bold leading-snug text-white md:text-[17px]">{t(tile.title)}</h3>
          {tile.from ? <p className="mt-1 text-[13px] font-semibold text-[#F6C752]">{t("From ₹{amount}", { amount: inr(tile.from) })}</p> : null}
        </div>
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F6C752] text-[#1A1240] shadow-[0_0_16px_rgba(246,199,82,.55)] transition-transform group-hover:rotate-45">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );

  return (
    <section className="vk-section hm-midnight relative isolate overflow-hidden">
      <div aria-hidden className="sp-rays absolute left-1/2 top-0 -z-10 h-[1100px] w-[1100px] -translate-x-1/2 opacity-60" />
      <GoldSparkles count={18} className="-z-10" />
      <div className="vk-container">
        <SectionHeading
          light
          align="center"
          eyebrow={t("Seva Opportunities")}
          title={t("Donate Generously, Support Our Seva")}
          subtitle={t("Every contribution to Hare Krishna Vaikuntham — temple construction, Anna Daan, Gau Seva or Gita Daan — helps share Krishna's mercy with thousands. All donations are eligible for 80G tax benefits.")}
        />
        {/* Festival posters are wide (about 21:8), so they get their own row of cards in exactly that shape. */}
        {festivals.length > 0 && (
          <div className="-mx-4 mb-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] md:mx-auto md:mb-8 md:grid md:max-w-6xl md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0 md:pb-0 [&::-webkit-scrollbar]:hidden">
            {festivals.map((tile, i) => (
              <Reveal key={tile.key} delay={i * 0.06} className="w-[86%] shrink-0 snap-center sm:w-[60%] md:w-auto">
                <Card tile={tile} imgClass="aspect-[21/8]" fit="object-cover" sizes="(min-width: 768px) 380px, 86vw" />
              </Reveal>
            ))}
          </div>
        )}
        {/* Seva pictures vary in shape, so each is shown whole over a soft blurred copy of itself. */}
        <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 [scrollbar-width:none] md:mx-auto md:grid md:max-w-6xl md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0 md:pb-0 [&::-webkit-scrollbar]:hidden">
          {sevaTiles.map((tile, i) => (
            <Reveal key={tile.key} delay={(i % 6) * 0.05} className="w-[78%] shrink-0 snap-center sm:w-[46%] md:w-auto">
              <Card tile={tile} imgClass="aspect-[4/3]" fit="object-contain" sizes="(min-width: 768px) 380px, 78vw" />
            </Reveal>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/donate" className="vk-btn-gold">
            {t("View all sevas")}
          </Link>
        </div>
      </div>
    </section>
  );
}
