"use client";

import { Clock, Sun, Sunrise, Sunset, Moon, Music, BookOpen, Heart, Camera, Shirt, Utensils, Hourglass, Store } from "lucide-react";
import Image from "next/image";
import PageLayout from "@/components/PageLayout";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/site/SectionHeading";
import Reveal from "@/components/site/Reveal";

const schedule = [
  { time: "4:30 AM", event: "Mangala Aarti", icon: Moon, desc: "The first aarti of the day, offered in the pre-dawn hours to awaken the Lord from His divine rest." },
  { time: "5:00 AM", event: "Tulsi Puja & Japa", icon: Heart, desc: "Devotees circumambulate Tulsi Devi and chant the Hare Krishna Maha-mantra on their beads." },
  { time: "7:15 AM", event: "Shringar Darshan", icon: Sunrise, desc: "The deities are beautifully dressed and decorated for the morning darshan." },
  { time: "7:30 AM", event: "Guru Puja", icon: Music, desc: "Worship of the spiritual master with kirtan, flower offerings, and devotional songs." },
  { time: "8:00 AM", event: "Srimad Bhagavatam Class", icon: BookOpen, desc: "Daily discourse on Srimad Bhagavatam, the ripened fruit of the Vedic literature." },
  { time: "12:00 PM", event: "Raj Bhog Aarti", icon: Sun, desc: "Grand noon offering with elaborate bhog preparation for the Lord." },
  { time: "1:00 PM", event: "Prasadam Distribution", icon: Heart, desc: "Sanctified food is distributed to all visitors and devotees present." },
  { time: "4:15 PM", event: "Temple Reopens", icon: Sunset, desc: "The temple doors reopen after the Lord's afternoon rest period." },
  { time: "6:30 PM", event: "Sandhya Aarti", icon: Sunset, desc: "Evening aarti with beautiful kirtan as the sun sets — a deeply moving ceremony." },
  { time: "7:00 PM", event: "Bhagavad Gita Class", icon: BookOpen, desc: "Evening discourse on the Bhagavad Gita — the Song of God spoken by Lord Krishna." },
  { time: "8:30 PM", event: "Shayan Aarti", icon: Moon, desc: "The final aarti of the day, putting the Lord to rest for the night." },
];

const specialPrograms = [
  {
    title: "Sunday Love Feast",
    day: "Every Sunday",
    time: "5:00 PM - 8:30 PM",
    desc: "A grand weekly celebration with kirtan, discourse, and sumptuous prasadam feast open to all.",
    image: "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1783677824913-1783677824553-Screenshot2026-07-10153331.png",
  },
  {
    title: "Ekadashi Program",
    day: "Twice a Month",
    time: "6:00 AM - 8:00 PM",
    desc: "Special fasting day programs with extended kirtan, readings from scriptures, and spiritual discussions.",
    image: "/assets/gallery-aarti.jpg",
  },
  {
    title: "Saturday Satsang",
    day: "Every Saturday",
    time: "6:00 PM - 8:00 PM",
    desc: "Community satsang with bhajans, Q&A on spiritual topics, and light prasadam.",
    image: "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1783677824913-1783677824553-Screenshot2026-07-10153331.png",
  },
];

const visitInfo = [
  {
    icon: Clock,
    title: "Temple Hours",
    lines: ["Mangala Darshan: 4:30 AM – 5:00 AM", "Morning: 7:15 AM – 12:20 PM", "Evening: 4:15 PM – 8:15 PM"],
  },
  {
    icon: Hourglass,
    title: "Rest Period",
    lines: ["The temple is closed for darshan between 5:00 AM and 7:15 AM, and again between 12:20 PM and 4:15 PM, while the Lord rests."],
  },
  {
    icon: Shirt,
    title: "Dress Code",
    lines: ["Modest, traditional attire is encouraged. Please remove footwear before entering the temple hall."],
  },
];

const guidelines = [
  {
    icon: Camera,
    title: "Photography",
    lines: ["Photography is allowed during darshan. Flash photography and video recording may be restricted during special events."],
  },
  {
    icon: Utensils,
    title: "Prasadam",
    lines: ["Free prasadam is served after the morning Bhagavatam class and after the Sunday Love Feast program."],
  },
  {
    icon: Store,
    title: "Book Store",
    lines: ["Sacred literature by Srila Prabhupada, devotional items, and spiritual accessories are available at the temple bookstore."],
  },
];

function InfoColumn({ title, items }: { title: string; items: typeof visitInfo }) {
  return (
    <Reveal>
      <h2 className="vk-bar-title mb-5 text-2xl text-foreground md:text-[1.75rem]">{title}</h2>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.title} className="vk-card flex gap-4 p-5">
            <span className="vk-icon-chip">
              <item.icon className="h-5 w-5" />
            </span>
            <div>
              <h3 className="mb-1 text-[15px] font-bold text-foreground md:text-base">{item.title}</h3>
              {item.lines.map((line) => (
                <p key={line} className="text-sm leading-relaxed text-muted-foreground md:text-[15px]">
                  {line}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Reveal>
  );
}

export default function DailySchedulePage() {
  return (
    <PageLayout>
      <div className="pt-[var(--header-h)]">
        <PageHero
          title="Daily Schedule"
          subtitle="Temple timings, aarti schedule & spiritual programs"
          breadcrumb="Daily Schedule"
          backgroundImage="/assets/gallery-aarti.jpg"
        />

        {/* ── DAILY TIMELINE ────────────────────────────────────── */}
        <section className="vk-section">
          <div className="vk-container">
            <SectionHeading
              align="center"
              eyebrow="Temple Timings"
              title="Daily Program Schedule"
              subtitle="The temple follows a sacred daily routine established by Srila Prabhupada for all ISKCON temples worldwide."
            />

            <ol className="relative mx-auto max-w-3xl">
              <span aria-hidden className="absolute bottom-8 left-[21px] top-8 w-0.5 bg-vk-200 md:left-[121px]" />
              {schedule.map((item, i) => (
                <Reveal as="li" key={item.time} delay={Math.min(i, 6) * 0.04} className="relative pb-3 last:pb-0 md:pb-4">
                  <div className="flex items-start gap-3 md:gap-5">
                    <div className="hidden w-20 shrink-0 pt-5 text-right md:block">
                      <span className="font-heading text-sm font-bold text-vk-700">{item.time}</span>
                    </div>
                    <span className="relative z-[1] mt-3 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-vk-100 text-vk-700 ring-4 ring-white">
                      <item.icon className="h-[18px] w-[18px]" />
                    </span>
                    <div className="vk-card vk-card-hover flex-1 p-4 md:p-5">
                      <span className="vk-pill-soft mb-2 md:hidden">{item.time}</span>
                      <h3 className="text-base font-bold text-foreground md:text-lg">{item.event}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground md:text-[15px]">{item.desc}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* ── SPECIAL PROGRAMS ──────────────────────────────────── */}
        <section className="vk-section vk-band">
          <div className="vk-container">
            <SectionHeading align="center" eyebrow="Weekly Programs" title="Special Programs" />
            <div className="grid gap-5 md:grid-cols-3">
              {specialPrograms.map((prog, i) => (
                <Reveal key={prog.title} delay={i * 0.08}>
                  <article className="vk-card vk-card-hover group flex h-full flex-col overflow-hidden">
                    <div className="relative h-48 overflow-hidden bg-vk-100">
                      <Image
                        src={prog.image}
                        alt={prog.title}
                        fill
                        sizes="(min-width: 768px) 33vw, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-5 md:p-6">
                      <span className="vk-pill-soft mb-3 self-start !normal-case !tracking-normal">
                        <Clock className="h-3.5 w-3.5" />
                        {prog.day} · {prog.time}
                      </span>
                      <h3 className="text-xl font-bold text-foreground">{prog.title}</h3>
                      <p className="mt-1.5 text-[15px] leading-relaxed text-muted-foreground">{prog.desc}</p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── VISIT INFO + GUIDELINES ───────────────────────────── */}
        <section className="vk-section">
          <div className="vk-container grid gap-10 md:grid-cols-2 lg:gap-14">
            <InfoColumn title="Visit Us" items={visitInfo} />
            <InfoColumn title="Guidelines" items={guidelines} />
          </div>
        </section>

        {/* ── MAHA MANTRA ───────────────────────────────────────── */}
        <section className="pb-10 md:pb-16">
          <div className="vk-container">
            <Reveal>
              <div className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-vk-600 via-vk-700 to-vk-900 px-6 py-12 text-center md:px-12 md:py-16">
                <div aria-hidden className="absolute -right-16 -top-16 -z-10 h-60 w-60 rounded-full bg-white/10" />
                <div aria-hidden className="absolute -bottom-20 -left-12 -z-10 h-52 w-52 rounded-full bg-vk-500/25" />
                <span className="vk-pill-light mb-6">The Maha Mantra</span>
                <h2 className="vk-h2 mx-auto max-w-3xl !leading-snug !text-white md:!text-5xl">
                  Hare Krishna Hare Krishna<br />
                  Krishna Krishna Hare Hare<br />
                  Hare Rama Hare Rama<br />
                  Rama Rama Hare Hare
                </h2>
                <p className="mx-auto mt-6 max-w-2xl font-serif-display text-lg italic leading-relaxed text-white/85">
                  &quot;Simply by chanting the Holy Name of the Lord, one can attain the highest perfection of life.&quot;
                </p>
                <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-white/65">— Srila Prabhupada</p>
              </div>
            </Reveal>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
