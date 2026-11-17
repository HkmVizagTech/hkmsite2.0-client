"use client";

import { useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight, ChevronLeft, ChevronRight, Heart, HandHeart, Quote, Sparkles,
  UtensilsCrossed, Leaf, BookOpen, CookingPot, Flame, Wheat, Stethoscope, Home, Gift, Users, Plus, Minus, MessageCircle,
  type LucideIcon,
} from "lucide-react";
import { useT } from "@/components/i18n/LocaleProvider";
import type { SevaCampaignConfig } from "@/lib/sevaCampaignConfig";
import { SCRIPTURES } from "@/components/sqft-campaign/ImportanceSection";
import { SEVA_WHATSAPP_NUMBER } from "@/components/WhatsAppFloatButton";
import useInViewVideo from "@/hooks/useInViewVideo";

/**
 * Presentation for the seva campaign pages (Anna Daan, Gau Seva, Gita Daan):
 * ivory/white grounds, Vaikuntham blue + gold accents, site fonts only.
 * All copy comes from the campaign config; UI labels go through t().
 */

const rise = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.5 },
};

export const IVORY = "bg-[#FBF8F1]";

/**
 * Each seva has its own visual motif: Anna Daan = prasadam plates, Gau Seva = grass/leaf,
 * Gita Daan = books. The journey steps restate what the campaign copy already says.
 */
export interface SevaMotif {
  icon: LucideIcon;
  journeyTitle: string;
  journey: { icon: LucideIcon; title: string; text: string }[];
}

export function sevaMotif(config: SevaCampaignConfig): SevaMotif {
  if (config.slug === "anna-daan-seva") {
    return {
      icon: UtensilsCrossed,
      journeyTitle: "The journey of a meal",
      journey: [
        { icon: CookingPot, title: "Cooked in the temple kitchen", text: "Fresh rice, dal and vegetables are cooked by trained cooks in a hygienic kitchen." },
        { icon: Flame, title: "Offered to the Lord", text: "Every plate is first offered to Lord Krishna, and becomes sanctified prasadam." },
        { icon: Users, title: "Served with love", text: "Prasadam is served to devotees, students and the underprivileged across Visakhapatnam." },
      ],
    };
  }
  if (config.slug === "gita-daan-seva") {
    return {
      icon: BookOpen,
      journeyTitle: "The journey of a Gita",
      journey: [
        { icon: BookOpen, title: "The authentic edition", text: "Bhagavad-Gita As It Is, with Srila Prabhupada's purports." },
        { icon: Gift, title: "Gifted in your name", text: "Dedicate a Gita to a loved one or to an anonymous seeker who awaits its wisdom." },
        { icon: Users, title: "Placed in a seeker's hands", text: "Distributed to students, libraries, prisons, hostels and spiritual centres." },
      ],
    };
  }
  return {
    icon: Leaf,
    journeyTitle: "How your seva cares for the cows",
    journey: [
      { icon: Wheat, title: "Fresh fodder & grass", text: "Fresh, nutritious fodder and green grass for the cows every single day." },
      { icon: Stethoscope, title: "Medical care", text: "Regular veterinary check-ups, vaccines and timely medicines for every cow." },
      { icon: Home, title: "Loving shelter", text: "A clean, loving shelter where the cows live free from fear and distress." },
    ],
  };
}

export function Eyebrow({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return (
    <span
      className={`inline-flex max-w-full items-center gap-2 rounded-full px-3.5 py-1.5 text-[11.5px] font-bold uppercase tracking-[0.14em] ${
        light ? "bg-white/10 text-gold" : "bg-white text-vk-700 ring-1 ring-vk-100"
      }`}
    >
      <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
      <span className="min-w-0">{children}</span>
    </span>
  );
}

export function SectionTitle({
  eyebrow,
  title,
  sub,
  light = false,
  align = "center",
}: {
  eyebrow: string;
  title: ReactNode;
  sub?: string;
  light?: boolean;
  align?: "center" | "left";
}) {
  const center = align === "center";
  return (
    <div className={`mb-8 md:mb-12 ${center ? "text-center" : ""}`}>
      <Eyebrow light={light}>{eyebrow}</Eyebrow>
      <h2
        className={`mt-4 max-w-3xl font-heading text-[1.75rem] font-extrabold leading-[1.15] tracking-tight md:text-[2.5rem] ${
          center ? "mx-auto" : ""
        } ${light ? "text-white" : "text-vk-900"}`}
      >
        {title}
      </h2>
      {sub && (
        <p className={`mt-3 max-w-2xl text-[15px] leading-relaxed md:text-base ${center ? "mx-auto" : ""} ${light ? "text-white/70" : "text-ink/65"}`}>
          {sub}
        </p>
      )}
    </div>
  );
}

/* ───────────────────────── Hero ───────────────────────── */

/** Hero built around the page's own designed banner: the banner large in a framed card, with a white action
 *  panel (headline, quick facts, buttons) overlapping its lower edge. Falls back to the photo hero below. */
export function EdHero(props: { config: SevaCampaignConfig; onDonate: () => void; onHow: () => void }) {
  const { config, onDonate } = props;
  const t = useT();
  if (!config.bannerImage) return <EdHeroPhoto {...props} />;
  const alt = `${config.pageTitle} — ${config.heroHeading1} ${config.heroHeading2}`;
  return (
    <section className="relative isolate bg-white">
      {/* Full-bleed banner, edge to edge at every screen width. */}
      <div className="relative">
        <motion.button
          type="button" onClick={onDonate} aria-label={t("Donate — go to the donation form")}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}
          className="relative block w-full focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-vk-300"
        >
          <Image src={config.bannerImageMobile || config.bannerImage} alt={alt} width={config.bannerMobileWidth ?? 941} height={config.bannerMobileHeight ?? 1672}
            priority sizes="100vw" className="block h-auto w-full md:hidden" />
          <Image src={config.bannerImage} alt={alt} width={config.bannerWidth ?? 1672} height={config.bannerHeight ?? 941}
            priority sizes="100vw" className="hidden h-auto w-full md:block" />
        </motion.button>
      </div>

      {/* Gold ornamental divider into the page */}
      <div aria-hidden className="flex items-center justify-center gap-3 px-6 pt-6 md:pt-8">
        <span className="h-px w-full max-w-[220px] bg-gradient-to-r from-transparent via-gold/60 to-gold" />
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rotate-45 bg-gold/70" />
          <span className="h-2.5 w-2.5 rotate-45 border border-gold bg-[#FFF3D6]" />
          <span className="h-1.5 w-1.5 rotate-45 bg-gold/70" />
        </span>
        <span className="h-px w-full max-w-[220px] bg-gradient-to-l from-transparent via-gold/60 to-gold" />
      </div>
      {/* The banner carries the visuals; the heading stays for search engines and screen readers. */}
      <h1 className="sr-only">{t(config.heroHeading1)} {t(config.heroHeading2)}</h1>
    </section>
  );
}

function EdHeroPhoto({ config, onDonate, onHow }: { config: SevaCampaignConfig; onDonate: () => void; onHow: () => void }) {
  const t = useT();
  const lead = config.stats?.[0];
  const side = config.gallery.photos.filter((p) => p.src !== config.heroImage).slice(0, 2);
  return (
    <section className={`relative overflow-hidden ${IVORY}`}>
      <div aria-hidden className="pointer-events-none absolute -right-40 -top-40 h-[28rem] w-[28rem] rounded-full border border-gold/20" />
      <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-[20rem] w-[20rem] rounded-full border border-gold/15" />
      <div className="vk-container relative grid items-center gap-8 py-6 md:py-12 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:py-16">
        {/* Photo — first on phones */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative lg:order-last"
        >
          <div aria-hidden className="pointer-events-none absolute -inset-6 -z-0 rounded-full bg-[radial-gradient(closest-side,rgba(246,199,82,0.35),transparent)] blur-2xl" />
          <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] bg-vk-100 shadow-[0_30px_70px_-36px_rgba(10,18,51,0.6)] lg:aspect-[5/6]">
            <Image
              src={config.heroImage}
              alt={`${config.pageTitle} — ${config.heroHeading2}`}
              fill
              priority
              sizes="(min-width: 1024px) 560px, 100vw"
              className="object-cover"
            />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-vk-900/35 via-transparent to-transparent" />
          </div>
          {side.length > 0 && (
            <div className="absolute -right-2 top-4 hidden w-[32%] flex-col gap-3 sm:flex lg:-right-5 lg:top-10">
              {side.map((ph, i) => (
                <motion.div
                  key={ph.src}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.25 + i * 0.12 }}
                  className="relative aspect-square overflow-hidden rounded-2xl border-4 border-white bg-vk-100 shadow-[0_18px_40px_-20px_rgba(10,18,51,0.55)]"
                >
                  <Image src={ph.src} alt={t(ph.caption)} fill unoptimized sizes="200px" className="object-cover" />
                </motion.div>
              ))}
            </div>
          )}
          {lead && (
            <div className="absolute -bottom-4 left-4 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-[0_18px_40px_-20px_rgba(10,18,51,0.5)] ring-1 ring-vk-100 sm:left-6 lg:-left-6 lg:bottom-8">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-vk-100 text-vk-700">
                <HandHeart className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block font-heading text-xl font-extrabold leading-none text-vk-900">{lead.value}</span>
                <span className="mt-1 block text-[12.5px] font-medium text-ink/65">{t(lead.label)}</span>
              </span>
            </div>
          )}
        </motion.div>

        {/* Copy */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.05 }}
          className="min-w-0 pt-4 lg:pt-0"
        >
          <Eyebrow>{t(config.heroTagline)}</Eyebrow>
          <h1 className="mt-5 font-heading text-[2.15rem] font-extrabold leading-[1.08] tracking-tight text-vk-900 sm:text-5xl lg:text-[3.5rem]">
            {t(config.heroHeading1)}
            <span className="mt-1 block text-vk-600">{t(config.heroHeading2)}</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-ink/70 md:text-lg">{t(config.heroDesc)}</p>

          {config.stats && config.stats.length > 0 && (
            <dl className="mt-7 grid max-w-xl grid-cols-3 gap-2.5 sm:gap-3">
              {config.stats.map((s) => (
                <div key={s.label} className="min-w-0 rounded-2xl bg-white px-3 py-3.5 text-center ring-1 ring-vk-100 sm:px-4">
                  <dt className="sr-only">{t(s.label)}</dt>
                  <dd className="font-heading text-xl font-extrabold leading-none text-vk-700 sm:text-2xl">{s.value}</dd>
                  <dd className="mt-1.5 break-words text-[11.5px] font-medium leading-tight text-ink/60 sm:text-xs">{t(s.label)}</dd>
                </div>
              ))}
            </dl>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <motion.button
              type="button"
              onClick={onDonate}
              whileTap={{ scale: 0.98 }}
              className="vk-btn-gold h-14 rounded-2xl px-8 text-base font-bold"
            >
              <Heart className="h-4 w-4 fill-current" /> {t(config.about.ctaLabel)}
              <ArrowRight className="h-4 w-4" />
            </motion.button>
            <button
              type="button"
              onClick={onHow}
              className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl border border-vk-200 bg-white px-7 text-[15px] font-semibold text-vk-800 transition hover:border-vk-500 hover:bg-vk-50"
            >
              {t("How your seva helps")}
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ───────────────────────── Story ───────────────────────── */

export function EdAbout({ config, onDonate }: { config: SevaCampaignConfig; onDonate: () => void }) {
  const t = useT();
  return (
    <section className="bg-white py-14 md:py-24">
      <div className="vk-container">
        <motion.div {...rise} className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2 md:gap-16">
          <div className="relative mx-auto w-full max-w-md md:max-w-none">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-vk-100 shadow-[0_34px_70px_-38px_rgba(10,18,51,0.6)]">
              <Image src={config.about.image} alt={t(config.pageTitle)} fill unoptimized sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
            </div>
            <div aria-hidden className="absolute -bottom-4 -right-2 -z-10 h-full w-full rounded-[28px] bg-gold/15 sm:-right-4" />
          </div>
          <div className="min-w-0">
            <Eyebrow>{t(config.about.eyebrow)}</Eyebrow>
            <h2 className="mt-4 font-heading text-[1.85rem] font-extrabold leading-[1.15] tracking-tight text-vk-900 md:text-[2.5rem]">
              {t(config.about.heading)}
            </h2>
            <div className="mt-5 space-y-4">
              {config.about.paragraphs.map((p, i) => (
                <p key={i} className="text-[15.5px] leading-[1.8] text-ink/70 md:text-base">
                  {t(p)}
                </p>
              ))}
            </div>
            {config.about.pullQuote && (
              <figure className={`mt-7 rounded-2xl ${IVORY} p-5 ring-1 ring-gold/30`}>
                <Quote aria-hidden className="h-6 w-6 text-gold" />
                <blockquote className="mt-2 font-heading text-lg font-semibold leading-snug text-vk-900">
                  {t(config.about.pullQuote.text)}
                </blockquote>
                <figcaption className="mt-2 text-[13px] font-medium text-vk-600">— {t(config.about.pullQuote.by)}</figcaption>
              </figure>
            )}
            <button type="button" onClick={onDonate} className="vk-btn-gold mt-8 h-14 rounded-2xl px-8 text-base font-bold">
              <Heart className="h-4 w-4 fill-current" /> {t(config.about.ctaLabel)}
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ───────────────────────── Why it matters ───────────────────────── */

export function EdImpact({ config }: { config: SevaCampaignConfig }) {
  const t = useT();
  return (
    <section className={`${IVORY} py-14 md:py-24`}>
      <div className="vk-container">
        <SectionTitle eyebrow={t("Why it matters")} title={t("The significance of {seva}", { seva: t(config.pageTitle) })} />
        <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {config.impactItems.map((item, i) => (
            <motion.div
              key={item.title}
              {...rise}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              whileHover={{ y: -4 }}
              className="relative flex gap-4 rounded-3xl bg-white p-5 shadow-[0_18px_40px_-30px_rgba(10,18,51,0.45)] ring-1 ring-vk-100 sm:block sm:p-6"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-vk-100 text-vk-700 sm:mb-5">
                <item.icon className="h-5 w-5" />
              </span>
              <span aria-hidden className="absolute right-5 top-5 font-heading text-sm font-bold text-vk-200">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <h3 className="font-heading text-[17px] font-bold leading-snug text-vk-900">{t(item.title)}</h3>
                <p className="mt-1.5 text-[14.5px] leading-relaxed text-ink/65">{t(item.text)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── How it works + where it goes ───────────────────────── */

export function EdFeatures({ config }: { config: SevaCampaignConfig }) {
  const t = useT();
  const motif = sevaMotif(config);
  // One distinct photo per step: gallery photos first, then the hero image, so no step repeats a picture.
  const g = config.gallery.photos;
  const photos = [...g.slice(1), ...g.slice(0, 1), ...(config.heroImage ? [{ src: config.heroImage, caption: config.pageTitle }] : [])];
  return (
    <section id="how-it-works" className="scroll-mt-28 bg-white py-14 md:py-24">
      <div className="vk-container">
        <SectionTitle eyebrow={t("How it works")} title={t(motif.journeyTitle)} sub={t("From your offering to the one it serves — every step done as service to Lord Krishna.")} />

        <ol className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {[...motif.journey, { icon: Sparkles, title: "Your name in the sankalpa", text: "Your name is included in the sankalpa and offered during aarti to Their Lordships." }].map((s, i, all) => {
            const photo = photos[i] ?? null;
            const last = i === all.length - 1;
            return (
              <motion.li
                key={s.title}
                {...rise}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`relative flex flex-col overflow-hidden rounded-3xl ring-1 bg-white ring-vk-100 shadow-[0_18px_40px_-30px_rgba(10,18,51,0.45)]`}
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  {photo ? (
                    <Image src={photo.src} alt={t(photo.caption)} fill unoptimized sizes="(max-width: 640px) 100vw, 25vw" className="object-cover" />
                  ) : (
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(246,199,82,0.35),transparent_60%)]" />
                  )}
                  <span className="absolute left-4 top-4 flex h-9 items-center gap-1.5 rounded-full bg-white/95 px-3 font-heading text-[13px] font-extrabold text-vk-900 shadow">
                    <span className="text-gold-deep">{String(i + 1).padStart(2, "0")}</span>
                    <s.icon aria-hidden className="h-4 w-4 text-vk-600" />
                  </span>
                </div>
                <div className="flex-1 p-5">
                  <h3 className={`font-heading text-[17px] font-bold leading-snug text-vk-900`}>{t(s.title)}</h3>
                  <p className={`mt-1.5 text-[14.5px] leading-relaxed text-ink/65`}>{t(s.text)}</p>
                </div>
                {!last && (
                  <span aria-hidden className="absolute -right-3 top-[31%] z-10 hidden h-7 w-7 items-center justify-center rounded-full bg-gold text-vk-900 shadow lg:flex">
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                )}
              </motion.li>
            );
          })}
        </ol>

        <div className={`mx-auto mt-14 max-w-6xl rounded-[28px] ${IVORY} p-5 md:mt-20 md:p-10`}>
          <h3 className="text-center font-heading text-xl font-extrabold text-vk-900 md:text-2xl">{t("Where your donation goes")}</h3>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 md:mt-8 md:gap-4">
            {config.features.map((f, i) => (
              <motion.div
                key={f.title}
                {...rise}
                transition={{ duration: 0.45, delay: i * 0.06 }}
                className="flex gap-4 rounded-2xl bg-white p-4 ring-1 ring-vk-100 md:p-5"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold/15 text-gold-deep">
                  <f.icon className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <h4 className="font-heading text-base font-bold text-vk-900">{t(f.title)}</h4>
                  <p className="mt-1 text-[14.5px] leading-relaxed text-ink/65">{t(f.text)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Donor privileges ───────────────────────── */

export function EdPrivileges({ config, onDonate }: { config: SevaCampaignConfig; onDonate: () => void }) {
  const t = useT();
  return (
    <section className="bg-white pb-14 md:pb-24">
      <div className="vk-container">
        <div className="relative isolate mx-auto max-w-6xl overflow-hidden rounded-[28px] bg-gradient-to-br from-vk-100 via-vk-50 to-white px-5 py-12 ring-1 ring-vk-200 md:px-12 md:py-16">
          <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 -z-10 h-72 w-72 rounded-full border border-gold/30" />
          <div aria-hidden className="pointer-events-none absolute -bottom-32 -left-20 -z-10 h-72 w-72 rounded-full border border-vk-200" />
          <SectionTitle eyebrow={t("Our gratitude to every donor")} title={t("Donor privileges")} />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
            {config.privileges.map((p, i) => (
              <motion.div
                key={p.title}
                {...rise}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                className="rounded-3xl bg-white p-5 shadow-[0_18px_40px_-32px_rgba(47,91,211,0.45)] ring-1 ring-vk-100 md:p-6"
              >
                <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-gold/15 text-gold">
                  <p.icon className="h-5 w-5" />
                </span>
                <h3 className="font-heading text-[17px] font-bold text-vk-900">{t(p.title)}</h3>
                <p className="mt-1.5 text-[14.5px] leading-relaxed text-ink/65">{t(p.text)}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <button type="button" onClick={onDonate} className="vk-btn-gold h-14 rounded-2xl px-10 text-base font-bold">
              <Heart className="h-4 w-4 fill-current" /> {t("Donate Now")}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Testimonials ───────────────────────── */

export function EdTestimonials({ config }: { config: SevaCampaignConfig }) {
  const t = useT();
  const ref = useRef<HTMLDivElement>(null);
  const btn =
    "flex h-11 w-11 items-center justify-center rounded-full bg-white text-vk-700 ring-1 ring-vk-200 transition hover:bg-vk-50 hover:ring-vk-500";
  return (
    <section className={`${IVORY} py-14 md:py-24`}>
      <div className="vk-container">
        <div className="flex items-end justify-between gap-4">
          <SectionTitle align="left" eyebrow={t("What our devotees say")} title={t("Voices of devotion")} />
          <div className="mb-12 hidden shrink-0 gap-2 sm:flex">
            <button type="button" aria-label={t("Scroll left")} onClick={() => ref.current?.scrollBy({ left: -400, behavior: "smooth" })} className={btn}>
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button type="button" aria-label={t("Scroll right")} onClick={() => ref.current?.scrollBy({ left: 400, behavior: "smooth" })} className={btn}>
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div ref={ref} className="vk-scroller -mx-4 px-4 pb-6 sm:mx-0 sm:px-0">
          {config.testimonials.map((q) => (
            <figure
              key={q.name}
              className="flex w-[86%] max-w-[400px] shrink-0 flex-col rounded-3xl bg-white p-6 shadow-[0_18px_40px_-30px_rgba(10,18,51,0.45)] ring-1 ring-vk-100 sm:w-96 md:p-7"
            >
              <Quote aria-hidden className="h-7 w-7 text-gold" />
              <blockquote className="mb-6 mt-3 flex-1 text-[15px] leading-relaxed text-ink/80">{t(q.quote)}</blockquote>
              <figcaption className="flex items-center gap-3 border-t border-vk-100 pt-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-vk-100 font-heading text-sm font-bold text-vk-700">
                  {q.name
                    .split(" ")
                    .map((w) => w[0])
                    .join("")
                    .slice(0, 2)}
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-heading text-[15px] font-bold text-vk-900">{q.name}</span>
                  <span className="block text-[13px] text-ink/55">{t(q.role)}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Keep reading ───────────────────────── */

export function EdReadMore({ config }: { config: SevaCampaignConfig }) {
  const t = useT();
  if (!config.readMore?.length) return null;
  return (
    <section className="bg-white py-14 md:py-24">
      <div className="vk-container">
        <SectionTitle eyebrow={t("Keep reading")} title={t(config.readMoreHeading ?? "Keep reading")} />
        {/* Phones: a swipe row so four articles don't make a long stack. Desktop: a four-column grid. */}
        <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-3 scrollbar-hide [scroll-padding-inline:1rem] sm:mx-auto sm:grid sm:max-w-6xl sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4 lg:gap-5">
          {config.readMore.map((r) => (
            <Link
              key={r.href}
              href={r.href}
              className="group flex w-[78%] max-w-[300px] shrink-0 snap-start flex-col overflow-hidden rounded-3xl bg-white shadow-[0_18px_40px_-30px_rgba(47,91,211,0.5)] ring-1 ring-vk-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_26px_50px_-30px_rgba(47,91,211,0.6)] hover:ring-vk-200 sm:w-auto sm:max-w-none"
            >
              <span className="relative block aspect-[16/10] overflow-hidden bg-vk-50">
                {r.image ? (
                  <Image src={r.image} alt="" fill unoptimized sizes="(max-width: 640px) 78vw, (max-width: 1024px) 50vw, 25vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                ) : (
                  <span className="absolute inset-0 flex items-center justify-center text-vk-300"><BookOpen className="h-10 w-10" /></span>
                )}
                {r.category && (
                  <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-vk-700 shadow-sm">{t(r.category)}</span>
                )}
              </span>
              <span className="flex flex-1 flex-col p-4 sm:p-5">
                {r.readTime ? (
                  <span className="mb-1.5 inline-flex items-center gap-1.5 text-[12px] font-medium text-ink/50">
                    <BookOpen className="h-3.5 w-3.5 text-vk-400" /> {t("{n} min read", { n: String(r.readTime) })}
                  </span>
                ) : null}
                <span className="line-clamp-2 font-heading text-[16px] font-bold leading-snug text-vk-900 transition-colors group-hover:text-vk-600">{r.title}</span>
                <span className="mt-1.5 line-clamp-2 flex-1 text-[13.5px] leading-relaxed text-ink/60">{r.text}</span>
                <span className="mt-4 inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-vk-600">
                  {t("Read article")} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── The power of giving (scripture videos) ───────────────────────── */

export function EdScriptures() {
  const t = useT();
  const ref = useRef<HTMLElement>(null);
  useInViewVideo(ref);
  return (
    <section ref={ref} className={`${IVORY} py-14 md:py-24`}>
      <div className="vk-container">
        <SectionTitle eyebrow={t("Sacred scriptures glorify those who support spiritual causes")} title={t("The Power of Giving")} />
        <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-3 scrollbar-hide [scroll-padding-inline:1rem] md:mx-auto md:grid md:max-w-6xl md:grid-cols-3 md:gap-5 md:overflow-visible md:px-0 md:pb-0">
          {SCRIPTURES.map((s, i) => (
            <motion.figure
              key={s.citation}
              {...rise}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group flex w-[82%] max-w-[340px] shrink-0 snap-start flex-col overflow-hidden rounded-3xl bg-white shadow-[0_22px_48px_-34px_rgba(47,91,211,0.5)] ring-1 ring-vk-100 md:w-auto md:max-w-none"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-vk-100">
                {/* The clips have black side bars baked in; a slight zoom crops them out. */}
                <video src={s.video} loop muted playsInline preload="metadata" aria-hidden className="absolute inset-0 h-full w-full scale-[1.14] object-cover transition-transform duration-700 group-hover:scale-[1.19]" />
              </div>
              <div className="relative flex flex-1 flex-col px-5 pb-5 pt-7 md:px-6 md:pb-6">
                <span aria-hidden className="absolute -top-5 left-5 flex h-10 w-10 items-center justify-center rounded-full bg-gold text-vk-900 shadow-[0_8px_18px_-8px_rgba(201,150,43,0.8)] ring-4 ring-white md:left-6">
                  <Quote className="h-4 w-4 fill-current" />
                </span>
                <blockquote className="flex-1 font-heading text-[15.5px] font-medium leading-relaxed text-vk-900 md:text-base">
                  {t(s.text)}
                </blockquote>
                <figcaption className="mt-4 inline-flex items-center gap-1.5 self-start rounded-full bg-vk-50 px-3 py-1.5 text-[12px] font-semibold text-vk-700 ring-1 ring-vk-100">
                  <BookOpen aria-hidden className="h-3.5 w-3.5" /> {s.citation}
                </figcaption>
              </div>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── FAQ ───────────────────────── */

export function EdFaq({ faqs }: { faqs: { q: string; a: string }[] }) {
  const t = useT();
  const [open, setOpen] = useState<number | null>(0);
  if (!faqs.length) return null;
  // FAQPage structured data so Google can show these answers in search.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  return (
    <section className="bg-white py-14 md:py-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="vk-container">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionTitle align="left" eyebrow={t("FAQ")} title={t("Frequently Asked Questions")} sub={t("Quick answers about this seva, payments and your 80G receipt.")} />
            <div className="-mt-4 hidden rounded-3xl bg-gradient-to-br from-vk-100 via-vk-50 to-white p-5 ring-1 ring-vk-200 lg:block">
              <p className="font-heading text-[16px] font-bold text-vk-900">{t("Still have a question?")}</p>
              <p className="mt-1 text-[13.5px] leading-relaxed text-ink/65">{t("Message our seva team on WhatsApp.")}</p>
              <a href={`https://wa.me/${SEVA_WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer"
                className="mt-4 inline-flex h-11 items-center gap-2 rounded-xl bg-white px-4 text-[14px] font-semibold text-vk-700 ring-1 ring-vk-200 transition hover:bg-vk-50">
                <MessageCircle className="h-4 w-4" /> {t("Chat on WhatsApp")}
              </a>
            </div>
          </div>

          <ul className="space-y-3">
            {faqs.map((f, i) => {
              const on = open === i;
              const id = `faq-${i}`;
              return (
                <li key={f.q} className={`overflow-hidden rounded-2xl bg-white ring-1 transition-shadow ${on ? "shadow-[0_18px_40px_-28px_rgba(47,91,211,0.5)] ring-vk-200" : "ring-vk-100 hover:ring-vk-200"}`}>
                  <button type="button" onClick={() => setOpen(on ? null : i)} aria-expanded={on} aria-controls={id}
                    className="flex w-full items-center gap-3 px-4 py-4 text-left sm:gap-4 sm:px-5">
                    <span aria-hidden className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl font-heading text-[13px] font-bold transition-colors ${on ? "bg-vk-500 text-white" : "bg-vk-50 text-vk-600"}`}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className={`min-w-0 flex-1 text-[15px] font-semibold leading-snug ${on ? "text-vk-800" : "text-vk-900"}`}>{t(f.q)}</span>
                    <span aria-hidden className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors ${on ? "bg-vk-100 text-vk-700" : "bg-vk-50 text-vk-500"}`}>
                      {on ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {on && (
                      <motion.div id={id} initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25, ease: "easeOut" }}>
                        <p className="px-4 pb-5 pl-[3.75rem] text-[14.5px] leading-relaxed text-ink/70 sm:px-5 sm:pl-[4.25rem]">{t(f.a)}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>

          <a href={`https://wa.me/${SEVA_WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-2xl bg-gradient-to-br from-vk-100 via-vk-50 to-white p-4 ring-1 ring-vk-200 lg:hidden">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-vk-600 ring-1 ring-vk-100"><MessageCircle className="h-5 w-5" /></span>
            <span className="min-w-0 flex-1">
              <span className="block text-[14.5px] font-bold text-vk-900">{t("Still have a question?")}</span>
              <span className="block text-[12.5px] text-ink/60">{t("Chat with our seva team on WhatsApp")}</span>
            </span>
            <ArrowRight className="h-4 w-4 shrink-0 text-vk-500" />
          </a>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Final call to action ───────────────────────── */

export function EdFinalCta({ config, onDonate }: { config: SevaCampaignConfig; onDonate: () => void }) {
  const t = useT();
  return (
    <section className="bg-white pb-16 pt-4 md:pb-24">
      <div className="vk-container">
        <motion.div
          {...rise}
          className="relative isolate mx-auto max-w-6xl overflow-hidden rounded-[28px] bg-vk-50 px-6 py-12 text-center ring-1 ring-vk-200 md:px-12 md:py-16"
        >
          <Image src={config.heroImage} alt="" fill unoptimized sizes="100vw" className="-z-20 object-cover opacity-20" />
          <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-vk-50/80 to-vk-100/95" />
          <Eyebrow>{t(config.pageTitle)}</Eyebrow>
          <h2 className="mx-auto mt-4 max-w-2xl font-heading text-[1.75rem] font-extrabold leading-[1.15] tracking-tight text-vk-900 md:text-[2.5rem]">
            {t("Be part of this seva today")}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-ink/70 md:text-base">
            {t("Every offering, big or small, is offered to Lord Krishna with love.")}
          </p>
          <button type="button" onClick={onDonate} className="vk-btn-gold mt-8 h-14 rounded-2xl px-10 text-base font-bold">
            <Heart className="h-4 w-4 fill-current" /> {t(config.about.ctaLabel)} <ArrowRight className="h-4 w-4" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
