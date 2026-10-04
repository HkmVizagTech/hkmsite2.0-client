"use client";

import PageLayout from "@/components/PageLayout";
import WhatsAppCommunityCTA from "@/components/WhatsAppCommunityCTA";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/site/SectionHeading";
import Reveal from "@/components/site/Reveal";
import { Heart, BookOpen, Users, Flower2, Globe, Calendar, Music, GraduationCap, ExternalLink, Info } from "lucide-react";
import Image from "next/image";
import AssociatedTrustsImg from "@/assets/AssociatedTrusts.png";

const values = [
  { icon: Heart, title: "Spiritual Well-being", desc: "Programs designed to nurture the soul and bring inner peace through the teachings of Bhagavad Gita and Srimad Bhagavatam." },
  { icon: BookOpen, title: "Vedic Wisdom", desc: "Deep dive into ancient scriptures to derive practical insights that address modern life's questions and challenges." },
  { icon: Users, title: "Community Service", desc: "Dedicated to feeding the needy, educating the young, and serving society with compassion and devotion." },
  { icon: Flower2, title: "Value Education", desc: "Inculcating timeless values in children through interactive programs, summer camps, and cultural activities." },
];

const activities = [
  { icon: Calendar, title: "Daily Programs", desc: "Morning and evening aartis, kirtan sessions, and Bhagavad Gita classes open to all." },
  { icon: Music, title: "Kirtan & Bhajans", desc: "Soul-stirring musical sessions that connect hearts to the divine through devotional singing." },
  { icon: GraduationCap, title: "Youth Programs", desc: "Engaging sessions for college students covering personality development, stress management, and spiritual growth." },
  { icon: Globe, title: "Cultural Festivals", desc: "Grand celebrations of Janmashtami, Gaura Purnima, Ratha Yatra, and other Vaishnava festivals." },
];

const milestones = [
  { year: "2008", event: "Began humble seva activities in Visakhapatnam" },
  { year: "2015", event: "Registered as a trust in Visakhapatnam" },
  { year: "2016", event: "Began regular Bhagavad Gita study circles" },
  { year: "2018", event: "Launched Subhojanam food distribution programme" },
  { year: "2019", event: "Expanded to serve 500+ meals daily at KGH Hospital" },
  { year: "2021", event: "Extended food service to GGH Hospital, Kakinada" },
  { year: "2023", event: "Announced Hare Krishna Vaikuntham Temple project" },
];

const trusts = [
  {
    name: "ISKCON Gambheeram Visakhapatnam",
    description: "The parent body — Srila Prabhupada's ISKCON temple at Gambheeram, Visakhapatnam. All associated trusts and initiatives operate under its spiritual and institutional umbrella.",
    role: "Parent Organisation",
    featured: true,
  },
  {
    name: "Hare Krishna Movement India",
    description: "The registered trust through which ISKCON Gambheeram conducts its spiritual, cultural, and educational programmes in Visakhapatnam.",
    role: "Spiritual & Cultural Activities",
  },
  {
    name: "Touchstone Charities",
    description: "Runs the Subhojanam hospital meal programme, providing free nutritious meals to patients and attendants at government hospitals in Visakhapatnam and Kakinada.",
    role: "Charitable & Welfare Activities",
    link: "/subhojanam",
    linkLabel: "View Subhojanam →",
  },
  {
    name: "Touchstone Foundation",
    description: "Focuses on education, skill development, and social welfare initiatives under the broader umbrella of HKM Visakhapatnam.",
    role: "Education & Welfare",
  },
  {
    name: "HKM Charitable Foundation AP",
    description: "Supports various charitable activities across Andhra Pradesh, extending the reach of Hare Krishna Movement's service activities beyond Visakhapatnam.",
    role: "State-wide Charitable Activities",
  },
  {
    name: "Akshaya Patra (Partner)",
    description: "ISKCON Gambheeram is associated with the Akshaya Patra Foundation — the world's largest mid-day meal programme, feeding over 2 million schoolchildren daily.",
    role: "School Mid-day Meal Programme",
  },
];

export default function AboutPage() {
  return (
    <PageLayout>
      <div className="pt-[var(--header-h)]">
        <PageHero
          title="About Us"
          subtitle="Spreading the timeless message of Lord Krishna through devotion, service, and community"
          breadcrumb="About Us"
          backgroundImage="/assets/about-community.jpg"
        />

        {/* ── OUR STORY — feature split ─────────────────────────── */}
        <section className="vk-section overflow-hidden">
          <div className="vk-container grid items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
            <Reveal>
              <span className="vk-pill mb-4">Our Story</span>
              <h2 className="vk-h2">A Legacy of Devotion &amp; Service</h2>
              <p className="vk-lead mt-5">
                Over five hundred years ago, Lord Sri Chaitanya made a prophecy that every town and village
                of the world would chant the holy name of Lord Krishna. In September 1965, His Divine
                Grace A.C. Bhaktivedanta Swami Prabhupada left the shores of India to fulfill this prophecy.
              </p>
              <p className="vk-lead mt-4">
                Following in the footsteps of our revered Founder-Acharya, we at{" "}
                <strong className="text-foreground">Hare Krishna Movement India (HKMI), Visakhapatnam</strong> —
                also known as <strong className="text-foreground">ISKCON Gambheeram Visakhapatnam</strong> —
                have been conducting spiritual, educational and cultural activities with the devoted purpose
                of bringing about physical, emotional and spiritual well-being.
              </p>
              <p className="vk-lead mt-4">
                Serving the community since 2008 and registered as a trust in 2015, HKMI&apos;s
                activities have grown consistently, touching thousands of lives across Visakhapatnam and beyond.
              </p>
              <div className="mt-7 grid max-w-sm grid-cols-2 gap-3">
                <div className="rounded-2xl border border-vk-100 bg-vk-50 px-4 py-3 text-center">
                  <p className="font-heading text-2xl font-extrabold text-vk-700">2008</p>
                  <p className="text-xs font-medium text-ink/60">Serving since</p>
                </div>
                <div className="rounded-2xl border border-vk-100 bg-vk-50 px-4 py-3 text-center">
                  <p className="font-heading text-2xl font-extrabold text-vk-700">2015</p>
                  <p className="text-xs font-medium text-ink/60">Registered as a trust</p>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.1} className="relative">
              <div aria-hidden className="absolute -inset-3 -z-10 rounded-[2rem] bg-gradient-to-br from-vk-200/70 via-vk-100/60 to-transparent" />
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-[0_30px_60px_-28px_rgba(30,58,138,0.55)]">
                <Image
                  src="/assets/about-community.jpg"
                  alt="Community gathering"
                  fill
                  sizes="(min-width: 1024px) 560px, 100vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── CORE VALUES ───────────────────────────────────────── */}
        <section className="vk-section vk-band">
          <div className="vk-container">
            <SectionHeading align="center" eyebrow="What We Stand For" title="Our Core Values" />
            <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2 md:gap-6">
              {values.map((item, i) => (
                <Reveal key={item.title} delay={i * 0.06}>
                  <div className="vk-card vk-card-hover flex h-full gap-4 p-5 md:p-6">
                    <span className="vk-icon-chip h-12 w-12">
                      <item.icon className="h-6 w-6" />
                    </span>
                    <div>
                      <h3 className="text-lg font-bold text-foreground">{item.title}</h3>
                      <p className="mt-1.5 text-[15px] leading-relaxed text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── ACTIVITIES ────────────────────────────────────────── */}
        <section className="vk-section">
          <div className="vk-container">
            <SectionHeading align="center" eyebrow="What We Do" title="Our Activities" />
            <div className="grid gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-4">
              {activities.map((item, i) => (
                <Reveal key={item.title} delay={i * 0.06}>
                  <div className="vk-card vk-card-hover h-full p-6">
                    <span className="vk-icon-chip mb-4">
                      <item.icon className="h-5 w-5" />
                    </span>
                    <h3 className="text-lg font-bold text-foreground">{item.title}</h3>
                    <p className="mt-1.5 text-[15px] leading-relaxed text-muted-foreground">{item.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── MILESTONES — timeline ─────────────────────────────── */}
        <section className="vk-section vk-band">
          <div className="vk-container">
            <SectionHeading align="center" eyebrow="Our Journey" title="Key Milestones" />
            <ol className="relative mx-auto max-w-3xl">
              <span aria-hidden className="absolute bottom-6 left-6 top-6 w-0.5 bg-vk-200 md:left-1/2 md:-translate-x-1/2" />
              {milestones.map((m, i) => {
                const right = i % 2 === 1;
                return (
                  <Reveal as="li" key={m.year} delay={i * 0.05} className="relative pb-6 last:pb-0">
                    <div className={`flex items-center gap-4 md:gap-0 ${right ? "md:flex-row-reverse" : ""}`}>
                      <div className={`hidden md:block md:w-1/2 ${right ? "md:pl-10" : "md:pr-10"}`}>
                        <div className={`vk-card p-4 md:p-5 ${right ? "" : "text-right"}`}>
                          <p className="text-[15px] font-medium text-foreground">{m.event}</p>
                        </div>
                      </div>
                      <div className="relative z-[1] flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-vk-700 text-xs font-bold text-white ring-4 ring-vk-100 md:absolute md:left-1/2 md:-translate-x-1/2">
                        {m.year}
                      </div>
                      <div className="vk-card flex-1 p-4 md:hidden">
                        <p className="text-[15px] font-medium text-foreground">{m.event}</p>
                      </div>
                      <div className="hidden md:block md:w-1/2" />
                    </div>
                  </Reveal>
                );
              })}
            </ol>
          </div>
        </section>

        {/* ── ASSOCIATED TRUSTS ─────────────────────────────────── */}
        <section className="vk-section">
          <div className="vk-container">
            <SectionHeading
              align="center"
              eyebrow="Our Ecosystem"
              title="Associated Trusts & Initiatives"
              subtitle="ISKCON Gambheeram Visakhapatnam operates through several trusts and partner organisations, each focused on a specific area of service — from hospital meals and education to state-wide charitable activities. All are guided by the same spiritual mission."
            />

            <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,420px)_1fr] lg:gap-10">
              <Reveal className="lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]">
                <div className="vk-card mx-auto max-w-md p-4 md:p-6">
                  <Image
                    src={AssociatedTrustsImg}
                    alt="Associated Trusts of ISKCON Gambheeram Visakhapatnam"
                    width={700}
                    height={900}
                    className="h-auto w-full rounded-xl"
                  />
                </div>
              </Reveal>

              <div className="grid gap-4 sm:grid-cols-2">
                {trusts.map((trust, i) => (
                  <Reveal key={trust.name} delay={i * 0.05}>
                    <div
                      className={`flex h-full flex-col rounded-2xl border p-5 ${
                        trust.featured
                          ? "border-vk-700 bg-gradient-to-br from-vk-700 to-vk-800 text-white shadow-lift"
                          : "vk-card vk-card-hover"
                      }`}
                    >
                      <span className={`${trust.featured ? "vk-pill-light" : "vk-pill-soft"} mb-3 self-start !normal-case !tracking-normal`}>
                        {trust.role}
                      </span>
                      <h3 className={`text-base font-bold md:text-lg ${trust.featured ? "text-white" : "text-foreground"}`}>
                        {trust.name}
                      </h3>
                      <p className={`mt-1.5 flex-1 text-sm leading-relaxed ${trust.featured ? "text-white/80" : "text-muted-foreground"}`}>
                        {trust.description}
                      </p>
                      {trust.link && (
                        <a
                          href={trust.link}
                          className="mt-4 inline-flex min-h-[40px] items-center gap-1.5 self-start text-sm font-semibold text-vk-500 hover:text-vk-700 hover:underline"
                        >
                          {trust.linkLabel} <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>

            <Reveal>
              <div className="mx-auto mt-10 flex max-w-3xl items-start gap-3 rounded-2xl border border-vk-100 bg-vk-50 p-5 text-sm leading-relaxed text-muted-foreground">
                <Info className="mt-0.5 h-5 w-5 shrink-0 text-vk-500" />
                <p>
                  <strong className="text-foreground">Note:</strong> Hare Krishna Movement India and ISKCON Gambheeram Visakhapatnam
                  are the same organisation — ISKCON is the global name, while HKM India is the registered legal entity
                  in India through which all activities are conducted.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        <WhatsAppCommunityCTA />
      </div>
    </PageLayout>
  );
}
