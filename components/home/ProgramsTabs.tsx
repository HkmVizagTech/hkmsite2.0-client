"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, BookOpen, Building2, HandHeart, PartyPopper, Utensils, Beef, type LucideIcon } from "lucide-react";
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

/** GVD "Programs & Activities" — vertical tab list on the left, story + photo strip on the right. */
export default function ProgramsTabs() {
  const t = useT();
  const [active, setActive] = useState(programs[0].key);
  const p = programs.find((x) => x.key === active) || programs[0];

  return (
    <section className="vk-section vk-band">
      <div className="vk-container">
        <SectionHeading
          align="center"
          eyebrow={t("Get Involved")}
          title={t("Programs & Activities")}
          subtitle={t("Discover the spiritual programmes and seva opportunities that bring Krishna consciousness to Visakhapatnam every day.")}
        />
        <div className="grid gap-6 lg:grid-cols-[280px_1fr] lg:gap-10">
          {/* Tabs */}
          <div
            role="tablist"
            aria-label={t("Programs")}
            className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-hide lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0"
          >
            {programs.map((x) => {
              const on = x.key === active;
              return (
                <button
                  key={x.key}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  aria-controls={`program-${x.key}`}
                  onClick={() => setActive(x.key)}
                  className={`flex shrink-0 items-center gap-3 rounded-2xl px-4 py-3 text-left text-[15px] font-semibold transition-all ${
                    on
                      ? "bg-vk-700 text-white shadow-[0_12px_24px_-12px_rgba(30,58,138,0.7)]"
                      : "bg-white text-ink/80 shadow-sm hover:text-vk-700"
                  }`}
                >
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                      on ? "bg-white/15 text-white" : "bg-vk-100 text-vk-700"
                    }`}
                  >
                    <x.icon className="h-4 w-4" />
                  </span>
                  {t(x.label)}
                </button>
              );
            })}
          </div>

          {/* Panel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={p.key}
              id={`program-${p.key}`}
              role="tabpanel"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="min-w-0"
            >
              <h3 className="vk-h3 md:!text-[1.75rem]">{t(p.title)}</h3>
              <p className="vk-lead mt-3 max-w-3xl">{t(p.text)}</p>
              <div className="vk-scroller -mx-4 mt-6 px-4 lg:mx-0 lg:px-0">
                {p.images.map((img) => (
                  <div
                    key={img.src}
                    className="vk-tile relative h-56 w-[70%] shrink-0 sm:w-[46%] md:h-64 md:w-[32%]"
                  >
                    <Image src={img.src} alt={t(img.caption)} fill sizes="(min-width: 768px) 300px, 70vw" className="object-cover" />
                    <p className="vk-tile-caption text-base font-bold">{t(img.caption)}</p>
                  </div>
                ))}
              </div>
              <Link href={p.href} className="vk-btn-primary mt-6">
                {t(p.cta)} <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
