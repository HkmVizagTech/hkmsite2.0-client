"use client";

import Image from "next/image";
import { useT } from "@/components/i18n/LocaleProvider";
import type { Seva } from "@/lib/sevaConfig";

export type SevaSelection = { seva: Seva; amount: number | null };

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
}: {
  sevas: Seva[];
  impacts?: Record<string, Record<number, string>>;
  highlightedSlug?: string | null;
  onSelect: (selection: SevaSelection) => void;
  /** "dark" = glowing gold-edged cards for the night-sky festival pages (Diwali). */
  variant?: "light" | "dark";
}) {
  const dark = variant === "dark";
  const t = useT();
  return (
    <div className={`mx-auto flex flex-wrap justify-center gap-5 md:gap-6 ${dark ? "max-w-[78rem]" : "max-w-6xl"}`}>
      {sevas.map((seva) => (
        <article
          key={seva.slug}
          id={`seva-card-${seva.slug}`}
          className={`group flex w-full scroll-mt-24 flex-col overflow-hidden transition-all duration-300 sm:w-[calc(50%-0.75rem)] lg:w-[calc(25%-1.2rem)] ${
            dark
              ? "relative rounded-3xl border border-amber-300/40 bg-[linear-gradient(180deg,rgba(40,30,110,0.85),rgba(12,16,66,0.95))] shadow-[0_0_0_1px_rgba(255,200,90,0.08),0_24px_60px_-24px_rgba(0,0,0,0.9),0_0_40px_-18px_rgba(255,170,40,0.55)] hover:-translate-y-1.5 hover:border-amber-300/80 hover:shadow-[0_0_0_1px_rgba(255,200,90,0.3),0_30px_70px_-20px_rgba(0,0,0,0.9),0_0_60px_-10px_rgba(255,170,40,0.6)]"
              : "vk-card border-t-[3px] border-t-[hsl(var(--gold))] hover:shadow-lift lg:w-[calc(33.333%-1rem)]"
          } ${
            highlightedSlug === seva.slug ? "ring-2 ring-vk-500 ring-offset-2" : ""
          }`}
        >
          <div className={`relative h-44 overflow-hidden bg-vk-900 md:h-48 ${dark ? "m-2 rounded-2xl ring-1 ring-amber-300/40" : ""}`}>
            <Image
              src={seva.image}
              alt={t(seva.title)}
              fill
              sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className={`absolute inset-0 bg-gradient-to-t ${dark ? "from-[#0a1042] via-[#0a1042]/25" : "from-vk-900/90 via-vk-900/30"} to-transparent`} />
            <div className="absolute bottom-3 left-4 right-4 flex items-center gap-2">
              <span className="text-2xl drop-shadow" aria-hidden>
                {seva.icon}
              </span>
              <h3 className="text-lg font-bold text-white drop-shadow-md md:text-xl">{t(seva.title)}</h3>
            </div>
          </div>

          <div className="flex flex-1 flex-col p-4 sm:p-5">
            <p className={`min-h-[40px] text-[13px] leading-relaxed md:text-sm ${dark ? "text-white/70" : "text-muted-foreground"}`}>{t(seva.description)}</p>
            <div className="mt-4 space-y-2.5">
              <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                {seva.tiers.map((tier) => (
                  <button
                    key={tier.amount}
                    type="button"
                    onClick={() => onSelect({ seva, amount: tier.amount })}
                    className={`group/amt flex min-h-[64px] flex-col items-center justify-center rounded-xl border-[1.5px] px-1 py-2 text-center shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-transparent hover:bg-gradient-gold hover:shadow-gold sm:min-h-[68px] sm:px-1.5 ${dark ? "border-amber-300/45 bg-gradient-to-b from-amber-300/15 to-amber-300/[0.03] shadow-[inset_0_1px_0_rgba(255,236,170,0.25)]" : "border-[hsl(var(--gold)/0.6)] bg-[hsl(var(--gold)/0.1)]"}`}
                  >
                    <span
                      className={`block whitespace-nowrap text-[17px] font-extrabold leading-none tracking-tight group-hover/amt:text-ink sm:text-lg ${dark ? "text-white" : "text-ink"}`}
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
                className={`flex min-h-[44px] w-full items-center justify-center gap-1.5 rounded-xl border border-dashed px-3 py-3 text-[13px] font-bold transition-all duration-200 ${dark ? "border-amber-300/60 bg-amber-300/10 text-amber-100 hover:border-amber-300 hover:bg-amber-300/20" : "border-vk-300 bg-vk-50 text-vk-800 hover:border-vk-500 hover:bg-vk-100"}`}
              >
                <svg className={`h-3 w-3 ${dark ? "text-amber-300" : "text-vk-600"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
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
  );
}
