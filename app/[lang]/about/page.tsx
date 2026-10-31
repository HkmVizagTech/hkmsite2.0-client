"use client";

import PageLayout from "@/components/PageLayout";
import WhatsAppCommunityCTA from "@/components/WhatsAppCommunityCTA";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/site/SectionHeading";
import Reveal from "@/components/site/Reveal";
import Link from "next/link";
import { Heart, BookOpen, Users, Flower2, GraduationCap, ExternalLink, Info, Flame, Utensils, Check, Landmark, Milk, PartyPopper } from "lucide-react";
import Image from "next/image";
import AssociatedTrustsImg from "@/assets/AssociatedTrusts.png";

const values = [
  { icon: Heart, title: "Spiritual Well-being", desc: "Programs designed to nurture the soul and bring inner peace through the teachings of Bhagavad Gita and Srimad Bhagavatam." },
  { icon: BookOpen, title: "Vedic Wisdom", desc: "Deep dive into ancient scriptures to derive practical insights that address modern life's questions and challenges." },
  { icon: Users, title: "Community Service", desc: "Dedicated to feeding the needy, educating the young, and serving society with compassion and devotion." },
  { icon: Flower2, title: "Value Education", desc: "Inculcating timeless values in children through interactive programs, summer camps, and cultural activities." },
];

const activities: { icon: typeof BookOpen; image?: string; title: string; desc: string; href?: string }[] = [
  { icon: BookOpen, title: "Gita Classes", desc: "Regular sessions on Bhagavad-gita and spiritual living", href: "/gita-daan-seva" },
  { icon: Utensils, title: "Annadaan Seva", desc: "Distributing prasadam and helping those in need", href: "/anna-daan-seva" },
  { icon: Milk, image: "/assets/about-cow.png", title: "Cow Care", desc: "Dedicated Gau Seva and compassionate care", href: "/gau-seva" },
  { icon: PartyPopper, title: "Festivals", desc: "Celebrating devotion through festivals and kirtan", href: "/festivals" },
  { icon: GraduationCap, title: "Youth Programs", desc: "Guiding youth through values and spiritual growth" },
];

function ActivityCard({ item }: { item: (typeof activities)[number] }) {
  const body = (
    <>
      {item.image ? (
        <Image src={item.image} alt="" width={40} height={40} className="h-10 w-10 object-contain" />
      ) : (
        <item.icon className="h-10 w-10 stroke-[1.4] text-vk-800" />
      )}
      <h3 className="mt-4 text-base font-bold text-foreground">{item.title}</h3>
      <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted-foreground">{item.desc}</p>
    </>
  );
  const cls = "vk-card flex h-full flex-col items-center p-5 text-center";
  return item.href ? (
    <Link href={item.href} className={`${cls} vk-card-hover`}>
      {body}
    </Link>
  ) : (
    <div className={cls}>{body}</div>
  );
}

const milestones = [
  { year: "2008", event: "Began humble seva activities in Visakhapatnam" },
  { year: "2015", event: "Registered as a trust in Visakhapatnam" },
  { year: "2016", event: "Began regular Bhagavad Gita study circles" },
  { year: "2018", event: "Launched Subhojanam food distribution programme" },
  { year: "2019", event: "Expanded to serve 500+ meals daily at KGH Hospital" },
  { year: "2021", event: "Extended food service to GGH Hospital, Kakinada" },
  { year: "2023", event: "Announced Hare Krishna Vaikuntham Temple project" },
];


const ROOTS_IMAGE = "/assets/about-roots.jpg";
const TEMPLE_AERIAL = "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1793428381313-1793428379864-GoldenTempleinaLushForest.png";
const GOVINDA_SIDE = "https://pub-f62a54aab54448388c9e16334109aea9.r2.dev/Temple%2520Images/govindaSideView.jpg";

const TEMPLE_IMAGE =
  "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1793266487328-1793266486628-MajesticWhiteandGoldHinduTemple.png";

const practices = ["Chanting the Hare Krishna Maha-Mantra", "Studying the Vedic Scriptures", "Honoring sanctified prasadam"];

const highlights = [
  "Sri Sri Radha Madan Mohan and Sri Srinivasa Govinda, worshipped with daily aarti and darshan",
  "A Divine Altar at the heart of the temple, where Lord Srinivasa Govinda will eternally reside",
  "A Vedic Planetarium that presents timeless wisdom through modern technology",
  "A Prasadam Hall to serve Krishna-prasadam to all who come",
  "A Festival Hall and Harinam Mandap for kirtan, celebrations and quiet chanting",
  "Bala Samskriti and Gita Life programmes for children, youth and families",
];

const principles = [
  { title: "Devotion", desc: "Everything we do begins with the worship of Sri Sri Radha Madan Mohan." },
  { title: "Service", desc: "No one who comes to the temple, or to the hospital gate, should go hungry." },
  { title: "Community", desc: "A home for every seeker, whatever their age, background or belief." },
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
          title="About ISKCON Gambheeram, Vizag"
          subtitle="Spreading the timeless message of Lord Krishna through devotion, service, and community"
          breadcrumb="About Us"
          backgroundImage={GOVINDA_SIDE}
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
                  src={TEMPLE_AERIAL}
                  alt="Aerial view of the Hare Krishna Vaikuntham Temple, Visakhapatnam"
                  fill
                  sizes="(min-width: 1024px) 560px, 100vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── OUR SPIRITUAL ROOTS ───────────────────────────────── */}
        <section className="vk-section">
          <div className="vk-container">
            <Reveal className="vk-card mx-auto grid max-w-6xl items-center gap-8 !rounded-3xl p-5 md:p-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12 lg:p-10">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-lift lg:aspect-[7/6]">
                <Image src={ROOTS_IMAGE} alt="Sri Chaitanya Mahaprabhu and His associates in sankirtana" fill sizes="(min-width: 1024px) 520px, 100vw" className="object-cover object-[42%_50%]" />
              </div>
              <div>
                <h2 className="vk-h2">Our Spiritual Roots</h2>
                <p className="mt-4 text-[15px] leading-7 text-muted-foreground md:text-base">
                  The Hare Krishna Movement is an initiative led by His Divine Grace A.C. Bhaktivedanta Swami Srila Prabhupada, with deep reference to
                  the Vedic scriptures like the Bhagavad-gita and Srimad Bhagavatam.
                </p>
                <p className="mt-3 text-[15px] leading-7 text-muted-foreground md:text-base">
                  These sacred texts have been preserved through the Gaudiya Vaishnava disciplic lineage. Our guiding practice offers devotees a
                  practical path to spiritual growth and devotion in today&apos;s modern lifestyle.
                </p>
                <h3 className="mt-6 font-heading text-xl font-bold text-foreground md:text-2xl">Daily Spiritual Practices We Follow:</h3>
                <ul className="mt-4 space-y-2.5">
                  {practices.map((item) => (
                    <li key={item} className="rounded-2xl bg-vk-50 px-4 py-3 text-sm font-medium text-ink md:text-[15px]">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── CORE VALUES ───────────────────────────────────────── */}
        <section className="vk-section">
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

        {/* ── THE GRAND VISION ──────────────────────────────────── */}
        <section className="vk-section vk-band overflow-hidden">
          <div className="vk-container">
            <SectionHeading
              align="center"
              eyebrow="The Vision"
              title="The Grand Vision Behind Hare Krishna Vaikuntham"
              subtitle="A temple and cultural centre at Gambheeram, Visakhapatnam, built so that devotion, learning and service have a permanent home."
            />
            <div className="mx-auto grid max-w-6xl items-start gap-8 lg:grid-cols-[1.05fr_1fr] lg:gap-12">
              <Reveal className="relative">
                <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-[0_30px_60px_-28px_rgba(30,58,138,0.55)]">
                  <Image
                    src={TEMPLE_IMAGE}
                    alt="Artist's impression of the Hare Krishna Vaikuntham Temple"
                    fill
                    sizes="(min-width: 1024px) 600px, 100vw"
                    className="object-cover object-[65%_50%]"
                  />
                </div>
                <div className="mt-4 flex items-start gap-3 rounded-2xl border border-vk-100 bg-vk-50 p-4 text-sm leading-relaxed text-muted-foreground">
                  <Landmark className="mt-0.5 h-5 w-5 shrink-0 text-vk-500" />
                  <p>
                    The Vaikuntham project was announced in 2023. Every <Link href="/sqft-seva-campaign" className="font-semibold text-vk-700 hover:underline">square foot</Link> and{" "}
                    <Link href="/brick-seva-campaign" className="font-semibold text-vk-700 hover:underline">brick</Link> offered by devotees brings it closer to completion.
                  </p>
                </div>
              </Reveal>

              <Reveal delay={0.1}>
                <p className="vk-lead">
                  Hare Krishna Vaikuntham is being built in the white and gold style of the great temples of India, as the
                  permanent home of Sri Sri Radha Madan Mohan and Sri Srinivasa Govinda. It is more than a place of
                  worship. It is planned as a cultural centre where families come to learn, celebrate and be served.
                </p>

                <h3 className="mt-7 flex items-center gap-2 text-lg font-bold text-foreground">
                  <Flame className="h-5 w-5 text-[hsl(var(--gold-deep))]" /> Mission of Devotion and Service
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                  To share the teachings of Bhagavad Gita and Srimad Bhagavatam, to feed the hungry with sanctified prasadam,
                  and to nurture children and youth with timeless values.
                </p>

                <h3 className="mt-7 text-lg font-bold text-foreground">Key Highlights</h3>
                <ul className="mt-3 space-y-2.5">
                  {highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2.5 text-[15px] leading-relaxed text-muted-foreground">
                      <Check className="mt-1 h-4 w-4 shrink-0 text-vk-600" />
                      {h}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>

            <div className="mx-auto mt-10 max-w-6xl">
              <h3 className="mb-4 text-center text-lg font-bold text-foreground">Guiding Principles</h3>
              <div className="grid gap-4 md:grid-cols-3 md:gap-6">
                {principles.map((p, i) => (
                  <Reveal key={p.title} delay={i * 0.06}>
                    <div className="vk-card h-full border-t-2 border-t-[hsl(var(--gold))] p-5 text-center">
                      <h4 className="text-base font-bold text-vk-800">{p.title}</h4>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── ACTIVITIES ────────────────────────────────────────── */}
        <section className="vk-section">
          <div className="vk-container">
            <div className="mx-auto max-w-7xl rounded-3xl bg-vk-50 px-4 py-10 md:px-8 md:py-14">
              <SectionHeading
                align="center"
                title={<>Our <span className="text-vk-600">Activities</span> and <span className="text-vk-600">Initiatives</span></>}
                subtitle="Creating an impact through devotion and service at the Hare Krishna temple."
              />
              <div className="grid grid-cols-2 gap-3 md:gap-5 lg:grid-cols-5">
                {activities.map((item, i) => (
                  <Reveal key={item.title} delay={i * 0.05} className={i === activities.length - 1 ? "col-span-2 lg:col-span-1" : ""}>
                    <ActivityCard item={item} />
                  </Reveal>
                ))}
              </div>
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
                      <div className="relative z-[1] flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[hsl(var(--gold))] to-[hsl(var(--gold-deep))] text-xs font-extrabold text-vk-900 ring-4 ring-[hsl(var(--gold)/0.25)] md:absolute md:left-1/2 md:-translate-x-1/2">
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

        {/* ── INVITATION ────────────────────────────────────────── */}
        <section className="vk-section vk-band">
          <div className="vk-container">
            <Reveal className="mx-auto max-w-3xl text-center">
              <span className="vk-pill mb-4">Join Us</span>
              <h2 className="vk-h2">An Invitation to Begin Your Journey</h2>
              <p className="vk-lead mt-5">
                Come for darshan, sit for a Gita class, take prasadam, or offer a seva. However you begin, you are welcome
                at Hare Krishna Vaikuntham.
              </p>
              <div className="mt-7 space-y-1.5 font-serif-display text-lg italic leading-8 text-vk-800 md:text-xl">
                <p>Hare Krishna Hare Krishna Krishna Krishna Hare Hare</p>
                <p>Hare Rama Hare Rama Rama Rama Hare Hare</p>
              </div>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link href="/donate" className="vk-btn-gold h-12 px-7 text-[15px] font-bold">Offer a Seva</Link>
                <Link href="/daily-schedule" className="inline-flex h-12 items-center rounded-xl border border-vk-100 bg-white px-6 text-[15px] font-bold text-vk-800 hover:bg-vk-50">Temple Timings</Link>
              </div>
            </Reveal>
          </div>
        </section>

        <WhatsAppCommunityCTA />
      </div>
    </PageLayout>
  );
}
