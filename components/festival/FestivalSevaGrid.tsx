"use client";

import Image from "next/image";
import { PetalFall } from "@/components/festival/FestivalDecor";
import { useT } from "@/components/i18n/LocaleProvider";
import type { Seva } from "@/lib/sevaConfig";

export type SevaSelection = { seva: Seva; amount: number | null };

const FEATURED_THEMES = {
  royal: {
    glow: "shadow-[0_24px_60px_-22px_rgba(120,20,40,0.55)]",
    bg: "bg-[linear-gradient(160deg,#3a0b1c_0%,#5b1229_55%,#2b0817_100%)]",
    fade: "from-[#3a0b1c]",
    badge: "border-amber-200/70 bg-gradient-to-r from-amber-300 to-amber-500 text-[#4a1020]",
    icon: "border-amber-300/60 bg-amber-300/15",
    title: "text-amber-50",
    tagline: "text-amber-200/90",
    body: "text-amber-50/80",
    tile: "border-amber-300/50 bg-gradient-to-b from-amber-200/20 to-amber-300/5 shadow-[inset_0_1px_0_rgba(255,236,170,0.3)]",
    amount: "text-amber-50",
    rupee: "text-amber-300",
    cta: "bg-gradient-to-r from-amber-300 via-amber-400 to-amber-300 text-[#4a1020]",
  },
  ivory: {
    glow: "shadow-[0_24px_60px_-22px_rgba(120,20,40,0.45)]",
    bg: "bg-[linear-gradient(180deg,#fffdf6_0%,#fff4d9_100%)]",
    fade: "from-[#fffdf6]",
    badge: "border-amber-300 bg-[#5b1229] text-amber-200",
    icon: "border-amber-500/60 bg-amber-100",
    title: "text-[#5b1229]",
    tagline: "text-amber-800",
    body: "text-[#5b1229]/80",
    tile: "border-amber-500/60 bg-white shadow-sm",
    amount: "text-[#5b1229]",
    rupee: "text-amber-600",
    cta: "bg-gradient-to-r from-[#5b1229] via-[#7a1a38] to-[#5b1229] text-amber-200",
  },
  festive: {
    glow: "shadow-[0_24px_60px_-20px_rgba(236,72,153,0.5)]",
    bg: "bg-[linear-gradient(160deg,#fff1b8_0%,#ffd3e2_48%,#ffc27a_100%)]",
    fade: "from-[#fff1b8]",
    badge: "border-white/80 bg-gradient-to-r from-fuchsia-600 via-rose-500 to-orange-500 text-white",
    icon: "border-orange-400/70 bg-white/80",
    title: "text-[#9d174d]",
    tagline: "text-orange-700",
    body: "text-[#6b1d3f]/85",
    tile: "border-orange-400/70 bg-white/85 shadow-sm",
    amount: "text-[#9d174d]",
    rupee: "text-orange-600",
    cta: "bg-gradient-to-r from-orange-500 via-rose-500 to-fuchsia-600 text-white",
  },
  heaven: {
    glow: "shadow-[0_26px_60px_-24px_rgba(30,58,138,0.55)]",
    bg: "bg-[linear-gradient(180deg,#ffffff_0%,#fff8e6_55%,#eaf3fb_100%)]",
    fade: "from-white",
    badge: "border-amber-300 bg-vk-800 text-amber-200",
    icon: "border-[hsl(var(--gold)/0.7)] bg-white",
    title: "text-vk-800",
    tagline: "text-[hsl(var(--gold-deep))]",
    body: "text-ink/75",
    tile: "border-[hsl(var(--gold)/0.7)] bg-gradient-to-b from-white to-[hsl(var(--gold)/0.18)] shadow-sm",
    amount: "text-vk-800",
    rupee: "text-[hsl(var(--gold-deep))]",
    cta: "bg-gradient-to-r from-vk-700 via-vk-600 to-vk-700 text-white",
  },
  diya: {
    glow: "shadow-[0_24px_52px_-28px_rgba(217,150,20,0.6)]",
    bg: "bg-[linear-gradient(180deg,#ffffff_0%,#fffaec_100%)]",
    fade: "from-white",
    badge: "border-amber-300 bg-vk-800 text-amber-200",
    icon: "border-[hsl(var(--gold)/0.7)] bg-white shadow-[0_0_14px_rgba(255,190,70,0.5)]",
    title: "text-vk-800",
    tagline: "text-[hsl(var(--gold-deep))]",
    body: "text-ink/70",
    tile: "border-[hsl(var(--gold)/0.6)] bg-gradient-to-b from-white to-[#fff3d2] shadow-sm",
    amount: "text-vk-800",
    rupee: "text-[hsl(var(--gold-deep))]",
    cta: "bg-vk-700 text-white",
  },
  midnight: {
    glow: "shadow-[0_0_50px_-12px_rgba(255,170,40,0.55),0_24px_60px_-22px_rgba(10,12,60,0.9)]",
    bg: "bg-[radial-gradient(120%_80%_at_50%_0%,#2a2a7a_0%,#14163f_55%,#0a0b2a_100%)]",
    fade: "from-[#14163f]",
    badge: "border-amber-300/80 bg-black/45 text-amber-200 backdrop-blur",
    icon: "border-amber-300/60 bg-amber-300/10 shadow-[0_0_14px_rgba(255,190,60,0.5)]",
    title: "text-white",
    tagline: "text-amber-300",
    body: "text-indigo-100/75",
    tile: "border-amber-300/40 bg-white/[0.06] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur",
    amount: "text-white",
    rupee: "text-amber-300",
    cta: "bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 text-[#2a1405] shadow-[0_0_24px_-4px_rgba(255,190,60,0.7)]",
  },
};

const formatAmount = (amount: number) => amount.toLocaleString("en-IN");

/**
 * The festival seva cards: photo, short description, six amount tiles and "Donate Other Amount". Same cards and same
 * behaviour as the Kartik Maas page; tapping an amount hands the choice to the page, which opens the checkout.
 */
export default function FestivalSevaGrid({
  sevas,
  impacts = {},
  highlightedSlug,
  onSelect,
  variant = "light",
  featuredSlugs = [],
  featuredStyle = "royal",
  featuredBadge = true,
}: {
  sevas: Seva[];
  impacts?: Record<string, Record<number, string>>;
  highlightedSlug?: string | null;
  onSelect: (selection: SevaSelection) => void;
  /** "dark" = glowing gold-edged cards for the night-sky festival pages (Diwali). */
  variant?: "light" | "dark" | "vaikuntha";
  /** Sevas shown as wide premium cards in a row above the regular grid. */
  featuredSlugs?: string[];
  /** "royal" = deep maroon and gold; "ivory" = cream with maroon accents; "midnight" = night-sky indigo with a glowing lamp-gold finish. */
  /** Show the "Special Seva" ribbon on featured cards (off when every card on the page is featured). */
  featuredBadge?: boolean;
  featuredStyle?: "royal" | "ivory" | "midnight" | "festive" | "heaven" | "diya";
}) {
  const theme = FEATURED_THEMES[featuredStyle];
  const dark = variant === "dark";
  const vk = variant === "vaikuntha";
  const t = useT();
  const featured = sevas.filter((s) => featuredSlugs.includes(s.slug));
  sevas = sevas.filter((s) => !featuredSlugs.includes(s.slug));
  return (
    <>
    {featured.length > 0 && (
      <div className={`mx-auto grid gap-5 md:grid-cols-2 md:gap-6 ${featured.length > 4 ? "max-w-6xl lg:grid-cols-3" : "max-w-4xl"} ${sevas.length ? "mb-6 md:mb-8" : ""}`}>
        {featured.map((seva) => (
          <div
            key={seva.slug}
            id={`seva-card-${seva.slug}`}
            className={`fs-premium-border vkd-card-3d rounded-[28px] p-[2px] scroll-mt-24 ${theme.glow} ${highlightedSlug === seva.slug ? "ring-2 ring-vk-500 ring-offset-2" : ""}`}
          >
            <article className={`relative flex h-full flex-col overflow-hidden rounded-[26px] ${theme.bg}`}>
              {featuredStyle === "midnight" && <div aria-hidden className="pointer-events-none absolute -top-24 left-1/2 h-64 w-96 -translate-x-1/2 rounded-full bg-amber-400/20 blur-3xl" />}
              <div className="fs-shimmer pointer-events-none absolute inset-0 z-10" aria-hidden />
              <PetalFall count={12} gold className="z-10" />
              <span aria-hidden className="pointer-events-none absolute left-2.5 top-2.5 z-20 h-6 w-6 rounded-tl-2xl border-l-2 border-t-2 border-amber-300" />
              <span aria-hidden className="pointer-events-none absolute right-2.5 top-2.5 z-20 h-6 w-6 rounded-tr-2xl border-r-2 border-t-2 border-amber-300" />
              <div className={`relative overflow-hidden ${featuredStyle === "heaven" || featuredStyle === "diya" ? "aspect-[1.92/1]" : "aspect-[3/2]"}`}>
                <Image src={seva.image} alt={t(seva.title)} fill sizes="(min-width: 768px) 440px, 100vw" className="object-cover" />
                {featuredStyle !== "heaven" && featuredStyle !== "diya" && <div className={`absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t ${theme.fade} to-transparent`} />}
                {featuredBadge && <span className={`absolute left-4 top-4 rounded-full border px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.14em] shadow-lg ${theme.badge}`}>
                  ✦ {t("Special Seva")}
                </span>}
              </div>
              <div className="relative z-20 flex items-center gap-3 px-5 pt-3">
                <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border text-2xl ${theme.icon}`} aria-hidden>
                  {seva.icon}
                </span>
                <div>
                  <h3 className={`text-xl font-bold leading-tight md:text-2xl ${theme.title}`}>{t(seva.title)}</h3>
                  {seva.tagline && <p className={`text-[12.5px] font-medium ${theme.tagline}`}>{t(seva.tagline)}</p>}
                </div>
              </div>
              <div className="relative z-20 flex flex-1 flex-col px-5 pb-5 pt-3">
                <p className={`text-[13.5px] leading-relaxed ${theme.body}`}>{t(seva.description)}</p>
                <div className="mt-auto grid grid-cols-3 gap-2 pt-4">
                  {seva.tiers.map((tier) => (
                    <button
                      key={tier.amount}
                      type="button"
                      onClick={() => onSelect({ seva, amount: tier.amount })}
                      className={`flex min-h-[56px] flex-col items-center justify-center rounded-xl border px-1 py-1.5 text-center transition-all duration-200 hover:-translate-y-0.5 hover:border-transparent hover:bg-gradient-gold hover:shadow-gold [&:hover_span]:text-ink ${theme.tile}`}
                    >
                      <span className={`whitespace-nowrap text-[17px] font-extrabold leading-none tracking-tight sm:text-lg ${theme.amount}`} style={{ fontFamily: "var(--font-heading)" }}>
                        <span className={`mr-px text-[0.85em] ${theme.rupee}`}>₹</span>
                        {formatAmount(tier.amount)}
                      </span>
                      {impacts[seva.slug]?.[tier.amount] && (
                        <span className="mt-1 block text-[10.5px] font-semibold leading-[1.2] text-ink/60 sm:text-[11px]">{t(impacts[seva.slug][tier.amount])}</span>
                      )}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => onSelect({ seva, amount: null })}
                  className={`mt-3 flex min-h-[46px] w-full items-center justify-center gap-1.5 rounded-xl px-3 py-3 text-[13.5px] font-extrabold shadow-lg transition-all hover:brightness-110 ${theme.cta}`}
                >
                  <span>{t("Donate Other Amount")}</span>
                </button>
              </div>
            </article>
          </div>
        ))}
      </div>
    )}
    {sevas.length > 0 && (
    <div className={`mx-auto flex flex-wrap justify-center gap-5 md:gap-6 ${dark ? "max-w-[78rem]" : "max-w-6xl"}`}>
      {sevas.map((seva) => (
        <article
          key={seva.slug}
          id={`seva-card-${seva.slug}`}
          className={`group flex w-full scroll-mt-24 flex-col overflow-hidden transition-all duration-300 sm:w-[calc(50%-0.75rem)] ${sevas.length > 4 ? "lg:w-[calc(33.333%-1rem)]" : "lg:w-[calc(25%-1.2rem)]"} ${
            dark
              ? "relative rounded-3xl border border-amber-300/40 bg-[linear-gradient(180deg,rgba(40,30,110,0.85),rgba(12,16,66,0.95))] shadow-[0_0_0_1px_rgba(255,200,90,0.08),0_24px_60px_-24px_rgba(0,0,0,0.9),0_0_40px_-18px_rgba(255,170,40,0.55)] hover:-translate-y-1.5 hover:border-amber-300/80 hover:shadow-[0_0_0_1px_rgba(255,200,90,0.3),0_30px_70px_-20px_rgba(0,0,0,0.9),0_0_60px_-10px_rgba(255,170,40,0.6)]"
              : vk
                ? "vkd-card-3d rounded-[1.75rem] border border-[hsl(var(--gold)/0.6)] bg-white shadow-[0_22px_55px_-26px_rgba(30,58,138,0.55)] lg:w-[calc(33.333%-1rem)]"
                : "vk-card border-t-[3px] border-t-[hsl(var(--gold))] hover:shadow-lift lg:w-[calc(33.333%-1rem)]"
          } ${
            highlightedSlug === seva.slug ? "ring-2 ring-vk-500 ring-offset-2" : ""
          }`}
        >
          <div className={`relative h-44 overflow-hidden bg-vk-900 md:h-48 ${dark ? "m-2 rounded-2xl ring-1 ring-amber-300/40" : vk ? "mx-3 mt-3 rounded-2xl shadow-[0_10px_26px_-14px_rgba(30,58,138,0.6)] ring-2 ring-[hsl(var(--gold)/0.75)]" : ""}`}>
            <Image
              src={seva.image}
              alt={t(seva.title)}
              fill
              sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {!vk && <div className={`absolute inset-0 bg-gradient-to-t ${dark ? "from-[#0a1042] via-[#0a1042]/25" : "from-vk-900/90 via-vk-900/30"} to-transparent`} />}
            {!vk && (
              <div className="absolute bottom-3 left-4 right-4 flex items-center gap-2">
                <span className="text-2xl drop-shadow" aria-hidden>
                  {seva.icon}
                </span>
                <h3 className="text-lg font-bold text-white drop-shadow-md md:text-xl">{t(seva.title)}</h3>
              </div>
            )}
          </div>

          {vk && (
            <div className="px-5 pt-4 text-center">
              <h3 className="font-heading text-[1.35rem] font-extrabold leading-tight text-vk-800">
                <span className="mr-1.5 align-middle text-xl" aria-hidden>
                  {seva.icon}
                </span>
                {t(seva.title)}
              </h3>
              <span aria-hidden className="mx-auto mt-2 block h-[2px] w-20 rounded-full bg-gradient-to-r from-transparent via-[hsl(var(--gold))] to-transparent" />
            </div>
          )}

          <div className="flex flex-1 flex-col p-4 sm:p-5">
            <p className={`min-h-[40px] text-[13px] leading-relaxed md:text-sm ${dark ? "text-white/70" : vk ? "text-center text-ink/70" : "text-muted-foreground"}`}>{t(seva.description)}</p>
            <div className={`space-y-2.5 ${vk ? "mt-auto pt-4" : "mt-4"}`}>
              <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                {seva.tiers.map((tier) => (
                  <button
                    key={tier.amount}
                    type="button"
                    onClick={() => onSelect({ seva, amount: tier.amount })}
                    className={`group/amt flex min-h-[64px] flex-col items-center justify-center rounded-xl border-[1.5px] px-1 py-2 text-center shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-transparent hover:bg-gradient-gold hover:shadow-gold sm:min-h-[68px] sm:px-1.5 ${dark ? "border-amber-300/45 bg-gradient-to-b from-amber-300/15 to-amber-300/[0.03] shadow-[inset_0_1px_0_rgba(255,236,170,0.25)]" : vk ? "border-[hsl(var(--gold)/0.7)] bg-gradient-to-b from-white to-[hsl(var(--gold)/0.16)]" : "border-[hsl(var(--gold)/0.6)] bg-[hsl(var(--gold)/0.1)]"}`}
                  >
                    <span
                      className={`block whitespace-nowrap text-[17px] font-extrabold leading-none tracking-tight group-hover/amt:text-ink sm:text-lg ${dark ? "text-white" : vk ? "text-vk-800" : "text-ink"}`}
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      <span className={`mr-px text-[0.85em] group-hover/amt:text-ink ${dark ? "text-amber-300" : "text-[hsl(var(--gold-deep))]"}`}>₹</span>
                      {formatAmount(tier.amount)}
                    </span>
                    {impacts[seva.slug]?.[tier.amount] && (
                      <span className={`mt-1.5 block text-[10.5px] font-semibold leading-[1.2] group-hover/amt:text-ink/80 sm:text-[11px] ${dark ? "text-white/60" : "text-ink/60"}`}>
                        {t(impacts[seva.slug][tier.amount])}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => onSelect({ seva, amount: null })}
                className={`flex min-h-[44px] w-full items-center justify-center gap-1.5 rounded-xl ${vk ? "" : "border border-dashed"} px-3 py-3 text-[13px] font-bold transition-all duration-200 ${dark ? "border-amber-300/60 bg-amber-300/10 text-amber-100 hover:border-amber-300 hover:bg-amber-300/20" : vk ? "bg-gradient-to-r from-vk-700 via-vk-600 to-vk-700 text-white shadow-md hover:brightness-110" : "border-vk-300 bg-vk-50 text-vk-800 hover:border-vk-500 hover:bg-vk-100"}`}
              >
                <svg className={`h-3 w-3 ${dark ? "text-amber-300" : vk ? "text-amber-300" : "text-vk-600"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                <span>{t("Donate Other Amount")}</span>
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
    )}
    </>
  );
}
