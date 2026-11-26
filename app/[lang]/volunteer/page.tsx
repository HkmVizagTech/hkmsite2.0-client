"use client";

import Image from "next/image";
import {
  Heart,
  HandHeart,
  Users,
  Sparkles,
  Smartphone,
  ArrowRight,
  ClipboardEdit,
  PhoneCall,
  Flame,
} from "lucide-react";
import PageLayout from "@/components/PageLayout";
import SectionHeading from "@/components/site/SectionHeading";
import Reveal from "@/components/site/Reveal";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import FaqSection from "@/components/sqft-campaign/FaqSection";
import VolunteerSignupForm from "@/components/volunteer/VolunteerSignupForm";
// Sign-ups from the form are saved on our own server (Admin → Volunteer Sign-ups).
// The Vaikuntham app is for festival duties/reminders; store links live in VaikunthamAppPromo.
import { AppStoreButtons } from "@/components/VaikunthamAppPromo";

const WA_HELP =
  "https://wa.me/918977761187?text=Hare%20Krishna!%20I%20would%20like%20to%20volunteer%20at%20HKM%20Vizag.";

const HERO_DESKTOP = "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1795688484987-1795688482809-VolunteerDesktop1920x700.png";
const HERO_MOBILE = "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1795688484476-1795688479563-VolunteerMobile1080x1350.png";

const WAYS_TO_SERVE = [
  {
    image: "/assets/patron/pillar.jpg",
    title: "Festivals & Events",
    desc: "Janmashtami, Kartik Deepotsava, Ekadashi and more — crowd guidance, decoration, queues and stage seva.",
  },
  {
    image: "/assets/home-explore-subhojanam.webp",
    title: "Prasadam & Subhojanam",
    desc: "Cook, serve and distribute Krishna prasadam, and help the daily Subhojanam anna-daan reach those in need.",
  },
  {
    image: "/assets/patron/family.jpg",
    title: "Temple Services",
    desc: "Garlands, flower and altar decoration, cleaning and everyday care that keeps the Lord's home beautiful.",
  },
  {
    image: "/assets/patron/blessings.jpg",
    title: "Outreach & Programs",
    desc: "Kirtan, book distribution and community programs — help carry Krishna consciousness to the city.",
  },
];

const WHY_VOLUNTEER = [
  { icon: Heart, title: "Serve the Lord", desc: "Every act of service in the temple is an offering to Lord Krishna — the highest form of devotion." },
  { icon: Users, title: "Build Community", desc: "Connect with like-minded devotees and create lasting bonds through selfless service together." },
  { icon: Sparkles, title: "Spiritual Growth", desc: "Volunteering purifies the heart and accelerates your spiritual journey through karma yoga." },
  { icon: HandHeart, title: "Make an Impact", desc: "Help feed thousands, organize festivals and bring smiles to every visitor who walks in." },
];

const STEPS = [
  { icon: ClipboardEdit, title: "Register", desc: "Share your contact details, your skill and when you are available. It takes about a minute." },
  { icon: PhoneCall, title: "We Connect", desc: "A devotee from our volunteer team reaches out on WhatsApp and matches you with a seva." },
  { icon: Flame, title: "Start Serving", desc: "Join your first seva at the temple — we will guide you every step of the way." },
];

const VOLUNTEER_FAQS = [
  {
    q: "Who can volunteer at the temple?",
    a: "Anyone with a sincere wish to serve — students, families, working professionals and seniors are all welcome. No prior experience is needed; a devotee will guide you on the day.",
  },
  {
    q: "How do I register as a volunteer?",
    a: "Fill in the short registration form at the top of this page with your name, email, mobile number, skill, availability and preferred start date. Our volunteer team will contact you with upcoming opportunities.",
  },
  {
    q: "How much time do I have to give?",
    a: "As much or as little as you like. Pick a single festival day, a few hours on a weekend, or a regular weekly seva — you choose the slots you can commit to.",
  },
  {
    q: "What is the Vaikuntham app for?",
    a: "Vaikuntham is our official app for festival and temple activities. Use it to browse upcoming sevas, confirm your slot in a tap and receive duty reminders on your phone.",
  },
  {
    q: "I am having trouble or want a different kind of seva. Who can help?",
    a: "Message us on WhatsApp at +91 89777 61187 and a devotee will help you personally.",
  },
];

export default function VolunteerPage() {
  return (
    <PageLayout>
      <div className="pt-[var(--header-h)]">
        {/* ───────── Hero ───────── */}
        <section className="bg-[#FDF5E1]">
          <h1 className="sr-only">Volunteer at ISKCON Gambheeram Vizag: Serve with Love, Volunteer with Us</h1>
          <Image
            src={HERO_DESKTOP}
            alt="Serve with love, volunteer with us. Offer your time and talents in the service of Sri Sri Radha Madan Mohan. Be part of our temple volunteer community."
            width={1920}
            height={700}
            priority
            sizes="100vw"
            className="mx-auto hidden h-auto w-full max-w-[1920px] md:block"
          />
          <Image
            src={HERO_MOBILE}
            alt="Serve with love, volunteer with us. Offer your time and talents in the service of Sri Sri Radha Madan Mohan."
            width={1080}
            height={1350}
            priority
            sizes="100vw"
            className="mx-auto h-auto w-full max-w-[560px] md:hidden"
          />
        </section>

        {/* ───────── Registration card (overlaps the hero) ───────── */}
        <section id="register" className="relative z-10 mt-8 scroll-mt-[var(--header-h)] px-4 md:mt-10">
          <Reveal>
            <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-white/60 bg-white shadow-[0_30px_80px_-20px_rgba(10,18,51,0.45)]">
              <div className="h-1.5 bg-gradient-to-r from-[#F6C752] via-[#E8A317] to-[#F6C752]" />
              <div className="p-5 md:p-8">
                <div className="mb-5 flex flex-wrap items-end justify-between gap-2">
                  <div>
                    <h2 className="text-2xl font-extrabold text-foreground md:text-3xl">Become a Volunteer</h2>
                    <p className="mt-1 text-sm text-muted-foreground md:text-[15px]">Tell us how you would like to serve. Our team will get in touch with your first seva.</p>
                  </div>
                </div>
                <VolunteerSignupForm />
              </div>
            </div>
          </Reveal>
        </section>

        {/* ───────── Ways to serve ───────── */}
        <section className="vk-section">
          <div className="vk-container">
            <SectionHeading
              align="center"
              eyebrow="Ways To Serve"
              title="Find the Seva That Suits You"
              subtitle="There is a place for every skill and every schedule. Here is where our volunteers serve."
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-5">
              {WAYS_TO_SERVE.map((w, i) => (
                <Reveal key={w.title} delay={i * 0.07}>
                  <article className="group relative isolate h-80 overflow-hidden rounded-3xl bg-vk-900 shadow-md md:h-96">
                    <Image
                      src={w.image}
                      alt={w.title}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                      className="-z-10 object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-vk-900 via-vk-900/55 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-5">
                      <span className="mb-3 block h-1 w-10 rounded-full bg-gradient-to-r from-[#F6C752] to-[#E8A317] transition-all duration-500 group-hover:w-16" />
                      <h3 className="text-xl font-bold text-white">{w.title}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-white/80">{w.desc}</p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
            <Reveal>
              <div className="mt-8 text-center">
                <a href="#register" className="vk-btn-primary px-7 py-3">
                  Register to Volunteer <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ───────── Why volunteer ───────── */}
        <section className="vk-section vk-band">
          <div className="vk-container">
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
              <Reveal>
                <div className="relative mx-auto max-w-xl">
                  <div aria-hidden className="absolute -inset-3 -z-10 rotate-2 rounded-[2rem] bg-gradient-to-br from-[#F6C752]/60 to-vk-300/40" />
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] shadow-xl">
                    <Image
                      src="/assets/donations-annadana-real.jpg"
                      alt="Volunteers and devotees serving prasadam at the Subhojanam kitchen"
                      fill
                      sizes="(min-width: 1024px) 560px, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-5 left-5 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-xl">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#FFE6A3] to-[#F6C752] text-vk-900">
                      <Heart className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-sm font-bold text-foreground">Seva with devotion</p>
                      <p className="text-xs text-muted-foreground">Every hour is an offering</p>
                    </div>
                  </div>
                </div>
              </Reveal>

              <div>
                <SectionHeading eyebrow="Why Volunteer" title="The Joy of Selfless Service" />
                <ul className="mt-2 space-y-5">
                  {WHY_VOLUNTEER.map((item, i) => (
                    <Reveal as="li" key={item.title} delay={i * 0.06}>
                      <div className="flex gap-4">
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-vk-600 to-vk-800 text-white shadow-md">
                          <item.icon className="h-6 w-6" />
                        </span>
                        <div>
                          <h3 className="text-lg font-bold text-foreground">{item.title}</h3>
                          <p className="mt-1 text-[15px] leading-relaxed text-muted-foreground">{item.desc}</p>
                        </div>
                      </div>
                    </Reveal>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ───────── How it works ───────── */}
        <section className="vk-section">
          <div className="vk-container">
            <SectionHeading align="center" eyebrow="How It Works" title="Three Simple Steps" />
            <ol className="relative mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
              <div aria-hidden className="absolute left-[16%] right-[16%] top-9 hidden h-0.5 border-t-2 border-dashed border-vk-200 md:block" />
              {STEPS.map((step, i) => (
                <Reveal as="li" key={step.title} delay={i * 0.1}>
                  <div className="relative text-center">
                    <span className="relative mx-auto mb-5 flex h-[72px] w-[72px] items-center justify-center rounded-full bg-gradient-to-br from-[#FFE6A3] to-[#F6C752] text-vk-900 shadow-lg ring-8 ring-white">
                      <step.icon className="h-8 w-8" />
                      <span className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-vk-700 text-sm font-bold text-white">
                        {i + 1}
                      </span>
                    </span>
                    <h3 className="text-xl font-bold text-foreground">{step.title}</h3>
                    <p className="mx-auto mt-2 max-w-xs text-[15px] leading-relaxed text-muted-foreground">{step.desc}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* ───────── Vaikuntham app ───────── */}
        <section id="app" className="px-4 pb-14 md:pb-20">
          <Reveal>
            <div className="relative isolate mx-auto flex max-w-5xl flex-col items-center gap-6 overflow-hidden rounded-3xl bg-gradient-to-br from-vk-600 via-vk-700 to-vk-900 p-7 text-center md:flex-row md:p-10 md:text-left">
              <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 -z-10 h-60 w-60 rounded-full bg-white/10" />
              <div aria-hidden className="pointer-events-none absolute -bottom-20 left-10 -z-10 h-48 w-48 rounded-full bg-[#F6C752]/15" />
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-white">
                <Smartphone className="h-8 w-8" />
              </span>
              <div className="flex-1">
                <h2 className="text-2xl font-extrabold text-white md:text-3xl">Get Duty Reminders on the Vaikuntham App</h2>
                <p className="mt-2 max-w-xl text-[15px] text-white/85">
                  Browse every upcoming seva, confirm your slot in a tap and get reminders on your phone. Free on Android and iPhone.
                </p>
              </div>
              <AppStoreButtons className="shrink-0 justify-center" />
            </div>
          </Reveal>
        </section>

        {/* ───────── FAQ ───────── */}
        <FaqSection faqs={VOLUNTEER_FAQS} tone="mint" />

        {/* ───────── Final call to action ───────── */}
        <section className="relative isolate overflow-hidden bg-vk-900">
          <Image src="/assets/home-subhojanam-banner.webp" alt="" fill sizes="100vw" className="-z-20 object-cover object-[50%_35%]" />
          <div aria-hidden className="absolute inset-0 -z-10 bg-vk-900/60" />
          <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(10,18,51,0.55)_0%,rgba(10,18,51,0)_70%)]" />
          <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-1 bg-gradient-to-r from-[#F6C752] via-[#E8A317] to-[#F6C752]" />
          <div className="vk-container py-16 text-center md:py-24">
            <Reveal>
              <h2 className="mx-auto max-w-2xl text-3xl font-extrabold leading-tight text-white md:text-4xl">
                Your seva is waiting. <span className="text-[#F6C752]">Join us today.</span>
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-white/80">
                Even a few hours of service can change someone&apos;s day — and yours.
              </p>
              <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <a href="#register" className="vk-btn-gold px-8 py-3.5 text-base">
                  Register as a Volunteer <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href={WA_HELP}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/40 px-7 py-3.5 text-base font-semibold text-white transition hover:bg-white/10"
                >
                  <WhatsAppIcon className="h-5 w-5 fill-current" /> Chat on WhatsApp
                </a>
              </div>
            </Reveal>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
