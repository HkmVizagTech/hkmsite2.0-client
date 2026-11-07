"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight, BookOpen, CheckCircle2, Clock, Languages, MessageCircle, MessageCircleQuestion, MonitorPlay, ScrollText, Users, Video, Youtube, type LucideIcon } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import SectionHeading from "@/components/site/SectionHeading";
import Reveal from "@/components/site/Reveal";
import CountUp from "@/components/bhajans/CountUp";
import FaqSection from "@/components/sqft-campaign/FaqSection";
import ChapterTimeline from "./ChapterTimeline";
import SpotlightCard from "./SpotlightCard";
import RegisterForm from "./RegisterForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AUDIENCES, ENROL_PHONE_LABEL, ENROL_URL, FAQS, FEATURES, STATS, STEPS, VERSE } from "@/lib/understandGita";

const HERO_IMAGE = "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1786195247954-1786195247200-gita-hero-mob.webp";
const KEYWORDS = ["Karma", "Bhakti", "Jñāna", "Dhyāna", "Dharma", "Śraddhā", "Vairāgya", "Svadharma", "Samatvam", "Śaraṇāgati"];

const ICONS: Record<string, LucideIcon> = {
  video: Video,
  message: MessageCircleQuestion,
  monitor: MonitorPlay,
  youtube: Youtube,
  book: BookOpen,
  quiz: ScrollText,
  languages: Languages,
  users: Users,
  clock: Clock,
};

function WhatsAppIcon({ className }: { className?: string }) {
  return <MessageCircle aria-hidden className={className} />;
}

function JoinButton({ className = "", label = "Register Free" }: { className?: string; label?: string }) {
  return (
    <a href="#register" className={`vk-btn-gold inline-flex h-12 items-center justify-center gap-2 px-7 text-[15px] font-bold ${className}`}>
      {label}
      <ArrowRight className="h-5 w-5" />
    </a>
  );
}

export default function UnderstandGitaClient() {
  return (
    <PageLayout>
      <div className="overflow-x-clip bg-white pt-[var(--header-h)] text-ink">
        {/* HERO */}
        <section className="relative isolate overflow-hidden bg-vk-900 text-white">
          <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(60%_80%_at_85%_20%,rgba(246,199,82,.20),transparent_60%),radial-gradient(50%_70%_at_5%_90%,rgba(47,91,211,.45),transparent_65%)]" />
          <span aria-hidden className="pointer-events-none absolute -bottom-8 right-2 -z-10 select-none lg:hidden font-serif-display text-[14rem] font-bold leading-none text-white/[0.04] md:text-[22rem]">गीता</span>
          <div className="vk-container grid items-center gap-10 py-14 md:py-20 lg:grid-cols-[1.1fr_.9fr] lg:gap-14">
            <div className="text-center lg:text-left">
              <span className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--gold)/0.5)] bg-white/10 px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[hsl(var(--gold))]">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[hsl(var(--gold))]" /> Free live course · Online
              </span>
              <h1 className="mt-5 font-heading text-[2.15rem] font-extrabold leading-[1.08] md:text-6xl">
                Understand the <span className="text-[hsl(var(--gold))]">Bhagavad-gita</span> in just 18 days
              </h1>
              <p className="mx-auto mt-5 max-w-xl text-[15px] leading-7 text-white/85 md:text-lg md:leading-8 lg:mx-0">
                One hour of live teaching every day, with time for your questions, recordings, study material and quizzes. Free for adults, youth and kids.
              </p>
              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
                <JoinButton />
                <a href="#journey" className="inline-flex h-12 items-center gap-2 rounded-full border border-white/40 px-6 text-[15px] font-semibold text-white transition hover:bg-white/10">
                  See what you will learn <ArrowRight className="h-4 w-4" />
                </a>
              </div>
              <ul className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 text-[13px] text-white/80 lg:justify-start">
                {["100% free", "Live Q&A every day", "Recordings included"].map((t) => (
                  <li key={t} className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-[hsl(var(--gold))]" /> {t}</li>
                ))}
              </ul>
            </div>

            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.22, 0.8, 0.3, 1] }} className="mx-auto w-full max-w-md">
              <div className="relative rounded-[2rem] border border-white/20 bg-white/10 p-3 backdrop-blur-sm">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem]">
                  <Image src={HERO_IMAGE} alt="Bhagavad-gita As It Is being offered at the temple" fill priority unoptimized sizes="(min-width:1024px) 420px, 90vw" className="object-cover object-[50%_42%]" />
                  <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-vk-900/90 via-vk-900/10 to-transparent" />
                  <span className="absolute right-3 top-3 rotate-6 rounded-full bg-[hsl(var(--gold))] px-4 py-1.5 font-heading text-sm font-extrabold uppercase tracking-wider text-vk-900">Free!</span>
                  <div className="absolute inset-x-4 bottom-4 text-left">
                    <p className="font-heading text-xl font-extrabold leading-tight">Understand Gita</p>
                    <p className="text-sm text-white/80">18 days · 60 min live daily</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 px-1 pb-1 pt-3 text-center text-[12px] font-semibold text-white">
                  {["Adults", "Youth", "Kids"].map((a) => (
                    <span key={a} className="rounded-xl bg-white/10 py-2">{a}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* STATS */}
        <section className="border-b border-vk-100 bg-vk-50">
          <ul className="vk-container grid grid-cols-2 gap-y-6 py-8 md:grid-cols-4 md:divide-x md:divide-vk-100">
            {STATS.map((s) => (
              <li key={s.label} className="text-center">
                <p className="font-heading text-4xl font-extrabold text-vk-800 md:text-5xl">
                  {"free" in s && s.free ? "Free" : <CountUp value={s.value} className="font-heading" />}
                </p>
                <p className="mt-1 text-[12px] font-semibold uppercase tracking-wider text-vk-700">{s.label}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* KEYWORD MARQUEE */}
        <div aria-hidden className="overflow-hidden border-b border-vk-100 bg-white py-3">
          <div className="ug-marquee flex w-max gap-10 whitespace-nowrap font-serif-display text-lg font-semibold text-vk-600">
            {[...KEYWORDS, ...KEYWORDS].map((k, i) => (
              <span key={i} className="inline-flex items-center gap-10">{k}<span className="text-[hsl(var(--gold))]">✦</span></span>
            ))}
          </div>
        </div>

        {/* COURSE DETAILS */}
        <section className="vk-section">
          <div className="vk-container">
            <Reveal>
              <SectionHeading align="center" eyebrow="Course Details" title="Everything you need to learn the Gita" subtitle="A complete, free course built around daily live classes." />
            </Reveal>
            <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((f, i) => {
                const Icon = ICONS[f.icon] || CheckCircle2;
                const hero = i === 0;
                return (
                  <Reveal key={f.title} delay={(i % 3) * 0.06}>
                    <SpotlightCard className={`h-full p-6 ${hero ? "!border-vk-700 !bg-vk-800 text-white" : ""}`}>
                      <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${hero ? "bg-white/15 text-[hsl(var(--gold))]" : "bg-vk-100 text-vk-700"}`}>
                        <Icon className="h-6 w-6" />
                      </span>
                      <h3 className={`mt-4 text-lg font-bold ${hero ? "text-white" : "text-ink"}`}>{f.title}</h3>
                      <p className={`mt-2 text-sm leading-relaxed ${hero ? "text-white/80" : "text-muted-foreground"}`}>{f.text}</p>
                    </SpotlightCard>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* VERSE */}
        <section className="relative isolate overflow-hidden bg-vk-800 py-14 text-center text-white md:py-20">
          <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(50%_70%_at_50%_0%,rgba(246,199,82,.18),transparent_70%)]" />
          <Reveal className="vk-container">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[hsl(var(--gold))]">A verse you will understand</p>
            <p lang="sa" className="mx-auto mt-5 max-w-3xl font-serif-display text-3xl font-semibold leading-snug text-[hsl(var(--gold))] md:text-5xl">{VERSE.sanskrit}</p>
            <p className="mt-3 text-sm italic text-white/70">{VERSE.translit}</p>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-white/90">&ldquo;{VERSE.meaning}&rdquo;</p>
            <p className="mt-3 text-sm font-semibold text-white/60">{VERSE.ref}</p>
          </Reveal>
        </section>

        {/* CHAPTERS */}
        <section id="journey" className="vk-section scroll-mt-20">
          <div className="vk-container">
            <Reveal>
              <SectionHeading align="center" eyebrow="The Journey" title="18 chapters, one transformative course" subtitle="Walk through all eighteen chapters of the Bhagavad-gita and discover what each one means for daily life." />
            </Reveal>
            <ChapterTimeline />
          </div>
        </section>

        {/* AUDIENCE */}
        <section className="vk-section vk-band">
          <div className="vk-container">
            <Reveal>
              <SectionHeading align="center" eyebrow="Who It Is For" title="A batch for every age" />
            </Reveal>
            <Reveal className="mx-auto max-w-3xl">
              <Tabs defaultValue="adults">
                <TabsList className="mx-auto grid h-auto w-full max-w-md grid-cols-3 gap-1 rounded-full bg-white p-1.5 ring-1 ring-vk-200">
                  {AUDIENCES.map((a) => (
                    <TabsTrigger key={a.key} value={a.key} className="rounded-full py-2.5 text-sm font-bold data-[state=active]:bg-vk-800 data-[state=active]:text-white">
                      {a.title}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {AUDIENCES.map((a) => (
                  <TabsContent key={a.key} value={a.key} className="mt-6 rounded-3xl border border-vk-100 bg-white p-6 md:p-9">
                    <h3 className="font-heading text-2xl font-extrabold text-vk-800">{a.title} batch</h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{a.lead}</p>
                    <ul className="mt-5 space-y-3">
                      {a.points.map((p) => (
                        <li key={p} className="flex items-start gap-3 text-[15px] text-ink">
                          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[hsl(var(--gold-deep))]" /> {p}
                        </li>
                      ))}
                    </ul>
                    <JoinButton className="mt-7" label={`Register for the ${a.title} batch`} />
                  </TabsContent>
                ))}
              </Tabs>
            </Reveal>
          </div>
        </section>

        {/* REGISTER */}
        <section id="register" className="vk-section scroll-mt-20">
          <div className="vk-container">
            <Reveal>
              <SectionHeading align="center" eyebrow="Register" title="Reserve your seat in the next batch" subtitle="Free for everyone. Fill in your details and we will add you to your batch on WhatsApp." />
            </Reveal>
            <Reveal className="mx-auto max-w-2xl">
              <RegisterForm />
              <p className="mt-4 text-center text-sm text-muted-foreground">
                Prefer WhatsApp? <a href={ENROL_URL} target="_blank" rel="noopener noreferrer" className="font-bold text-vk-700 hover:text-vk-500">Message us directly</a>
              </p>
            </Reveal>
          </div>
        </section>

        {/* HOW TO JOIN */}
        <section className="vk-section vk-band">
          <div className="vk-container">
            <Reveal>
              <SectionHeading align="center" eyebrow="How To Join" title="Enrol in three simple steps" />
            </Reveal>
            <ol className="relative mx-auto grid max-w-5xl gap-5 md:grid-cols-3">
              <span aria-hidden className="absolute left-[16%] right-[16%] top-[34px] hidden h-0.5 bg-gradient-to-r from-vk-200 via-[hsl(var(--gold))] to-vk-200 md:block" />
              {STEPS.map((s, i) => (
                <Reveal key={s.title} as="li" delay={i * 0.08} className="relative rounded-3xl border border-vk-100 bg-white p-6 text-center">
                  <span className="relative mx-auto flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[hsl(var(--gold))] font-heading text-xl font-extrabold text-vk-900 ring-4 ring-white">{i + 1}</span>
                  <h3 className="mt-4 text-base font-bold text-ink">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
                </Reveal>
              ))}
            </ol>
            <Reveal className="mt-10 text-center">
              <p className="text-sm text-muted-foreground">
                Questions? Call or WhatsApp <a href={`tel:${ENROL_PHONE_LABEL.replace(/\s/g, "")}`} className="font-bold text-vk-700 hover:text-vk-500">{ENROL_PHONE_LABEL}</a>
              </p>
            </Reveal>
          </div>
        </section>

        {/* BOOKS */}
        <section className="vk-section vk-band">
          <div className="vk-container">
            <Reveal className="mx-auto max-w-3xl rounded-3xl border border-vk-100 bg-white p-7 text-center md:p-10">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-vk-100 text-vk-700"><BookOpen className="h-6 w-6" /></span>
              <h2 className="mt-4 font-heading text-2xl font-extrabold text-vk-800 md:text-3xl">Books are optional</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                You receive online study material in your batch group, so you do not need to buy anything. If you would like a hard copy of <em>Bhagavad-gita As It Is</em> for handy reference, you can find it in our shop, or help others receive the Gita through Gita Daan Seva.
              </p>
              <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link href="/shop" className="vk-btn-primary inline-flex h-11 items-center px-6 text-sm font-bold">Visit the shop</Link>
                <Link href="/gita-daan-seva" className="inline-flex h-11 items-center rounded-full border border-vk-200 bg-white px-6 text-sm font-semibold text-vk-800 hover:bg-vk-50">Gita Daan Seva</Link>
              </div>
            </Reveal>
          </div>
        </section>

        <FaqSection faqs={FAQS} tone="default" />

        {/* FINAL CTA */}
        <section className="relative isolate overflow-hidden bg-vk-900 py-16 text-center text-white md:py-24">
          <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(55%_90%_at_50%_100%,rgba(246,199,82,.22),transparent_70%)]" />
          <Reveal className="vk-container">
            <h2 className="mx-auto max-w-2xl font-heading text-3xl font-extrabold md:text-5xl">Begin your 18-day journey through the Gita</h2>
            <p className="mx-auto mt-4 max-w-xl text-white/80">Free, live and open to the whole family. Join the next batch today.</p>
            <JoinButton className="mt-8" />
          </Reveal>
        </section>
      </div>
    </PageLayout>
  );
}
