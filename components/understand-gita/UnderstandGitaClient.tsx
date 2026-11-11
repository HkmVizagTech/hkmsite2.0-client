"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, BookOpen, CheckCircle2, ChevronDown, Clock, Languages, MessageCircleQuestion, MonitorPlay, ScrollText, Users, Video, Youtube, type LucideIcon } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import CountUp from "@/components/bhajans/CountUp";
import RegisterForm from "./RegisterForm";
import KkHero, { KK } from "./kk/KkHero";
import { Benefits, ChapterGrid, Dilemma, Journey, Moment, SunsetClose } from "./kk/Story";
import { EpicTitle, Eyebrow, FadeIn, Panel } from "./kk/Epic";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AUDIENCES, ENROL_PHONE_LABEL, ENROL_URL, FAQS, FEATURES, STATS, STEPS } from "@/lib/understandGita";

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

function JoinButton({ className = "", label = "Register Free" }: { className?: string; label?: string }) {
  return (
    <a href="#register" className={`vk-btn-gold inline-flex h-12 items-center justify-center gap-2 px-7 text-[15px] font-bold ${className}`}>
      {label}
      <ArrowRight className="h-5 w-5" />
    </a>
  );
}

function DarkFaq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="mx-auto max-w-3xl space-y-3">
      {FAQS.map((f, i) => (
        <Panel key={f.q} className="overflow-hidden">
          <button type="button" onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left">
            <span className="text-[15px] font-semibold text-white md:text-base">{f.q}</span>
            <ChevronDown className={`h-5 w-5 shrink-0 text-[#F6C752] transition-transform ${open === i ? "rotate-180" : ""}`} />
          </button>
          {open === i && <p className="px-5 pb-5 text-[15px] leading-relaxed text-white/70">{f.a}</p>}
        </Panel>
      ))}
    </div>
  );
}

const section = "relative isolate overflow-hidden bg-[#06080F] py-20 text-white md:py-28";

export default function UnderstandGitaClient({ fontClass = "" }: { fontClass?: string }) {
  return (
    <PageLayout background="#06080F">
      <div className={`kk-grain overflow-x-clip bg-[#06080F] pt-[var(--header-h)] text-white ${fontClass}`}>
        {/* ACT 0: the battlefield at sunrise */}
        <KkHero />

        {/* numbers */}
        <section className="border-y border-[#F6C752]/15 bg-[#06080F]">
          <ul className="vk-container grid grid-cols-2 gap-y-6 py-9 md:grid-cols-4 md:divide-x md:divide-[#F6C752]/15">
            {STATS.map((s) => (
              <li key={s.label} className="text-center">
                <p className="kk-gold-text font-[family-name:var(--font-cinzel)] text-4xl font-bold md:text-5xl">
                  {"free" in s && s.free ? "Free" : <CountUp value={s.value} />}
                </p>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/60">{s.label}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* ACT 1-3 */}
        <Dilemma />
        <Moment />
        <Journey />
        <section className={section}>
          <div className="vk-container">
            <div className="text-center">
              <Eyebrow>All 18 chapters</Eyebrow>
              <EpicTitle text="One chapter a day" className="mt-6 text-3xl md:text-5xl" />
              <p className="mx-auto mt-4 max-w-xl text-white/65">Every chapter of the Bhagavad-gita, explained simply in a live class.</p>
            </div>
            <ChapterGrid />
          </div>
        </section>

        {/* ACT 4 */}
        <Benefits />

        {/* COURSE DETAILS */}
        <section className={section}>
          <div className="vk-container">
            <div className="text-center">
              <Eyebrow>Course details</Eyebrow>
              <EpicTitle text="Everything you need" className="mt-6 text-3xl md:text-5xl" />
              <p className="mx-auto mt-4 max-w-xl text-white/65">A complete, free course built around daily live classes.</p>
            </div>
            <div className="mx-auto mt-12 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((f, i) => {
                const Icon = ICONS[f.icon] || CheckCircle2;
                return (
                  <FadeIn key={f.title} delay={(i % 3) * 0.08}>
                    <Panel className="group h-full p-6 transition-colors duration-300 hover:border-[#F6C752]/45 hover:bg-white/[0.06]">
                      <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[#F6C752]/40 text-[#F6C752] transition-shadow group-hover:shadow-[0_0_26px_rgba(246,199,82,.35)]">
                        <Icon className="h-5 w-5" />
                      </span>
                      <h3 className="mt-4 text-lg font-bold text-white">{f.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-white/65">{f.text}</p>
                    </Panel>
                  </FadeIn>
                );
              })}
            </div>
          </div>
        </section>

        {/* AUDIENCE */}
        <section className={section}>
          <div className="vk-container">
            <div className="text-center">
              <Eyebrow>Who it is for</Eyebrow>
              <EpicTitle text="A batch for every age" className="mt-6 text-3xl md:text-5xl" />
            </div>
            <FadeIn className="mx-auto mt-10 max-w-3xl">
              <Tabs defaultValue="adults">
                <TabsList className="mx-auto grid h-auto w-full max-w-md grid-cols-3 gap-1 rounded-full border border-[#F6C752]/25 bg-white/[0.04] p-1.5">
                  {AUDIENCES.map((a) => (
                    <TabsTrigger key={a.key} value={a.key} className="rounded-full py-2.5 text-sm font-bold text-white/70 data-[state=active]:bg-[#F6C752] data-[state=active]:text-[#0A1233]">
                      {a.title}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {AUDIENCES.map((a) => (
                  <TabsContent key={a.key} value={a.key} className="mt-6">
                    <Panel className="p-6 md:p-9">
                      <h3 className="font-[family-name:var(--font-cinzel)] text-2xl font-bold uppercase tracking-[0.04em] text-[#F6C752]">{a.title} batch</h3>
                      <p className="mt-2 text-[15px] leading-relaxed text-white/70">{a.lead}</p>
                      <ul className="mt-5 space-y-3">
                        {a.points.map((p) => (
                          <li key={p} className="flex items-start gap-3 text-[15px] text-white/90">
                            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#F6C752]" /> {p}
                          </li>
                        ))}
                      </ul>
                      <JoinButton className="mt-7" label={`Register for the ${a.title} batch`} />
                    </Panel>
                  </TabsContent>
                ))}
              </Tabs>
            </FadeIn>
          </div>
        </section>

        {/* REGISTER */}
        <section id="register" className={`${section} scroll-mt-20`}>
          <div aria-hidden className="absolute inset-0 -z-10 opacity-25 [filter:blur(3px)_brightness(.6)]">
            <Image src={KK.moment} alt="" fill sizes="100vw" className="object-cover" />
          </div>
          <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,#06080F_0%,rgba(6,8,15,.75)_30%,rgba(6,8,15,.85)_100%)]" />
          <div className="vk-container">
            <div className="text-center">
              <Eyebrow>Register</Eyebrow>
              <EpicTitle text="Take your place in the next batch" className="mx-auto mt-6 max-w-3xl text-3xl md:text-5xl" />
              <p className="mx-auto mt-4 max-w-xl text-white/70">Free for everyone. Fill in your details and join your batch&apos;s WhatsApp group.</p>
            </div>
            <FadeIn className="mx-auto mt-10 max-w-2xl">
              <RegisterForm tone="dark" />
              <p className="mt-4 text-center text-sm text-white/60">
                Prefer WhatsApp? <a href={ENROL_URL} target="_blank" rel="noopener noreferrer" className="font-bold text-[#F6C752] hover:underline">Message us directly</a>
              </p>
            </FadeIn>
          </div>
        </section>

        {/* HOW TO JOIN */}
        <section className={section}>
          <div className="vk-container">
            <div className="text-center">
              <Eyebrow>How to join</Eyebrow>
              <EpicTitle text="Three simple steps" className="mt-6 text-3xl md:text-5xl" />
            </div>
            <ol className="relative mx-auto mt-12 grid max-w-5xl gap-5 md:grid-cols-3">
              <span aria-hidden className="absolute left-[16%] right-[16%] top-[34px] hidden h-px bg-gradient-to-r from-transparent via-[#F6C752] to-transparent md:block" />
              {STEPS.map((s, i) => (
                <FadeIn key={s.title} delay={i * 0.1}>
                  <Panel className="relative h-full p-6 text-center">
                    <span className="relative mx-auto flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#F6C752] font-[family-name:var(--font-cinzel)] text-xl font-bold text-[#0A1233] ring-4 ring-[#06080F]">{i + 1}</span>
                    <h3 className="mt-4 text-base font-bold text-white">{s.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/65">{s.text}</p>
                  </Panel>
                </FadeIn>
              ))}
            </ol>
            <p className="mt-10 text-center text-sm text-white/60">
              Questions? Call or WhatsApp <a href={`tel:${ENROL_PHONE_LABEL.replace(/\s/g, "")}`} className="font-bold text-[#F6C752] hover:underline">{ENROL_PHONE_LABEL}</a>
            </p>
          </div>
        </section>

        {/* BOOKS + FAQ */}
        <section className={section}>
          <div className="vk-container">
            <FadeIn className="mx-auto max-w-3xl">
              <Panel className="p-7 text-center md:p-10">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#F6C752]/40 text-[#F6C752]"><BookOpen className="h-5 w-5" /></span>
                <h2 className="mt-4 font-[family-name:var(--font-cinzel)] text-2xl font-bold uppercase tracking-[0.04em] text-white md:text-3xl">Books are optional</h2>
                <p className="mt-3 text-[15px] leading-relaxed text-white/70">
                  You receive online study material in your batch group, so you do not need to buy anything. If you would like a hard copy of <em>Bhagavad-gita As It Is</em>, find it in our shop, or help others receive the Gita through Gita Daan Seva.
                </p>
                <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Link href="/shop" className="vk-btn-gold inline-flex h-11 items-center px-6 text-sm font-bold">Visit the shop</Link>
                  <Link href="/gita-daan-seva" className="inline-flex h-11 items-center rounded-full border border-[#F6C752]/40 px-6 text-sm font-semibold text-[#F6C752] hover:bg-white/5">Gita Daan Seva</Link>
                </div>
              </Panel>
            </FadeIn>
            <div className="mt-20 text-center">
              <Eyebrow>Questions</Eyebrow>
              <EpicTitle text="Frequently asked" className="mt-6 text-3xl md:text-5xl" />
            </div>
            <div className="mt-10"><DarkFaq /></div>
          </div>
        </section>

        {/* CLOSE: into the sunset */}
        <SunsetClose />
      </div>
    </PageLayout>
  );
}
