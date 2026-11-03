"use client";

import PageLayout from "@/components/PageLayout";
import WhatsAppCommunityCTA from "@/components/WhatsAppCommunityCTA";
import SectionHeading from "@/components/site/SectionHeading";
import Reveal from "@/components/site/Reveal";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { animate, AnimatePresence, motion, useInView } from "framer-motion";
import {
  BookOpen, Globe, Award, Heart, Star, Users, Sparkles, MapPin, Ship, Landmark, Quote,
  ArrowRight, ChevronLeft, ChevronRight, Home, Compass, Sprout, Share2, Play, Pause,
} from "lucide-react";

/** Counts up to the numeric part of a stat ("10,000+", "1M+") once it scrolls into view. */
function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const m = value.match(/^(\d[\d,]*)(.*)$/);
  const target = m ? Number(m[1].replace(/,/g, "")) : 0;
  const [n, setN] = useState(target);
  useEffect(() => {
    if (!m || !inView) return;
    setN(0);
    const c = animate(0, target, { duration: 1.6, ease: "easeOut", onUpdate: (v) => setN(Math.round(v)) });
    return () => c.stop();
  }, [inView]);
  if (!m) return <span>{value}</span>;
  return <span ref={ref}>{n.toLocaleString("en-IN")}{m[2]}</span>;
}


const achievements = [
  { icon: Globe, value: "108+", label: "Temples Worldwide" },
  { icon: BookOpen, value: "80+", label: "Books Authored" },
  { icon: Award, value: "40+", label: "Languages Published" },
  { icon: Heart, value: "1M+", label: "Monthly Magazine Copies" },
  { icon: Users, value: "10,000+", label: "Disciples Initiated" },
  { icon: Landmark, value: "14", label: "Times Around the World" },
];

const qualities = [
  { title: "Compassion", desc: "Srila Prabhupada's heart overflowed with compassion for all living beings. He saw everyone as a spirit soul, part and parcel of Krishna." },
  { title: "Determination", desc: "At the age of 70, with nothing but faith, he crossed the ocean to fulfill his spiritual master's desire — a feat of extraordinary resolve." },
  { title: "Humility", desc: "Despite founding a worldwide movement, he always presented himself as a humble servant of his spiritual master." },
  { title: "Scholarship", desc: "He translated and commented on over 80 volumes of India's most important philosophical texts with profound depth and clarity." },
  { title: "Leadership", desc: "He built a global organization from scratch, managing thousands of devotees while maintaining the highest spiritual standards." },
  { title: "Devotion", desc: "Every moment of his life was dedicated to serving Lord Krishna. His personal example of devotion inspired millions worldwide." },
];

const facts = [
  "Srila Prabhupada translated over 60 volumes of Vedic literature, including the Bhagavad-gita, Srimad-Bhagavatam, and Chaitanya Charitamrita.",
  "He circled the globe 14 times in the last 11 years of his life, despite his advanced age.",
  "His books have been translated into 89 languages and distributed in hundreds of millions of copies.",
  "He established 108 temples across six continents in just 11 years.",
  "He initiated over 10,000 disciples during his lifetime.",
  "He introduced the Ratha Yatra festival to cities around the world.",
  "He recorded over 1,500 hours of lectures, conversations, and morning walks.",
  "He established farm communities for simple living and high thinking.",
  "His books are used as standard textbooks in numerous university courses around the world.",
  "He introduced Vedic cuisine (prasadam) to the Western world, establishing vegetarian restaurants globally.",
];

const timeline = [
  { year: "1896", date: "1 September 1896", title: "Birth in Calcutta", desc: "Srila Prabhupada was born and raised in a Vaishnava family in Bengal, Kolkata. His father, Gour Mohan De, and mother, Rajni De, were pure devotees of Lord Krishna. His parents were Gaudiya Vaishnavas and followers of Chaitanya Mahaprabhu, which is why he was familiar with the devotion of Lord Krishna since his childhood.", icon: Star, image: "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1793693936505-birth.jpg" },
  { year: "1922", date: "", title: "First Meeting with his Spiritual Master", desc: "At the age of 26, he met his spiritual master, Srila Bhaktisiddhanta Sarasvati Thakur, a Vaishnava guru and the founder of Gaudiya Math, for the first time in Calcutta. This meeting was a life-changing moment for Srila Prabhupada. He talked about Krishna Consciousness with Srila Bhaktisiddhanta Sarasvati Thakur for hours.", icon: Heart, image: "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1793693937257-first-meet.jpg" },
  { year: "1933", date: "1933", title: "Formal Initiation", desc: "After the meeting with his spiritual master, Srila Prabhupada was deeply inspired by the purity and teachings of his master. He decided to take initiation from Bhaktisiddhanta Sarasvati Thakur, and along with it, he accepted the instruction of his master to spread Krishna Consciousness in the Western World for the rest of his life.", icon: Award, image: "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1793693938020-initiation.jpg" },
  { year: "1944", date: "1944", title: "Launched Magazine: Back to Godhead", desc: "With no financial support, he started to write the Back to Godhead (BTG) magazine. Once finished, he also edited and published this magazine. In it, he talked about the Hare Krishna Movement, including the essence of the Bhagavad Gita, the teachings of Chaitanya Mahaprabhu, the purpose of human life, and more.", icon: BookOpen, image: "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1793693938370-magazine.jpg" },
  { year: "1950", date: "1950", title: "Entered the Third Stage of Life: Vanaprastha", desc: "By the year 1950, Srila Prabhupada entered the third stage of life, vanaprastha ashram. In this stage, a person retires from their household responsibilities and solely focuses on spiritual progress. This was one of his major steps towards the establishment of the Hare Krishna Movement.", icon: Landmark, image: "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1793693941447-vanaprastha.jpg" },
  { year: "1952", date: "1952", title: "Beginning of Preaching", desc: "In 1952, Srila Prabhupada took his very first step by organizing a spiritual center in the city of Jhansi. He started an organization called \"The League of Devotees\" where he gathered devotees to spread the teachings of Bhagavad Gita and the divine mission of Lord Chaitanya, the Hare Krishna Movement.", icon: Users, image: "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1793693939174-preaching.jpg" },
  { year: "1959", date: "1959", title: "Accepted Sannyasa", desc: "By the time he turned 63, he had accepted sannyasa (the renounced order of life) in Mathura and was given the name Bhaktivedanta Swami by his guru. After that, he completely dedicated his life to preaching Krishna Consciousness and spreading the holy names of Lord Krishna, as instructed.", icon: Sparkles, image: "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1793693940188-sannyasa.jpg" },
  { year: "1965", date: "13 August 1965", title: "Journey to America", desc: "In 1965, a historic moment took place when Srila Prabhupada boarded the cargo ship Jaladuta to America. At that time, he was carrying only a couple of spiritual books, including the Bhagavad Gita, his glasses, and just 40 INR (7 US dollars). During this long sea journey, he survived two serious heart attacks.", icon: Ship, image: "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1793693940927-travel-america.jpg" },
  { year: "1966", date: "July 1966", title: "Founded ISKCON", desc: "In his 70th year, he established the International Society for Krishna Consciousness (ISKCON) in New York.", icon: Globe, image: "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1793693937678-founded-iskcon.jpg" },
  { year: "1967", date: "1966 – 1977", title: "Travelled Across the Globe", desc: "Between the ages of 70 and 81, he travelled to other countries and successfully opened over 100 ISKCON Temples. He initiated thousands of disciples and published 80 volumes of his books. He also established the Bhaktivedanta Book Trust.", icon: Compass, image: "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1793693935311-across-globe.jpg" },
  { year: "1970", date: "1970", title: "Krishna Consciousness in Africa", desc: "Srila Prabhupada visited Kenya, Africa, for the first time in the year 1970. He performed Harinaam Sankirtan for the African people. He encouraged his followers to engage with the African people and built a Radha-Krishna Temple in Nairobi. After the installation of the deities, he welcomed everyone to enter the temple.", icon: MapPin, image: "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1793693936026-africa.jpeg" },
  { year: "1971", date: "20–25 June 1971", title: "Krishna Consciousness in Russia", desc: "From 20 to 25 June 1971, Srila Prabhupada visited Moscow to spread Krishna Consciousness. There, he met two people: Professor Grigory Kotovsky and Anatoly Pinyaev. Anatoly Pinyaev helped him translate the Bhagavad Gita As It Is into the Russian language. Later, he accepted Anatoly as his first disciple in Russia and a member of the ISKCON society.", icon: Compass, image: "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1793693939840-russia.jpg" },
  { year: "1977", date: "14 November 1977", title: "Departure", desc: "On November 14, 1977, at the age of 81, he departed from this material world after a long-term illness. He left his body in the Krishna Balaram Temple in Vrindavan. His body was respectfully buried in the temple's courtyard, and his followers built a special memorial shrine (samadhi) there in his honor.", icon: Star, image: "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1793693936904-departure.jpg" },
];

const legacy = [
  { icon: Compass, title: "Understand His Purpose", text: "Look upon his entire journey to America. He didn't travel to a completely different world, at the age of 69, to get fame and recognition. He did it to honor the instruction of his spiritual master and to spread the holy names of Lord Krishna, the Hare Krishna Mahamantra.", href: "#timeline", cta: "Read his journey" },
  { icon: Sprout, title: "Participate and Grow", text: "Get involved in chanting the holy names of Lord Krishna, reading scriptural books, and regularly visiting a Hare Krishna Temple. There's no need to rush; you can start with one round of chanting and one page of the Bhagavad Gita daily. Connect with a community of devotees — it will help you grow in devotion.", href: "/iskcon-vizag-temple", cta: "Plan your visit" },
  { icon: Share2, title: "Share This Gift", text: "Spread this mission of Srila Prabhupada with others by inviting them to kirtan and prasadam distribution, accompanying someone to the Temple on weekends, telling others about the Bhagavad Gita, and inspiring them to start reading it.", href: "/volunteer", cta: "Volunteer with us" },
];

const teachings = [
  { title: "Bhagavad-gita As It Is", desc: "The definitive translation and commentary on the Bhagavad Gita, the Song of God. Over 40 million copies distributed, making it the most widely read edition worldwide." },
  { title: "Srimad-Bhagavatam", desc: "An 18,000-verse magnum opus with translations and illuminating purports spanning 30 volumes, revealing the complete science of God realization." },
  { title: "Sri Chaitanya-charitamrita", desc: "A 17-volume translation of the biography of Lord Chaitanya Mahaprabhu, the golden avatar who inaugurated the congregational chanting movement 500 years ago." },
  { title: "The Nectar of Devotion", desc: "A summary study of Rupa Gosvami's Bhakti-rasamrita-sindhu, explaining the complete science of bhakti yoga in accessible language." },
  { title: "Back to Godhead Magazine", desc: "The flagship publication first started in 1944 in Delhi. Now published monthly in over 40 languages with circulation exceeding one million copies." },
  { title: "The Science of Self-Realization", desc: "A collection of articles and interviews presenting Vedic philosophy for the modern audience, addressing fundamental questions of human existence." },
];

export default function FounderPage() {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [playing, setPlaying] = useState(true);
  const [hovered, setHovered] = useState(false);
  const pillsRef = useRef<HTMLDivElement>(null);
  const cur = timeline[step];
  const upNext = timeline[(step + 1) % timeline.length];

  const go = (to: number, manual = true) => {
    const n = (to + timeline.length) % timeline.length;
    setDir(n >= step ? 1 : -1);
    setStep(n);
    if (manual) setPlaying(false);
  };

  // Gentle auto-advance (pauses on hover / after any manual control; off for reduced-motion users).
  useEffect(() => {
    if (!playing || hovered) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setTimeout(() => {
      setDir(1);
      setStep((v) => (v + 1) % timeline.length);
    }, 6500);
    return () => clearTimeout(id);
  }, [playing, hovered, step]);

  // Keep the active year centred in the pill row (scrolls the row only, never the page).
  useEffect(() => {
    const row = pillsRef.current;
    const el = row?.children[step] as HTMLElement | undefined;
    if (row && el) row.scrollTo({ left: el.offsetLeft - row.clientWidth / 2 + el.clientWidth / 2, behavior: "smooth" });
  }, [step]);
  return (
    <PageLayout>
      <div className="pt-[var(--header-h)]">
        {/* ── HERO ──────────────────────────────────────────────── */}
        <section className="relative isolate overflow-hidden bg-vk-900 text-white">
          <div aria-hidden className="absolute -left-24 top-10 -z-10 h-80 w-80 rounded-full bg-gold/15 blur-3xl" />
          <div aria-hidden className="absolute -bottom-32 right-0 -z-10 h-96 w-96 rounded-full bg-vk-500/30 blur-3xl" />
          <div className="vk-container grid items-center gap-10 py-12 md:py-20 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
            <div>
              <nav aria-label="Breadcrumb" className="mb-6 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white/80 backdrop-blur">
                <Link href="/" className="inline-flex items-center gap-1 hover:text-white"><Home className="h-3.5 w-3.5" />Home</Link>
                <ChevronRight className="h-3.5 w-3.5 opacity-60" />
                <span aria-current="page" className="text-white">About Founder</span>
              </nav>
              <span className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-gold">
                <span className="h-px w-8 bg-gold" /> Founder-Acharya of ISKCON
              </span>
              <h1 className="vk-h1 !text-white">
                His Divine Grace <span className="bg-gradient-to-r from-[#FFD66B] to-[#F5A623] bg-clip-text text-transparent">Srila Prabhupada</span>
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-white/80 md:text-lg">
                The Vishwa Guru who carried the timeless wisdom of the Bhagavad-gita across the world and gave humanity the Hare Krishna Movement.
              </p>
              <div className="mt-6 flex flex-wrap gap-2 text-xs font-semibold text-white/85">
                {["1 September 1896", "14 November 1977", "108+ temples"].map((t) => (
                  <span key={t} className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 backdrop-blur">{t}</span>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#story" className="inline-flex h-12 items-center gap-2 rounded-xl bg-gold px-7 text-sm font-bold text-vk-900 shadow-lift transition hover:brightness-105">
                  Read his story <ArrowRight className="h-4 w-4" />
                </a>
                <a href="#timeline" className="inline-flex h-12 items-center rounded-xl border border-white/30 px-7 text-sm font-semibold text-white transition hover:bg-white/10">
                  Explore the timeline
                </a>
              </div>
            </div>

            <Reveal delay={0.1}>
              <div className="relative mx-auto max-w-sm">
                <div aria-hidden className="absolute -inset-3 rotate-3 rounded-[2rem] border border-gold/50" />
                <div aria-hidden className="absolute -inset-3 -rotate-2 rounded-[2rem] bg-gradient-to-br from-gold/25 to-transparent" />
                <Image
                  src="https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1793693940525-teachings.png"
                  alt="His Divine Grace A.C. Bhaktivedanta Swami Srila Prabhupada"
                  width={338}
                  height={501}
                  priority
                  className="relative h-auto w-full rounded-[1.75rem] object-cover shadow-[0_30px_70px_-20px_rgba(0,0,0,0.7)]"
                />
                <div className="relative -mt-10 mx-3 rounded-2xl border border-white/20 bg-vk-900/80 p-4 text-center shadow-lift backdrop-blur-md">
                  <Quote className="mx-auto mb-1 h-4 w-4 text-gold" />
                  <p className="font-serif-display text-[15px] italic leading-snug text-white">The real need is to awaken our love for Krishna.</p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── BIOGRAPHY — feature split ─────────────────────────── */}
        <section id="story" className="vk-section scroll-mt-24 overflow-x-clip">
          <div className="vk-container grid items-start gap-10 md:grid-cols-5 lg:gap-14">
            <Reveal className="md:col-span-2 md:sticky md:top-[calc(var(--header-h)+1.5rem)]">
              <div className="relative mx-auto max-w-sm md:max-w-none">
                <div aria-hidden className="absolute -inset-3 -z-10 -rotate-3 rounded-[2rem] bg-gradient-to-br from-vk-200/80 via-vk-100/70 to-transparent" />
                <div className="overflow-hidden rounded-3xl shadow-[0_30px_60px_-28px_rgba(30,58,138,0.55)]">
                  <Image
                    src="https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1793324889281-1793324889228-prabhupada-home.avif"
                    alt="Srila Prabhupada"
                    width={400}
                    height={500}
                    className="h-auto w-full object-cover"
                  />
                </div>
                <div className="vk-card relative mx-4 -mt-8 p-4 text-center">
                  <p className="text-sm font-bold text-foreground">A.C. Bhaktivedanta Swami Prabhupada</p>
                  <p className="mt-1 text-xs font-medium text-vk-600">1 September 1896 — 14 November 1977</p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.08} className="md:col-span-3">
              <span className="vk-pill mb-4">About Srila Prabhupada</span>
              <h2 className="vk-h2">The Acharya Who Changed the World</h2>
              <div className="mt-5 space-y-4">
                <p className="vk-lead">
                  His Divine Grace A.C. Bhaktivedanta Swami Prabhupada is the Founder-Acharya of the International Society for Krishna Consciousness (ISKCON) and the greatest ambassador of Vedic knowledge the world has ever seen. He transformed the spiritual landscape of the modern world by single-handedly carrying India&apos;s ancient wisdom to every continent.
                </p>
                <p className="vk-lead">
                  Born on September 1, 1896, in Calcutta, one day after the auspicious festival of Janmashtami, Abhay Charan De showed early signs of spiritual inclination. His father, Gour Mohan De, raised him as a pure Vaishnava devotee. As a child, Abhay organized his own Ratha Yatra festivals, imitating the famous Jagannath procession.
                </p>
                <p className="vk-lead">
                  In 1922, he had a life-changing encounter with his spiritual master, Srila Bhaktisiddhanta Saraswati Goswami, who recognized his potential and instructed him to spread the message of Lord Chaitanya in the English language. This instruction became the guiding force of his entire life.
                </p>
                <p className="vk-lead">
                  After decades of preparation — studying, writing, and cultivating deep spiritual realization — Srila Prabhupada embarked on an unprecedented mission at the age of 69. With nothing but his faith, a trunk of books, and forty rupees, he boarded the cargo ship Jaladuta and set sail for America. The 35-day voyage nearly claimed his life when he suffered two heart attacks, but he was sustained by the grace of Lord Krishna.
                </p>
                <p className="vk-lead">
                  Arriving in New York City in September 1965, he began humbly — chanting under a tree in Tompkins Square Park and giving talks in a tiny storefront on the Lower East Side. Within just eleven years, he built a worldwide confederation of more than 108 temples, rural communities, schools, and restaurants, transforming the lives of thousands.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── ACHIEVEMENTS — stat card ──────────────────────────── */}
        <section className="pb-10 md:pb-16">
          <div className="vk-container">
            <Reveal>
              <div className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-vk-700 via-vk-800 to-vk-900 px-5 py-8 md:px-10 md:py-12">
                <div aria-hidden className="absolute -right-16 -top-16 -z-10 h-56 w-56 rounded-full bg-white/10" />
                <div aria-hidden className="absolute -bottom-20 -left-10 -z-10 h-48 w-48 rounded-full bg-vk-500/20" />
                <div className="grid grid-cols-2 gap-x-4 gap-y-7 md:grid-cols-3 lg:grid-cols-6">
                  {achievements.map((a) => (
                    <div key={a.label} className="text-center">
                      <span className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-white">
                        <a.icon className="h-5 w-5" />
                      </span>
                      <div className="font-heading text-2xl font-extrabold text-white md:text-3xl"><CountUp value={a.value} /></div>
                      <p className="mt-1 text-xs font-medium text-white/70 md:text-[13px]">{a.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── TEACHINGS & MESSENGER ─────────────────────────────── */}
        <section className="vk-section">
          <div className="vk-container space-y-16 md:space-y-24">
            {[
              {
                eyebrow: "His Divine Teachings",
                title: "A life given in service of his guru",
                image: "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1793693938020-initiation.jpg",
                w: 701,
                h: 860,
                alt: "Painting of Srila Prabhupada receiving initiation from his spiritual master, Srila Bhaktisiddhanta Sarasvati",
                body: [
                  "Srila Prabhupada dedicated his entire life to the service of his guru by spreading Krishna Consciousness around the world. He presented the Bhagavad Gita As It Is in English, and under his guidance his followers have published it in 60+ other languages.",
                  "He also provided the translation and commentary for Chaitanya Charitamrita and Srimad Bhagavatam (Cantos 1 to 12, including 18,000 verses), and wrote books like The Science of Self-Realization, Teachings of Lord Caitanya and The Nectar of Devotion, a summary of Rūpa Gosvāmī's Bhakti-rasāmṛta-sindhu.",
                ],
                quote: { text: "If only 1% become devotees, that will change the world.", cite: "Letter to Karandhara — Tokyo, 2 May 1972" },
              },
              {
                eyebrow: "Global Messenger",
                title: "Messenger of Krishna Consciousness to the world",
                image: "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1793693938735-messenger.png",
                w: 338,
                h: 501,
                alt: "Srila Prabhupada speaking from the Srimad Bhagavatam",
                body: [
                  "Srila Prabhupada's role in developing the worldwide community of Krishna Consciousness, ISKCON, is extraordinary. He expanded the group of followers into communities, regardless of their religion or gender. He started the Bhaktivedanta Book Trust (BBT), now the largest publisher and distributor of books on Krishna Consciousness.",
                  "Through his book distribution, many people experienced the joy of bhakti and joined the Hare Krishna Movement. He also initiated the celebration of Rath Yatra in Western countries, a festival once celebrated only in India — and today it is celebrated in every corner of the world through grand festivals and the enchanting kirtan of the Hare Krishna Mahamantra.",
                ],
              },
            ].map((f, i) => (
              <div key={f.title} className="grid items-center gap-8 md:grid-cols-2 md:gap-14">
                <Reveal className={i % 2 ? "md:order-2" : ""}>
                  <div className="relative mx-auto w-full max-w-sm">
                    <div aria-hidden className="absolute -inset-3 -z-10 rotate-3 rounded-[2rem] bg-gradient-to-br from-gold/30 via-vk-100 to-transparent" />
                    <Image src={f.image} alt={f.alt} width={f.w} height={f.h} className="h-auto w-full rounded-3xl shadow-[0_30px_60px_-28px_rgba(30,58,138,0.55)]" />
                  </div>
                </Reveal>
                <Reveal delay={0.08}>
                  <span className="vk-pill mb-4">{f.eyebrow}</span>
                  <h2 className="vk-h2">{f.title}</h2>
                  <div className="mt-5 space-y-4">
                    {f.body.map((t) => <p key={t.slice(0, 24)} className="vk-lead">{t}</p>)}
                  </div>
                  {f.quote && (
                    <figure className="mt-6 rounded-2xl border-l-4 border-gold bg-vk-50 p-5">
                      <blockquote className="font-serif-display text-xl italic leading-snug text-ink">&ldquo;{f.quote.text}&rdquo;</blockquote>
                      <figcaption className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-vk-700">~ {f.quote.cite}</figcaption>
                    </figure>
                  )}
                </Reveal>
              </div>
            ))}
          </div>
        </section>

        {/* ── QUALITIES ─────────────────────────────────────────── */}
        <section className="vk-section vk-band">
          <div className="vk-container">
            <SectionHeading align="center" eyebrow="Divine Qualities" title="The Qualities of a Pure Devotee" />
            <div className="grid gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-3">
              {qualities.map((q, i) => (
                <Reveal key={q.title} delay={i * 0.05}>
                  <div className="vk-card vk-card-hover h-full p-6">
                    <span className="vk-icon-chip mb-4">
                      <Sparkles className="h-5 w-5" />
                    </span>
                    <h3 className="text-lg font-bold text-foreground">{q.title}</h3>
                    <p className="mt-1.5 text-[15px] leading-relaxed text-muted-foreground">{q.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── TIMELINE ──────────────────────────────────────────── */}
        <section id="timeline" className="vk-section scroll-mt-24 bg-gradient-to-b from-white via-vk-50/60 to-white">
          <div className="vk-container">
            <SectionHeading align="center" eyebrow="Milestone Timeline" title={<>Srila Prabhupada&apos;s <span className="text-vk-600">Timeline</span></>} />

            <div ref={pillsRef} role="tablist" aria-label="Timeline years" className="mb-6 flex gap-2 overflow-x-auto scroll-smooth pb-3 scrollbar-hide md:justify-center">
              {timeline.map((item, i) => (
                <button
                  key={item.year}
                  role="tab"
                  aria-selected={step === i}
                  onClick={() => go(i)}
                  className={`shrink-0 rounded-full border px-4 py-2 font-heading text-sm font-bold transition-all ${
                    step === i
                      ? "scale-110 border-vk-700 bg-vk-700 text-white shadow-lift"
                      : i < step
                        ? "border-vk-200 bg-vk-100 text-vk-700 hover:border-vk-500"
                        : "border-vk-200 bg-white text-muted-foreground hover:-translate-y-0.5 hover:border-vk-500 hover:text-vk-700"
                  }`}
                >
                  {item.year}
                </button>
              ))}
            </div>

            <div
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "ArrowRight") go(step + 1);
                if (e.key === "ArrowLeft") go(step - 1);
              }}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              aria-label="Timeline — use the left and right arrow keys to move between milestones"
              className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] border border-vk-100 bg-white shadow-[0_40px_80px_-40px_rgba(30,58,138,0.45)] outline-none focus-visible:ring-2 focus-visible:ring-vk-500"
            >
              <AnimatePresence mode="wait" custom={dir}>
                <motion.div
                  key={step}
                  custom={dir}
                  variants={{
                    enter: (d: number) => ({ opacity: 0, x: 40 * d }),
                    center: { opacity: 1, x: 0 },
                    exit: (d: number) => ({ opacity: 0, x: -40 * d }),
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.35, ease: [0.22, 0.8, 0.3, 1] }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.15}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -70) go(step + 1);
                    else if (info.offset.x > 70) go(step - 1);
                  }}
                  className="grid cursor-grab active:cursor-grabbing md:grid-cols-[1.05fr_1fr]"
                >
                  {/* Media: blurred copy fills the frame, the photo itself is never cropped. */}
                  <div className="relative isolate min-h-[280px] overflow-hidden bg-vk-900 md:min-h-[480px]">
                    {cur.image && (
                      <>
                        <Image src={cur.image} alt="" fill sizes="(min-width: 768px) 520px, 100vw" className="-z-10 scale-125 object-cover opacity-70 blur-2xl" aria-hidden />
                        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-vk-900/60 via-transparent to-vk-900/30" />
                        <motion.div
                          initial={{ scale: 1.06 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 6, ease: "easeOut" }}
                          className="absolute inset-0 p-5 md:p-8"
                        >
                          <div className="relative h-full w-full">
                            <Image
                              src={cur.image}
                              alt={`${cur.title}, ${cur.year}`}
                              fill
                              sizes="(min-width: 768px) 460px, 100vw"
                              className="object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.55)]"
                            />
                          </div>
                        </motion.div>
                      </>
                    )}
                    <span className="absolute left-4 top-4 rounded-full bg-gold px-4 py-1.5 font-heading text-sm font-extrabold text-vk-900 shadow-lift">{cur.year}</span>
                    <span className="absolute bottom-4 left-4 rounded-full bg-vk-900/70 px-3 py-1 text-xs font-bold tracking-widest text-white backdrop-blur">
                      {String(step + 1).padStart(2, "0")} / {timeline.length}
                    </span>
                  </div>

                  <div className="relative flex flex-col p-7 md:p-10">
                    <span aria-hidden className="pointer-events-none absolute right-4 top-0 font-heading text-[100px] font-extrabold leading-none text-vk-50 md:text-[150px]">{cur.year}</span>
                    <span className="relative grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-[#FFD66B] to-[#F5A623] text-vk-900 shadow-lift"><cur.icon className="h-6 w-6" /></span>
                    <p className="relative mt-5 text-xs font-bold uppercase tracking-[0.2em] text-vk-500">{cur.date || cur.year}</p>
                    <h3 className="vk-h3 relative mt-1">{cur.title}</h3>
                    <p className="vk-lead relative mt-4">{cur.desc}</p>
                    <button
                      onClick={() => go(step + 1)}
                      className="group relative mt-auto flex items-center justify-between gap-3 rounded-2xl border border-vk-100 bg-vk-50 px-4 py-3 text-left transition hover:border-vk-300 hover:bg-vk-100"
                    >
                      <span>
                        <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-vk-500">Up next · {upNext.year}</span>
                        <span className="block text-sm font-bold text-ink">{upNext.title}</span>
                      </span>
                      <ArrowRight className="h-4 w-4 shrink-0 text-vk-700 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="flex items-center gap-3 border-t border-vk-100 bg-vk-50 px-4 py-4 md:gap-5 md:px-8">
                <button onClick={() => go(step - 1)} aria-label="Previous milestone" className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-vk-200 bg-white text-vk-700 transition hover:border-vk-700 hover:bg-vk-700 hover:text-white">
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <div className="flex flex-1 items-center gap-1" role="presentation">
                  {timeline.map((t, i) => (
                    <button
                      key={t.year}
                      onClick={() => go(i)}
                      aria-label={`Go to ${t.year}`}
                      className="group flex h-6 flex-1 items-center"
                    >
                      <span className={`h-1.5 w-full rounded-full transition-all group-hover:h-2.5 ${i < step ? "bg-vk-400" : i === step ? "bg-gold" : "bg-vk-200"}`} />
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setPlaying((v) => !v)}
                  aria-label={playing ? "Pause auto-play" : "Play auto-play"}
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-vk-200 bg-white text-vk-700 transition hover:border-vk-700"
                >
                  {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </button>
                <button onClick={() => go(step + 1)} aria-label="Next milestone" className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-vk-700 text-white transition hover:bg-vk-600">
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Full timeline stays in the DOM for crawlers and screen readers. */}
            <ol className="sr-only">
              {timeline.map((t) => <li key={t.year}>{t.year} — {t.title}: {t.desc}</li>)}
            </ol>
          </div>
        </section>

        {/* ── FACTS ─────────────────────────────────────────────── */}
        <section className="vk-section vk-band">
          <div className="vk-container">
            <SectionHeading align="center" eyebrow="Amazing Facts" title="Facts About Srila Prabhupada" />
            <div className="mx-auto grid max-w-5xl gap-3 sm:grid-cols-2 md:gap-4">
              {facts.map((fact, i) => (
                <Reveal key={i} delay={(i % 2) * 0.05}>
                  <div className="vk-card flex h-full gap-4 p-5">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-vk-700 text-sm font-bold text-white">
                      {i + 1}
                    </span>
                    <p className="text-[15px] leading-relaxed text-muted-foreground">{fact}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── TEACHINGS ─────────────────────────────────────────── */}
        <section className="vk-section">
          <div className="vk-container">
            <SectionHeading align="center" eyebrow="Sacred Literature" title="Timeless Teachings" />
            <div className="grid gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-3">
              {teachings.map((t, i) => (
                <Reveal key={t.title} delay={i * 0.05}>
                  <div className="vk-card vk-card-hover h-full p-6">
                    <span className="vk-icon-chip mb-4">
                      <BookOpen className="h-5 w-5" />
                    </span>
                    <h3 className="text-lg font-bold text-foreground">{t.title}</h3>
                    <p className="mt-1.5 text-[15px] leading-relaxed text-muted-foreground">{t.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── BE A PART OF THIS LEGACY ──────────────────────────── */}
        <section className="vk-section">
          <div className="vk-container">
            <div className="relative isolate overflow-hidden rounded-3xl bg-gradient-navy px-5 py-12 text-white shadow-lift md:px-12 md:py-16">
              <div aria-hidden className="absolute -right-20 -top-20 -z-10 h-72 w-72 rounded-full bg-gold/15 blur-3xl" />
              <SectionHeading light align="center" eyebrow="Be a Part of this Legacy" title={<>Carry his mission <span className="text-gold">forward</span></>} />
              <div className="grid gap-5 md:grid-cols-3">
                {legacy.map((l, i) => (
                  <Reveal key={l.title} delay={i * 0.08}>
                    <div className="flex h-full flex-col rounded-2xl border border-white/15 bg-white/[0.06] p-6 backdrop-blur">
                      <span className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-gold text-vk-900"><l.icon className="h-5 w-5" /></span>
                      <h3 className="font-heading text-lg font-bold">{l.title}</h3>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-white/75">{l.text}</p>
                      <Link href={l.href} className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-gold hover:underline">
                        {l.cta} <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── QUOTE ─────────────────────────────────────────────── */}
        <section className="pb-4">
          <div className="vk-container">
            <Reveal>
              <div className="relative isolate overflow-hidden rounded-3xl bg-vk-50 px-6 py-12 text-center md:px-12 md:py-16">
                <Quote aria-hidden className="absolute left-6 top-6 -z-10 h-28 w-28 text-vk-100" />
                <span className="vk-pill mb-5">His Words</span>
                <blockquote className="mx-auto max-w-3xl font-serif-display text-3xl italic leading-snug text-ink md:text-5xl">
                  &ldquo;The real need is to awaken our love for Krishna.&rdquo;
                </blockquote>
                <p className="mt-6 text-sm font-semibold uppercase tracking-[0.14em] text-vk-700">— Srila Prabhupada</p>
              </div>
            </Reveal>
          </div>
        </section>

        <WhatsAppCommunityCTA />
      </div>
    </PageLayout>
  );
}
