"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { useT } from "@/components/i18n/LocaleProvider";
import { COUNCIL, type CouncilMember } from "@/lib/governance";

/*
 * Governance, in the "ivory & ink" look (deliberately different from the Srila Prabhupada page's navy, rays and
 * arch): warm ivory paper, deep-ink serif type, hairline gold rules, and transparent portrait cut-outs that rise out
 * of their tiles.
 */
export const IVORY = "#FBF7EE";
export const INK = "#0F1E4A";
const ease = [0.22, 0.8, 0.3, 1] as const;

/** Small caps eyebrow with a gold hairline in front. */
export function Eyebrow({ children, center = false }: { children: React.ReactNode; center?: boolean }) {
  return (
    <p className={`flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.28em] text-[#A87A1E] ${center ? "justify-center" : ""}`}>
      <span aria-hidden className="h-px w-8 bg-[#C9962B]" />
      {children}
      {center && <span aria-hidden className="h-px w-8 bg-[#C9962B]" />}
    </p>
  );
}

/** A cut-out portrait standing in front of an ink disc ringed with fine gold lines; the head rises above the disc. */
export function Medallion({ m, size, priority = false }: { m: CouncilMember; size: string; priority?: boolean }) {
  return (
    <div className="relative mx-auto aspect-square w-full">
      <svg aria-hidden viewBox="0 0 200 200" className="absolute inset-0 h-full w-full">
        <circle cx="100" cy="112" r="88" fill="none" stroke="#C9962B" strokeOpacity=".35" strokeWidth=".6" />
        <circle cx="100" cy="112" r="94" fill="none" stroke="#C9962B" strokeOpacity=".2" strokeWidth=".5" strokeDasharray="1 3" />
      </svg>
      <div className="absolute inset-x-[9%] bottom-0 top-[18%] overflow-hidden rounded-full bg-[radial-gradient(80%_80%_at_50%_25%,#2A4BA8_0%,#14286A_55%,#0A1640_100%)] shadow-[0_30px_60px_-30px_rgba(15,30,74,.7)]" />
      {/* the cut-out is clipped only at the bottom, so the head can rise above the disc */}
      <div className="absolute inset-x-0 bottom-0 top-0 overflow-hidden" style={{ clipPath: "inset(0 0 0 0 round 0 0 50% 50%)" }}>
        <Image src={m.cutout} alt={m.name} fill quality={90} priority={priority} sizes={size} className="object-contain object-bottom drop-shadow-[0_12px_18px_rgba(10,22,64,.35)]" />
      </div>
    </div>
  );
}

function CouncilCard({ m, i }: { m: CouncilMember; i: number }) {
  const t = useT();
  const reduce = useReducedMotion();
  return (
    <motion.li
      initial={reduce ? false : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.75, ease, delay: (i % 4) * 0.08 }}
    >
      <Link href={`/governance/${m.slug}`} className="group block">
        {/* the whole card is the portrait; name and role sit on a deep band across its foot */}
        <div className="relative isolate aspect-[3/4] overflow-hidden rounded-[1.4rem] bg-[radial-gradient(95%_70%_at_50%_18%,#3157C0_0%,#16307A_55%,#0A1640_100%)] shadow-[0_30px_60px_-34px_rgba(15,30,74,.85)] ring-1 ring-[#C9962B]/0 transition-all duration-500 [transform:translateZ(0)] group-hover:-translate-y-1 group-hover:shadow-[0_40px_70px_-34px_rgba(15,30,74,.95)] group-hover:ring-[#E9C46A]/80">
          <span aria-hidden className="absolute left-1/2 top-[4%] h-[44%] w-[80%] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(246,199,82,.22),rgba(90,130,240,.12)_55%,transparent)]" />
          <svg aria-hidden viewBox="0 0 120 160" className="absolute inset-0 h-full w-full"><circle cx="60" cy="40" r="34" fill="none" stroke="#F6C752" strokeOpacity=".28" strokeWidth=".4" /><circle cx="60" cy="40" r="41" fill="none" stroke="#F6C752" strokeOpacity=".14" strokeWidth=".3" strokeDasharray="1 2" /></svg>
          <div className="absolute -inset-x-[14%] -bottom-[2%] top-[3%] transition-transform duration-700 ease-out group-hover:scale-[1.04]" style={{ transformOrigin: "50% 30%" }}>
            <Image src={m.cutout} alt={m.name} fill quality={90} sizes="(min-width: 1280px) 420px, (min-width: 768px) 42vw, 64vw" className="object-cover object-top drop-shadow-[0_14px_16px_rgba(5,10,30,.45)]" />
          </div>
          <span className="absolute right-3 top-3 rounded-full bg-[#FBF7EE]/95 px-2.5 py-1 text-[10.5px] font-bold text-[#0F1E4A] shadow">
            {m.years}+ {t("yrs")}
          </span>
          {/* caption band */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#081236] via-[#0A1640]/90 to-transparent px-4 pb-4 pt-16 md:px-5 md:pb-5">
            <h3 className="font-heading text-[16px] font-bold leading-tight text-white md:text-[19px]">{m.name}</h3>
            <p className="mt-1 line-clamp-2 min-h-[2.5em] text-[11.5px] leading-snug text-white/70 md:text-[12.5px]">{t(m.roles[0])}</p>
            <span className="mt-3 flex items-center justify-between border-t border-white/15 pt-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[#F6C752] md:text-[12px]">
              {t("View profile")}
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F6C752] text-[#0F1E4A] transition-transform duration-300 group-hover:rotate-45"><ArrowUpRight className="h-4 w-4" /></span>
            </span>
          </div>
        </div>
      </Link>
    </motion.li>
  );
}

/** Cut-out proportions (width / height), so each figure gets a box of exactly its shape. */
const ASPECT: Record<string, number> = {
  "sri-madhu-pandit-dasa": 1478 / 1377, "sri-chanchalapathi-dasa": 1375 / 1384, "sri-jai-chaitanya-dasa": 1196 / 1400,
  "sri-stoka-krishna-swami": 1141 / 1400, "sri-amitasana-krishna-swami": 1218 / 1395, "sri-vasudev-keshav-dasa": 862 / 863,
  "sri-rajiv-lochan-dasa": 1148 / 1400, "sri-satya-gaura-chandra-swami": 1324 / 1400, "sri-suvyakta-narasimha-dasa": 639 / 744,
};
// [slug, centre x %, height %, bottom %] — front row of five with the Chairman in the middle, four standing behind
const BACK: [string, number, number, number][] = [
  ["sri-vasudev-keshav-dasa", 21, 65, 21], ["sri-rajiv-lochan-dasa", 40, 65, 21],
  ["sri-satya-gaura-chandra-swami", 60, 65, 21], ["sri-suvyakta-narasimha-dasa", 79, 65, 21],
];
const FRONT: [string, number, number, number][] = [
  ["sri-stoka-krishna-swami", 12, 75, 0], ["sri-chanchalapathi-dasa", 30.5, 75, 0], ["sri-madhu-pandit-dasa", 50, 81, 0],
  ["sri-jai-chaitanya-dasa", 69.5, 75, 0], ["sri-amitasana-krishna-swami", 88, 75, 0],
];

/** The council as a group portrait: large, crisp cut-outs; each person links to their profile and shows their name on hover. */
function CouncilGroup() {
  const reduce = useReducedMotion();
  const figure = ([slug, x, h, b]: [string, number, number, number], row: number, k: number) => {
    const m = COUNCIL.find((c) => c.slug === slug);
    if (!m) return null;
    const ar = ASPECT[slug] ?? 0.85;
    return (
      <motion.div
        key={slug}
        initial={reduce ? false : { opacity: 0, y: 40, x: "-50%" }}
        animate={{ opacity: 1, y: 0, x: "-50%" }}
        transition={{ duration: 1.1, ease, delay: 0.25 + row * 0.15 + Math.abs(k - (row ? 2 : 1.5)) * 0.08 }}
        className="group/f absolute"
        style={{ left: `${x}%`, bottom: `${b}%`, height: `${h}%`, aspectRatio: String(ar), zIndex: row ? 20 - Math.abs(k - 2) : 10 }}
      >
        <Link href={`/governance/${m.slug}`} aria-label={m.name} className="relative block h-full w-full">
          <Image src={m.cutout} alt={m.name} fill quality={90} priority sizes="(min-width: 1280px) 400px, 32vw"
            className={`object-contain object-bottom transition-[filter] duration-500 group-hover/f:brightness-110 ${row ? "drop-shadow-[0_-10px_30px_rgba(0,0,0,.35)]" : "brightness-[.9]"}`} />
          <span className="pointer-events-none absolute left-1/2 top-[-7%] z-[60] -translate-x-1/2 whitespace-nowrap rounded-full bg-[#0F1E4A]/90 px-3.5 py-1.5 text-[12px] font-semibold text-[#FBF7EE] opacity-0 shadow-[0_8px_24px_rgba(0,0,0,.4)] ring-1 ring-[#E9C46A]/50 backdrop-blur transition duration-300 group-hover/f:opacity-100">
            {m.name}
          </span>
        </Link>
      </motion.div>
    );
  };
  return (
    <div className="relative mx-auto mt-6 aspect-[1280/480] w-full max-w-[1400px] md:mt-0">
      {/* soft spotlight behind the group */}
      <div aria-hidden className="absolute inset-x-[10%] bottom-[10%] top-[5%] rounded-[50%] bg-[radial-gradient(closest-side,rgba(127,155,239,.28),transparent)]" />
      {BACK.map((f, k) => figure(f, 0, k))}
      {FRONT.map((f, k) => figure(f, 1, k))}
    </div>
  );
}

export default function GovernanceView() {
  const t = useT();
  const reduce = useReducedMotion();
  const [chair, ...rest] = COUNCIL;

  return (
    <PageLayout background={IVORY}>
      <div className="overflow-x-clip pt-[var(--header-h)]" style={{ background: IVORY }}>
        {/* ══ HERO: the council photograph edge to edge, its own deep-teal sky continued upward behind the title,
              and its warm lower edge melting into the ivory page ══ */}
        <section className="relative isolate overflow-hidden" style={{ background: "linear-gradient(180deg,#0A1233 0%,#0F1E4A 45%,#172B6E 100%)" }}>
          <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(60%_55%_at_50%_70%,rgba(47,91,211,.55)_0%,rgba(30,58,138,.25)_45%,transparent_78%),radial-gradient(40%_45%_at_50%_0%,rgba(201,150,43,.14),transparent_70%)]" />
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease }}
            className="vk-container relative z-10 pt-10 text-center md:pt-14"
          >
            <p className="flex items-center justify-center gap-3 text-[11px] font-bold uppercase tracking-[0.3em] text-[#E9C46A]">
              <span aria-hidden className="h-px w-8 bg-[#E9C46A]/70" />{t("Hare Krishna Movement")}<span aria-hidden className="h-px w-8 bg-[#E9C46A]/70" />
            </p>
            <h1 className="mt-4 font-heading text-[3rem] font-bold leading-none tracking-tight text-[#FBF7EE] [text-shadow:0_6px_30px_rgba(0,0,0,.5)] md:text-[6.2rem]">{t("Governance")}</h1>
            <p className="mt-4 text-[13px] font-semibold uppercase tracking-[0.22em] text-[#FBF7EE]/60 md:text-sm">{t("The Governing Council of the Hare Krishna Movement")}</p>
          </motion.div>

          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, ease, delay: 0.1 }}
            className="relative mt-4 md:-mt-2"
          >
            {/* our own two-row group built from the HD cut-outs (all screen sizes) */}
            <CouncilGroup />
            <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-50 h-[9%] bg-gradient-to-b from-transparent via-[#FBF7EE]/60 to-[#FBF7EE]" />
          </motion.div>
        </section>

        {/* intro, set like a lead paragraph */}
        <section className="relative pb-4 pt-8 md:pt-10">
          <div className="vk-container">
            <motion.div initial={reduce ? false : { opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease }} className="mx-auto max-w-3xl text-center">
              <div aria-hidden className="mx-auto flex items-center justify-center gap-2 text-[#C9962B]">
                <span className="h-px w-16 bg-gradient-to-r from-transparent to-[#C9962B]" />◆<span className="h-px w-16 bg-gradient-to-l from-transparent to-[#C9962B]" />
              </div>
              <p className="mt-6 font-heading text-xl leading-[1.6] text-[#0F1E4A] md:text-[1.7rem] md:leading-[1.55]">
                {t("Every movement thrives through inspired leadership. These are the torchbearers, teachers, and guides who transform timeless wisdom into living practice, bringing Krishna consciousness to life across the world.")}
              </p>
            </motion.div>
          </div>
        </section>

        {/* ══ THE CHAIRMAN ══ */}
        <section className="py-16 md:py-24">
          <div className="vk-container">
            <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.15fr_.85fr] lg:gap-16">
              <motion.div initial={reduce ? false : { opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.8, ease }} className="order-2 lg:order-1">
                <Eyebrow>{t("Chairman")}</Eyebrow>
                <h2 className="mt-4 font-heading text-4xl font-bold leading-[1.05] text-[#0F1E4A] md:text-6xl">{chair.name}</h2>
                <p className="mt-5 text-[16px] leading-8 text-[#0F1E4A]/75 md:text-[17px]">{chair.summary}</p>
                <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                  {chair.roles.map((r) => (
                    <li key={r} className="flex gap-3 border-l-2 border-[#C9962B] pl-3 text-[14px] font-semibold leading-snug text-[#0F1E4A]">{t(r)}</li>
                  ))}
                </ul>
                {chair.honours.length > 0 && (
                  <p className="mt-6 text-[12px] font-bold uppercase leading-6 tracking-[0.16em] text-[#A87A1E]">
                    {chair.honours.join("  ·  ")}
                  </p>
                )}
                <Link href={`/governance/${chair.slug}`} className="group mt-8 inline-flex items-center gap-2 rounded-full bg-[#0F1E4A] px-6 py-3 text-sm font-bold text-[#FBF7EE] transition hover:bg-[#1E3A8A]">
                  {t("Read his story")} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>
              <motion.div initial={reduce ? false : { opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 1, ease }} className="relative order-1 mx-auto w-full max-w-[340px] md:max-w-[420px] lg:order-2">
                <Medallion m={chair} size="420px" priority />
                <div className="absolute -left-2 bottom-6 rounded-2xl bg-white px-4 py-3 text-center shadow-[0_20px_40px_-20px_rgba(15,30,74,.5)] ring-1 ring-[#E7DCC3] md:-left-6">
                  <p className="font-heading text-3xl font-bold leading-none text-[#0F1E4A]">{chair.years}</p>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#A87A1E]">{t("Years of devotion")}</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ══ THE COUNCIL ══ */}
        <section className="border-t border-[#E7DCC3] bg-white py-16 md:py-24">
          <div className="vk-container">
            <div className="mx-auto mb-12 max-w-2xl text-center md:mb-16">
              <Eyebrow center>{t("Governing Council")}</Eyebrow>
              <h2 className="mt-4 font-heading text-3xl font-bold leading-tight text-[#0F1E4A] md:text-5xl">{t("Guided by devotion, serving with excellence")}</h2>
            </div>
            <ul className="mx-auto grid max-w-7xl grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
              {rest.map((m, i) => <CouncilCard key={m.slug} m={m} i={i} />)}
            </ul>
          </div>
        </section>

        {/* ══ CLOSING ══ */}
        <section className="py-16 md:py-24" style={{ background: IVORY }}>
          <div className="vk-container text-center">
            <p aria-hidden className="font-heading text-7xl leading-none text-[#C9962B]/60">&ldquo;</p>
            <p className="mx-auto -mt-4 max-w-3xl font-heading text-2xl italic leading-snug text-[#0F1E4A] md:text-[2.2rem]">
              {t("The real need is to awaken our love for Krishna.")}
            </p>
            <p className="mt-5 text-xs font-bold uppercase tracking-[0.24em] text-[#A87A1E]">— {t("Srila Prabhupada")}</p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Link href="/founder" className="inline-flex items-center gap-2 rounded-full bg-[#0F1E4A] px-6 py-3 text-sm font-bold text-[#FBF7EE] hover:bg-[#1E3A8A]">{t("Our Founder-Acharya")} <ArrowRight className="h-4 w-4" /></Link>
              <Link href="/about" className="inline-flex items-center rounded-full px-6 py-3 text-sm font-bold text-[#0F1E4A] ring-1 ring-[#0F1E4A]/25 hover:ring-[#0F1E4A]">{t("About us")}</Link>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
