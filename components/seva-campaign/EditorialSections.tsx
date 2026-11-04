"use client";

import { useRef, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { Eyebrow, LINE, SERIF } from "@/components/blogs/parts";
import type { SevaCampaignConfig } from "@/lib/sevaCampaignConfig";

/**
 * The warm, editorial look for a seva campaign page (cream ground, serif titles, gold
 * accents). Used by pages that set `theme: "editorial"`; the donation form itself is not
 * part of this and stays exactly as it is.
 */

const rise = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55 },
};

function EdHeading({ eyebrow, title, light = false }: { eyebrow: string; title: ReactNode; light?: boolean }) {
  return (
    <div className="mb-9 text-center md:mb-12">
      <div className="flex justify-center">
        <Eyebrow light={light}>{eyebrow}</Eyebrow>
      </div>
      <h2
        className={`${SERIF} mx-auto mt-3 max-w-3xl text-[1.75rem] font-semibold leading-tight md:text-[2.4rem] ${
          light ? "text-white" : "text-ink"
        }`}
      >
        {title}
      </h2>
    </div>
  );
}

export function EdHero({ config, onDonate }: { config: SevaCampaignConfig; onDonate: () => void }) {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-full bg-[radial-gradient(60%_80%_at_50%_0%,rgba(47,91,211,0.07),transparent_70%)]"
      />
      <div className="vk-container relative pb-6 pt-10 text-center md:pb-10 md:pt-14">
        <div className="flex justify-center">
          <Eyebrow>{config.heroTagline}</Eyebrow>
        </div>
        <h1 className={`${SERIF} mx-auto mt-4 max-w-4xl text-[2.2rem] font-semibold leading-[1.12] text-ink sm:text-5xl lg:text-[3.4rem]`}>
          {config.heroHeading1}
          <span className="mt-1 block italic text-vk-600">{config.heroHeading2}</span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-relaxed text-ink/65 md:text-lg">{config.heroDesc}</p>

        {config.stats && config.stats.length > 0 && (
          <div
            className={`mx-auto mt-8 grid max-w-2xl divide-x divide-[#E4E9F7] rounded-2xl border ${LINE} bg-white/75 py-4 shadow-[0_18px_40px_-30px_rgba(30,58,138,0.5)]`}
            style={{ gridTemplateColumns: `repeat(${config.stats.length}, minmax(0, 1fr))` }}
          >
            {config.stats.map((s) => (
              <div key={s.label} className="px-3">
                <div className={`${SERIF} text-2xl font-semibold text-vk-600 md:text-3xl`}>{s.value}</div>
                <div className="mt-0.5 text-[11px] font-medium uppercase tracking-[0.08em] text-ink/55 md:text-xs">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        <button type="button" onClick={onDonate} className="vk-btn-gold mt-8 h-12 px-9 text-[15px] font-bold">
          <Heart className="h-4 w-4 fill-current" /> {config.about.ctaLabel}
        </button>
      </div>
    </section>
  );
}

export function EdAbout({ config, onDonate }: { config: SevaCampaignConfig; onDonate: () => void }) {
  return (
    <section className="py-12 md:py-20">
      <div className="vk-container">
        <motion.div {...rise} className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2 md:gap-16">
          <div className="relative mx-auto w-full max-w-md md:max-w-none">
            <div aria-hidden className="absolute -inset-3 translate-x-3 translate-y-3 rounded-[2rem] border border-vk-200" />
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-[#EEF2FF] shadow-[0_34px_70px_-38px_rgba(30,58,138,0.65)]">
              <Image src={config.about.image} alt={config.pageTitle} fill unoptimized sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
            </div>
          </div>
          <div>
            <Eyebrow>{config.about.eyebrow}</Eyebrow>
            <h2 className={`${SERIF} mt-3 text-[1.9rem] font-semibold leading-tight text-ink md:text-[2.5rem]`}>{config.about.heading}</h2>
            <div className="mt-5 space-y-4">
              {config.about.paragraphs.map((p, i) => (
                <p key={i} className="text-[15.5px] leading-[1.85] text-ink/70">
                  {p}
                </p>
              ))}
            </div>
            {config.about.pullQuote && (
              <blockquote className={`${SERIF} mt-6 rounded-r-2xl border-l-4 border-vk-300 bg-[#F5F7FF] px-5 py-4 italic text-[#1b2440]`}>
                <span className="text-lg leading-snug">&ldquo;{config.about.pullQuote.text}&rdquo;</span>
                <footer className="mt-2 text-xs not-italic tracking-wide text-vk-600">{config.about.pullQuote.by}</footer>
              </blockquote>
            )}
            <button type="button" onClick={onDonate} className="vk-btn-gold mt-7 h-12 px-8">
              <Heart className="h-4 w-4 fill-current" /> {config.about.ctaLabel}
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function EdImpact({ config }: { config: SevaCampaignConfig }) {
  return (
    <section className="border-y border-[#E4E9F7] bg-white/60 py-12 md:py-20">
      <div className="vk-container">
        <EdHeading eyebrow="Why it matters" title={`The significance of ${config.pageTitle}`} />
        <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {config.impactItems.map((item, i) => (
            <motion.div
              key={item.title}
              {...rise}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className={`relative overflow-hidden rounded-2xl border ${LINE} bg-white p-6 shadow-[0_18px_36px_-30px_rgba(30,58,138,0.5)]`}
            >
              <span className={`${SERIF} absolute right-4 top-2 text-5xl font-semibold text-vk-300`}>{String(i + 1).padStart(2, "0")}</span>
              <span className="mb-4 grid h-11 w-11 place-items-center rounded-full bg-[#F5F7FF] text-vk-600">
                <item.icon className="h-5 w-5" />
              </span>
              <h3 className={`${SERIF} text-[1.15rem] font-semibold leading-snug text-ink`}>{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/65">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function EdFeatures({ config }: { config: SevaCampaignConfig }) {
  return (
    <section className="py-12 md:py-20">
      <div className="vk-container">
        <EdHeading eyebrow="What your offering does" title="Where your donation goes" />
        <motion.div
          {...rise}
          className={`mx-auto grid max-w-5xl overflow-hidden rounded-[1.75rem] border ${LINE} bg-white shadow-[0_24px_50px_-36px_rgba(30,58,138,0.55)] sm:grid-cols-2`}
        >
          {config.features.map((f, i) => (
            <div
              key={f.title}
              className={`flex gap-4 p-6 md:p-7 ${i % 2 === 0 ? "sm:border-r" : ""} ${i < config.features.length - 2 ? "border-b" : i < config.features.length - 1 ? "border-b sm:border-b-0" : ""} border-[#E4E9F7]`}
            >
              <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#F5F7FF] text-vk-600">
                <f.icon className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <h3 className={`${SERIF} text-[1.1rem] font-semibold leading-snug text-ink`}>{f.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink/65">{f.text}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export function EdPrivileges({ config, onDonate }: { config: SevaCampaignConfig; onDonate: () => void }) {
  return (
    <section className="pb-12 md:pb-20">
      <div className="vk-container">
        <div className="relative isolate mx-auto max-w-6xl overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-[#1F2A5C] to-[#141B3F] px-5 py-12 md:px-12 md:py-16">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(50%_60%_at_85%_0%,rgba(47,91,211,0.12),transparent_70%)]"
          />
          <EdHeading light eyebrow="Our gratitude to every donor" title="Donor privileges" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
            {config.privileges.map((p, i) => (
              <motion.div
                key={p.title}
                {...rise}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="rounded-2xl border border-[#2F5BD3]/25 bg-white/[0.06] p-5"
              >
                <span className="mb-4 grid h-11 w-11 place-items-center rounded-full bg-[#2F5BD3]/15 text-[#BFD0FF]">
                  <p.icon className="h-5 w-5" />
                </span>
                <h3 className={`${SERIF} text-[1.1rem] font-semibold text-white`}>{p.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-white/70">{p.text}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-9 text-center">
            <button type="button" onClick={onDonate} className="vk-btn-gold h-12 px-10">
              <Heart className="h-4 w-4 fill-current" /> Donate Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export function EdTestimonials({ config }: { config: SevaCampaignConfig }) {
  const ref = useRef<HTMLDivElement>(null);
  const btn =
    "flex h-11 w-11 items-center justify-center rounded-full border border-[#D5DDF5] bg-white text-vk-700 transition hover:border-vk-600 hover:bg-vk-50";
  return (
    <section className="border-t border-[#E4E9F7] bg-white/60 py-12 md:py-20">
      <div className="vk-container">
        <div className="mb-9 flex items-end justify-between gap-4 md:mb-12">
          <div>
            <Eyebrow>What our devotees say</Eyebrow>
            <h2 className={`${SERIF} mt-3 text-[1.75rem] font-semibold leading-tight text-ink md:text-[2.4rem]`}>Voices of devotion</h2>
          </div>
          <div className="hidden shrink-0 gap-2 sm:flex">
            <button type="button" aria-label="Scroll left" onClick={() => ref.current?.scrollBy({ left: -400, behavior: "smooth" })} className={btn}>
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button type="button" aria-label="Scroll right" onClick={() => ref.current?.scrollBy({ left: 400, behavior: "smooth" })} className={btn}>
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div ref={ref} className="vk-scroller -mx-4 px-4 pb-6 sm:mx-0 sm:px-0">
          {config.testimonials.map((t) => (
            <figure
              key={t.name}
              className={`flex w-[84%] max-w-[400px] shrink-0 flex-col rounded-2xl border ${LINE} bg-white p-6 shadow-[0_18px_36px_-30px_rgba(30,58,138,0.5)] sm:w-96 md:p-7`}
            >
              <span aria-hidden className={`${SERIF} text-6xl leading-none text-vk-300`}>&ldquo;</span>
              <blockquote className={`${SERIF} -mt-2 mb-6 flex-1 text-[1.02rem] italic leading-relaxed text-ink/85`}>{t.quote}</blockquote>
              <figcaption className="flex items-center gap-3 border-t border-[#E4E9F7] pt-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#F5F7FF] text-sm font-bold text-vk-600">
                  {t.name
                    .split(" ")
                    .map((w) => w[0])
                    .join("")
                    .slice(0, 2)}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-ink">{t.name}</span>
                  <span className="block text-xs text-ink/55">{t.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function EdReadMore({ config }: { config: SevaCampaignConfig }) {
  if (!config.readMore?.length) return null;
  return (
    <section className="py-12 md:py-20">
      <div className="vk-container">
        <EdHeading eyebrow="Keep reading" title={config.readMoreHeading ?? "Keep reading"} />
        <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {config.readMore.map((r) => (
            <Link
              key={r.href}
              href={r.href}
              className={`group flex flex-col rounded-2xl border ${LINE} bg-white p-6 shadow-[0_18px_36px_-30px_rgba(30,58,138,0.5)] transition-all hover:-translate-y-1 hover:border-vk-600/40`}
            >
              <h3 className={`${SERIF} text-[1.1rem] font-semibold leading-snug text-ink transition-colors group-hover:text-vk-700`}>{r.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-ink/65">{r.text}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-vk-700">
                Read article <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
