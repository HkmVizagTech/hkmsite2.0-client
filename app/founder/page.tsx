"use client";

import PageLayout from "@/components/PageLayout";
import WhatsAppCommunityCTA from "@/components/WhatsAppCommunityCTA";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/site/SectionHeading";
import Reveal from "@/components/site/Reveal";
import Image from "next/image";
import { BookOpen, Globe, Award, Heart, Star, Users, Sparkles, MapPin, Ship, Landmark, GraduationCap, Quote } from "lucide-react";


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
  { year: "1896", title: "Birth", desc: "Born on September 1st in Calcutta (now Kolkata) as Abhay Charan De, on the auspicious day after Janmashtami.", icon: Star },
  { year: "1916", title: "Graduation", desc: "Completed graduation from Scottish Church College in Calcutta with a degree in English, Philosophy, and Economics.", icon: GraduationCap },
  { year: "1922", title: "Meeting Spiritual Master", desc: "First meeting with His Divine Grace Srila Bhaktisiddhanta Saraswati Goswami Maharaja in Calcutta, who urged him to spread Vedic knowledge in the English language.", icon: Heart },
  { year: "1933", title: "Formal Initiation", desc: "Formally initiated as Abhay Charanaravinda Das by Srila Bhaktisiddhanta Saraswati at Allahabad. Received the instruction to spread Krishna consciousness in English.", icon: Award },
  { year: "1944", title: "Back to Godhead", desc: "Single-handedly launched 'Back to Godhead' magazine — writing, editing, printing, and distributing it himself. The magazine continues to this day in over 40 languages.", icon: BookOpen },
  { year: "1947", title: "Title of Bhaktivedanta", desc: "Honored with the title 'Bhaktivedanta' by the Gaudiya Vaisnava Society in recognition of his deep realization and scholarly presentation of Vedic knowledge.", icon: Award },
  { year: "1950", title: "Vanaprastha", desc: "At age 54, retired from married life and moved to the historic Radha-Damodara temple in Vrindavan, beginning intensive study and writing.", icon: Landmark },
  { year: "1959", title: "Sannyasa", desc: "Accepted the renounced order of life (sannyasa) and began publishing the Srimad-Bhagavatam with English translations and elaborate purports.", icon: Sparkles },
  { year: "1965", title: "Journey to America", desc: "At age 69, boarded the cargo ship Jaladuta with just 40 rupees and a trunk of books. After a 35-day voyage, arrived in New York City to begin his world mission.", icon: Ship },
  { year: "1966", title: "ISKCON Founded", desc: "Established the International Society for Krishna Consciousness (ISKCON) in New York City with a handful of followers in a small storefront.", icon: Globe },
  { year: "1968", title: "New Vrindavan", desc: "Established the first Hare Krishna farm community in West Virginia, embodying the ideal of simple living and high thinking.", icon: MapPin },
  { year: "1970", title: "GBC Formed", desc: "Established the Governing Body Commission (GBC) to manage the worldwide affairs of ISKCON, ensuring the movement's continuity.", icon: Users },
  { year: "1972", title: "Bhagavad-gita As It Is", desc: "Published the complete edition of Bhagavad-gita As It Is through Macmillan Publishers. It became the most widely read edition of the Gita in the world.", icon: BookOpen },
  { year: "1975", title: "World Tours", desc: "Continued extensive world tours, opening temples in major cities across Africa, South America, and Asia. Over 100 centers operating worldwide.", icon: Globe },
  { year: "1977", title: "Departure", desc: "On November 14th, at the Krishna-Balarama Mandir in Vrindavan, Srila Prabhupada departed this world, leaving behind a legacy that continues to transform millions of lives.", icon: Star },
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
  return (
    <PageLayout>
      <div className="pt-[var(--header-h)]">
        <PageHero
          title="His Divine Grace Srila Prabhupada"
          subtitle="Founder-Acharya of the Worldwide Hare Krishna Movement"
          breadcrumb="About Founder"
        />

        {/* ── BIOGRAPHY — feature split ─────────────────────────── */}
        <section className="vk-section">
          <div className="vk-container grid items-start gap-10 md:grid-cols-5 lg:gap-14">
            <Reveal className="md:col-span-2 md:sticky md:top-[calc(var(--header-h)+1.5rem)]">
              <div className="relative mx-auto max-w-sm md:max-w-none">
                <div aria-hidden className="absolute -inset-3 -z-10 -rotate-3 rounded-[2rem] bg-gradient-to-br from-vk-200/80 via-vk-100/70 to-transparent" />
                <div className="overflow-hidden rounded-3xl shadow-[0_30px_60px_-28px_rgba(30,58,138,0.55)]">
                  <Image
                    src="https://res.cloudinary.com/ddmzeqpkc/image/upload/prabhupada_home"
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
                      <div className="font-heading text-2xl font-extrabold text-white md:text-3xl">{a.value}</div>
                      <p className="mt-1 text-xs font-medium text-white/70 md:text-[13px]">{a.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
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
        <section className="vk-section">
          <div className="vk-container">
            <SectionHeading align="center" eyebrow="Milestone Timeline" title="A Life of Extraordinary Devotion" />
            <ol className="relative mx-auto max-w-4xl">
              <span aria-hidden className="absolute bottom-0 left-5 top-0 w-0.5 bg-gradient-to-b from-vk-200 via-vk-300 to-vk-200 md:left-1/2 md:-translate-x-1/2" />
              {timeline.map((item, i) => {
                const isLeft = i % 2 === 0;
                return (
                  <Reveal as="li" key={item.year} className="relative pb-6 last:pb-0 md:pb-8">
                    <div className={`relative flex items-start ${isLeft ? "md:flex-row" : "md:flex-row-reverse"}`}>
                      <span className="absolute left-5 top-4 z-[1] flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full bg-vk-700 text-white ring-4 ring-white md:left-1/2">
                        <item.icon className="h-4 w-4" />
                      </span>
                      <div className={`ml-14 w-full md:ml-0 md:w-[calc(50%-2.5rem)] ${isLeft ? "md:text-right" : ""}`}>
                        <div className="vk-card vk-card-hover p-5">
                          <span className="vk-pill-soft">{item.year}</span>
                          <h3 className="mt-2.5 text-lg font-bold text-foreground">{item.title}</h3>
                          <p className="mt-1.5 text-[15px] leading-relaxed text-muted-foreground">{item.desc}</p>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
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

        {/* ── QUOTE ─────────────────────────────────────────────── */}
        <section className="pb-4">
          <div className="vk-container">
            <Reveal>
              <div className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-vk-600 via-vk-700 to-vk-900 px-6 py-12 text-center md:px-12 md:py-16">
                <div aria-hidden className="absolute -bottom-20 -right-16 -z-10 h-64 w-64 rounded-full bg-white/10" />
                <Quote aria-hidden className="mx-auto mb-4 h-10 w-10 text-white/30" />
                <span className="vk-pill-light mb-5">His Words</span>
                <blockquote className="mx-auto max-w-3xl font-serif-display text-2xl italic leading-relaxed text-white md:text-3xl">
                  &quot;I am not this body. I am a spirit soul, part and parcel of the Supreme Lord. My real business is to serve Him with love and devotion.&quot;
                </blockquote>
                <p className="mt-5 text-sm font-semibold uppercase tracking-[0.14em] text-white/70">— Srila Prabhupada</p>
              </div>
            </Reveal>
          </div>
        </section>

        <WhatsAppCommunityCTA />
      </div>
    </PageLayout>
  );
}
