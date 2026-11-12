"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useReducedMotion } from "framer-motion";
import { ArrowRight, BookOpen, Building2, ChevronDown, HandHeart, PartyPopper, Utensils, Beef, type LucideIcon } from "lucide-react";
import SectionHeading from "@/components/site/SectionHeading";
import { useT } from "@/components/i18n/LocaleProvider";

interface Program {
  key: string;
  label: string;
  icon: LucideIcon;
  title: string;
  text: string;
  href: string;
  cta: string;
  images: { src: string; caption: string }[];
}

// Real photos of our own programmes from the site's media library (R2) —
// keep this section free of AI-generated imagery.
const MEDIA = "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library";

const programs: Program[] = [
  {
    key: "food",
    label: "Food Distribution",
    icon: Utensils,
    title: "Subhojanam & Anna Daan",
    text: "Through Subhojanam we serve fresh, sanctified meals to school children and the underprivileged across Visakhapatnam every single day. Krishna prasadam nourishes both body and soul — no one within our reach should go hungry.",
    href: "/subhojanam",
    cta: "Support Subhojanam",
    images: [
      { src: `${MEDIA}/1783677363792-1783677363601-462395264797134589073566144398536696847591n.jpg`, caption: "Subhojanam" },
      { src: `${MEDIA}/1786100757954-1786100756855-annadan2.jpg`, caption: "Anna Daan" },
      { src: `${MEDIA}/1786100757417-1786100756787-annadan4.jpg`, caption: "Prasadam distribution" },
    ],
  },
  {
    key: "cow",
    label: "Cow Protection",
    icon: Beef,
    title: "Gau Seva",
    text: "Lord Krishna is Gopala, the protector of cows. Our Gau Seva cares for the temple cows with fodder, green grass, shelter and medical attention — a seva dear to the Lord.",
    href: "/gau-seva",
    cta: "Offer Gau Seva",
    images: [
      { src: "/assets/donations-gau-seva-real.jpeg", caption: "Temple cows" },
    ],
  },
  {
    key: "education",
    label: "Education",
    icon: BookOpen,
    title: "Bhagavad-gita & Value Education",
    text: "Bhagavad-gita classes, Srimad-Bhagavatam discourses and value-education programmes bring the timeless wisdom of the Vedas to students, families and professionals. Gita Daan places the Gita in thousands of hands.",
    href: "/gita-daan-seva",
    cta: "Sponsor Gita Daan",
    images: [
      { src: `${MEDIA}/1789641526855-1789641525984-GlimpsesfromthemostexcitingVanabhojanameventconductedatourHareKrishnaVaikunthamte1.jpg`, caption: "Spiritual discourse" },
      { src: `${MEDIA}/1789641526472-1789641525685-GlimpsesfromKrishnaPulseYouthFestivalKrishnaPulsebroughttogether1200studentsfor.jpg`, caption: "Krishna Pulse youth festival" },
    ],
  },
  {
    key: "festivals",
    label: "Festivals",
    icon: PartyPopper,
    title: "Grand Festivals",
    text: "From Sri Krishna Janmashtami and Radhashtami to Govardhan Puja and Rath Yatra, our festivals fill Gambheeram with kirtan, abhishekam, drama and prasadam for thousands of guests.",
    href: "/festival",
    cta: "See festivals",
    images: [
      { src: "/assets/home-event-janmashtami.webp", caption: "Janmashtami" },
      { src: "/assets/home-event-radhashtami.webp", caption: "Radhashtami" },
      { src: `${MEDIA}/1788955236457-1788955235882-HighlightsoftheGrandAbhishekamatGadirajuPalacejanmashtamiSriKrishnaJanmashtamiLord.jpg`, caption: "Grand Abhishekam" },
    ],
  },
  {
    key: "community",
    label: "Volunteering",
    icon: HandHeart,
    title: "Serve with the Community",
    text: "Volunteers are the heart of every festival and seva — from prasadam distribution to decorations and guest care. Offer your time and talents in the service of the Lord.",
    href: "/volunteer",
    cta: "Become a volunteer",
    images: [
      { src: `${MEDIA}/1789641527236-1789641526047-GlimpsesfromthemostexcitingVanabhojanameventconductedatourHareKrishnaVaikunthamte.jpg`, caption: "Vanabhojanam" },
      { src: `${MEDIA}/1786100757653-1786100756788-annadan3.jpg`, caption: "Seva volunteers" },
    ],
  },
  {
    key: "temple",
    label: "Our Projects",
    icon: Building2,
    title: "Hare Krishna Vaikuntham Temple",
    text: "A grand new temple for Sri Sri Radha Madan Mohan is rising in Visakhapatnam. Square Foot and Brick Seva let every devotee become a part of building the Lord's home.",
    href: "/sqft-seva-campaign",
    cta: "Join Mandir Nirman",
    images: [
      { src: "/assets/construction-update-1.jpg", caption: "Foundation" },
      { src: "/assets/construction-update-3.jpg", caption: "Structure" },
      { src: "/assets/construction-update-5.jpg", caption: "Progress" },
    ],
  },
];

const ADVANCE_MS = 7000;

/**
 * "Programs & Activities" as expanding photo panels. On computers six tall panels sit side by side; the open one
 * widens to tell its story and the rest become narrow strips with a vertical label. On phones they stack and the
 * open one grows in height. They advance on their own (with a gold progress line) until someone hovers or taps.
 */
export default function ProgramsTabs() {
  const t = useT();
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [held, setHeld] = useState(false);
  // which of the open programme's photos fills the panel (its thumbnails switch it)
  const [pic, setPic] = useState(0);

  useEffect(() => {
    if (reduce || held) return;
    const id = setTimeout(() => {
      setPic(0);
      setActive((a) => (a + 1) % programs.length);
    }, ADVANCE_MS);
    return () => clearTimeout(id);
  }, [active, held, reduce]);

  const open = (i: number) => {
    if (i !== active) setPic(0);
    setActive(i);
    setHeld(true);
  };

  const Content = ({ p, compact = false }: { p: Program; compact?: boolean }) => (
    <>
      <span className="inline-flex items-center gap-2 rounded-full bg-[#F6C752] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[#1A1240]">
        <p.icon className="h-3.5 w-3.5" /> {t(p.label)}
      </span>
      <h3 className={`mt-3 font-serif-display font-bold leading-tight text-[#FFE6A3] ${compact ? "text-2xl" : "text-[2.1rem]"}`}>{t(p.title)}</h3>
      <p className={`mt-2 text-white/80 ${compact ? "line-clamp-4 text-[14px] leading-relaxed" : "line-clamp-3 text-[15px] leading-relaxed"}`}>{t(p.text)}</p>
      {p.images.length > 1 && (
        <div className="mt-4 flex gap-2">
          {p.images.slice(0, 4).map((img, k) => (
            <button
              key={img.src}
              type="button"
              aria-label={t("Show photo: {caption}", { caption: t(img.caption) })}
              aria-pressed={k === pic}
              onClick={(e) => {
                e.stopPropagation();
                setPic(k);
                setHeld(true);
              }}
              className={`relative h-14 w-20 overflow-hidden rounded-lg transition-all md:h-16 md:w-24 ${k === pic ? "ring-2 ring-[#F6C752] ring-offset-2 ring-offset-[#0A1640]" : "opacity-75 ring-1 ring-white/40 hover:opacity-100"}`}
            >
              <Image src={img.src} alt="" fill sizes="96px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
      <Link href={p.href} className="vk-btn-gold mt-5 w-fit" onClick={(e) => e.stopPropagation()}>
        {t(p.cta)} <ArrowRight className="h-4 w-4" />
      </Link>
    </>
  );

  return (
    <section className="vk-section vk-band">
      <div className="vk-container">
        <SectionHeading
          align="center"
          eyebrow={t("Get Involved")}
          title={t("Programs & Activities")}
          subtitle={t("Discover the spiritual programmes and seva opportunities that bring Krishna consciousness to Visakhapatnam every day.")}
        />

        <div role="tablist" aria-label={t("Programs")} className="flex flex-col gap-3 lg:h-[540px] lg:flex-row" onMouseLeave={() => setHeld(false)}>
          {programs.map((p, i) => {
            const on = i === active;
            return (
              <div
                key={p.key}
                role="tab"
                tabIndex={0}
                aria-selected={on}
                aria-label={t(p.label)}
                onClick={() => open(i)}
                onMouseEnter={() => open(i)}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), open(i))}
                className={`group relative cursor-pointer overflow-hidden rounded-[1.75rem] bg-[#0A1640] shadow-[0_24px_50px_-28px_rgba(10,22,64,.8)] ring-1 ring-[#F6C752]/40 transition-all duration-700 ease-[cubic-bezier(.2,.7,.2,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F6C752] ${
                  on ? "h-[480px] lg:h-auto lg:flex-[5.5]" : "h-[84px] lg:h-auto lg:flex-[1]"
                }`}
              >
                <Image
                  key={on ? p.images[Math.min(pic, p.images.length - 1)].src : p.images[0].src}
                  src={on ? p.images[Math.min(pic, p.images.length - 1)].src : p.images[0].src}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 700px, 100vw"
                  className={`hm-fade object-cover transition-transform duration-[1600ms] ease-out ${on ? "scale-100" : "scale-110 group-hover:scale-105"}`}
                />
                <div className={`absolute inset-0 transition-all duration-700 ${on ? "bg-gradient-to-t from-[#0A1640] via-[#0A1640]/60 to-[#0A1640]/5" : "bg-[#0A1640]/65 group-hover:bg-[#0A1640]/50"}`} />

                {/* number */}
                <span className="absolute left-5 top-4 font-serif-display text-xl font-bold text-[#F6C752] lg:top-5">{String(i + 1).padStart(2, "0")}</span>

                {/* closed: phones show a row, computers a vertical label */}
                <div className={`absolute inset-0 flex items-center gap-3 pl-14 pr-5 transition-opacity duration-300 lg:flex-col lg:justify-end lg:gap-4 lg:p-0 lg:pb-7 ${on ? "pointer-events-none opacity-0" : "opacity-100"}`}>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F6C752]/15 text-[#F6C752] ring-1 ring-[#F6C752]/50">
                    <p.icon className="h-5 w-5" />
                  </span>
                  <span className="whitespace-nowrap text-[15px] font-semibold text-white lg:rotate-180 lg:[writing-mode:vertical-rl]">{t(p.label)}</span>
                  <ChevronDown className="ml-auto h-5 w-5 text-white/70 lg:hidden" />
                </div>

                {/* open: the story */}
                <div className={`absolute inset-x-0 bottom-0 p-5 transition-all duration-500 md:p-8 ${on ? "translate-y-0 opacity-100 delay-300" : "pointer-events-none translate-y-6 opacity-0"}`}>
                  <div className="hidden w-[560px] max-w-full lg:block"><Content p={p} /></div>
                  <div className="lg:hidden"><Content p={p} compact /></div>
                </div>

                {/* gold progress line while it advances on its own */}
                {on && !held && !reduce && (
                  <span key={`bar-${active}`} aria-hidden className="absolute bottom-0 left-0 h-[3px] bg-gradient-to-r from-[#F6C752] to-[#FFE6A3]" style={{ animation: `hm-progress-bar ${ADVANCE_MS}ms linear forwards` }} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
