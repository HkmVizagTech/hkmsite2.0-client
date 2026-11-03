"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import {
  Users, Sparkles, Crown, ScrollText, ArrowRight, Send, Phone, Mail, Clock, Loader2,
  CheckCircle2, BookOpen, Quote, Home, ChevronRight, Gift,
} from "lucide-react";
import PageLayout from "@/components/PageLayout";
import SectionHeading from "@/components/site/SectionHeading";
import Reveal from "@/components/site/Reveal";
import WhatsAppCommunityCTA from "@/components/WhatsAppCommunityCTA";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

const pillars = [
  {
    title: "Be a Pillar of Spiritual Growth",
    text: "As a Patron, your support helps construct a temple that will serve as a center of devotion, spiritual education, and community service. This temple will inspire and transform countless lives, fostering a deeper connection with Lord Krishna.",
  },
  {
    title: "Embrace the Spiritual Journey",
    text: "Your patronage is a commitment to both spiritual growth and devotion. By supporting the Hare Krishna Vaikuntham temple, you contribute to the creation of a sacred space for generations to come.",
  },
];

const privileges = [
  {
    icon: ScrollText,
    eyebrow: "Recognition",
    title: "Honors for Patrons",
    text: "As a Patron, your family will be recognized through a name inscription in the temple. You will also receive spiritual tokens, such as the sacred vastra and personalized gifts, symbolizing your participation in this divine cause.",
    image: "/assets/patron/honors.jpg",
    alt: "Patron family name inscription plaque beneath the lotus feet of the Lord",
  },
  {
    icon: Users,
    eyebrow: "Together as a family",
    title: "Family Connect",
    text: "Patronage brings your family closer to spiritual growth, ensuring future generations remain connected to Lord Krishna. You will be invited to participate in festivals, rituals, and other spiritual engagements that strengthen your family\u2019s bond with the temple and its mission.",
    image: "/assets/patron/family.jpg",
    alt: "Patron family offering a plate of prasadam before the Deities",
  },
  {
    icon: Sparkles,
    eyebrow: "Sacred participation",
    title: "Special Blessings",
    text: "As a Patron, you are granted the opportunity to engage in significant temple ceremonies, such as personalized pujas and special blessings during key rituals and festivals. These spiritual experiences will not only enrich your journey but also ensure your ongoing connection with the divine.",
    image: "/assets/patron/blessings.jpg",
    alt: "Devotees and patrons performing a bhoomi puja ceremony",
  },
];

const scriptures = [
  { name: "Vamana Purana", text: "Whoever constructs or helps to construct a Vishnu temple will protect eight generations of fathers and forefathers from falling into hell." },
  { name: "Narasimha Purana", text: "Oh Devoted One, who builds a beautiful temple for Lord Narasimhadeva will be freed from all sinful reactions and he will enter the Vaikuntha planets." },
  { name: "Skanda Purana", text: "Just by starting the construction of temple for Lord Krishna, sins committed in seven births will be wiped out and one will deliver his forefathers who are suffering in the hellish planet." },
  { name: "Vishnu Dharmottara", text: "A person who builds a temple of Sri Vishnu will get the same results as performing the Rajasuya Yagna & Ashwamedha Yagna." },
  { name: "Vamana Purana", text: "By building a temple for Sri Madhava, one can attain the eternal spiritual world (Vaikuntha). One who offers a garden laden with fruits and flowers for the service of the Deity will attain heavenly pleasures." },
  { name: "Srimad Bhagavatam", text: "One who offers the Deity gifts of lands, markets, cities and villages so that the regular worship and special festivals of the Deity may go on continually will achieve to My Own." },
];

// Visible field borders (the default pale outline almost disappears on a white card) plus a faint tint so each field reads as a box.
const inputCls = "vk-input !border-[#9FB3F0] !bg-[#F8FAFF] hover:!border-[#7F9BEF] focus:!bg-white";

function Field({ label, required, hint, children }: { label: string; required?: boolean; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-baseline justify-between text-[13px] font-semibold text-foreground">
        <span>
          {label}
          {required && <span className="ml-0.5 text-[#C2410C]" aria-hidden="true">*</span>}
        </span>
        {hint && <span className="text-xs font-normal text-muted-foreground">{hint}</span>}
      </span>
      {children}
    </label>
  );
}

const emptyForm = { firstName: "", lastName: "", email: "", phone: "", city: "", state: "", message: "" };

export default function PatronClient() {
  const { toast } = useToast();
  const [form, setForm] = useState(emptyForm);
  const [authorization, setAuthorization] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [verse, setVerse] = useState(0);

  const set = (k: keyof typeof emptyForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorization) {
      toast({
        title: "Authorization required",
        description: "Please authorize us to contact you about patronage.",
        variant: "destructive",
      });
      return;
    }
    setSending(true);
    try {
      const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "") || "http://localhost:8080";
      const res = await fetch(`${apiUrl}/patron-requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, authorization }),
      });
      if (!res.ok) throw new Error("Failed");
      setSent(true);
      setForm(emptyForm);
      setAuthorization(false);
    } catch {
      toast({
        title: "Couldn't send your request",
        description: "Please try again, or write to us at social@hkmvizag.org",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <PageLayout>
      <div className="pt-[var(--header-h)]">
        {/* HERO */}
        <section className="relative isolate overflow-hidden bg-vk-900 text-white">
          <Image src="/assets/vizag-temple-1.jpeg" alt="" fill priority sizes="100vw" className="-z-20 object-cover opacity-40" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-vk-900 via-vk-900/85 to-vk-900/40" />
          <div className="pointer-events-none absolute -right-24 -top-24 -z-10 h-96 w-96 rounded-full bg-gold/20 blur-3xl" />
          <div className="vk-container grid items-center gap-10 py-12 md:py-20 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
            <div>
              <nav aria-label="Breadcrumb" className="mb-6 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white/80 backdrop-blur">
                <Link href="/" className="inline-flex items-center gap-1 hover:text-white"><Home className="h-3.5 w-3.5" />Home</Link>
                <ChevronRight className="h-3.5 w-3.5 opacity-60" />
                <span aria-current="page" className="text-white">Become a Patron</span>
              </nav>
              <span className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-gold">
                <span className="h-px w-8 bg-gold" /> Patron Programme
              </span>
              <h1 className="vk-h1 !text-white">
                Empower a <span className="bg-gradient-to-r from-[#FFD66B] to-[#F5A623] bg-clip-text text-transparent">Legacy of Devotion</span>
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-white/80 md:text-lg">
                Become a patron of the Hare Krishna Vaikuntham temple, Visakhapatnam — and let your family&apos;s name be part of a sacred space for generations to come.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#become-a-patron" className="inline-flex h-12 items-center gap-2 rounded-xl bg-gold px-7 text-sm font-bold text-vk-900 shadow-lift transition hover:brightness-105">
                  Become a Patron <ArrowRight className="h-4 w-4" />
                </a>
                <a href="#privileges" className="inline-flex h-12 items-center rounded-xl border border-white/30 px-7 text-sm font-semibold text-white transition hover:bg-white/10">
                  See patron privileges
                </a>
              </div>
            </div>

            <Reveal delay={0.1}>
              <div className="rounded-3xl border border-white/15 bg-white/10 p-6 shadow-lift backdrop-blur-md md:p-8">
                <p className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-gold">
                  <Gift className="h-4 w-4" /> Every patron family receives
                </p>
                <ul className="space-y-4">
                  {[
                    "Family name inscription in the temple",
                    "Sacred vastra & personalized gifts",
                    "Invitations to festivals and rituals",
                    "Personalized pujas & special blessings",
                    "Your name in the Hall of Devotional Fame",
                  ].map((t) => (
                    <li key={t} className="flex items-start gap-3 text-[15px] text-white/90">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-gold" /> {t}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </section>

        {/* WHY PATRON */}
        <section className="vk-section">
          <div className="vk-container">
            <SectionHeading
              align="center"
              eyebrow="Why Become a Patron?"
              title={<>Build a temple that <span className="text-vk-600">inspires generations</span></>}
            />
            <div className="grid items-stretch gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
              <Reveal>
                <div className="relative h-full min-h-[320px] overflow-hidden rounded-3xl shadow-lift">
                  <Image
                    src="/assets/patron/why.jpg"
                    alt="Patron family performing abhishek of the Deity at a temple ceremony"
                    fill
                    sizes="(min-width: 1024px) 600px, 100vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-vk-900/70 via-transparent to-transparent" />
                  <span className="absolute bottom-5 left-5 rounded-full bg-white/95 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-vk-700 shadow-lift">
                    Hare Krishna Vaikuntham
                  </span>
                </div>
              </Reveal>
              <div className="flex flex-col gap-5">
                {pillars.map((p, i) => (
                  <Reveal key={p.title} delay={i * 0.08} className="flex-1">
                    <div className="vk-card relative h-full overflow-hidden p-6 md:p-8">
                      <span className="pointer-events-none absolute -right-2 -top-4 font-heading text-[110px] font-extrabold leading-none text-vk-50">
                        {i + 1}
                      </span>
                      <h3 className="vk-bar-title relative text-xl text-foreground">{p.title}</h3>
                      <p className="relative mt-4 text-[15px] leading-relaxed text-muted-foreground">{p.text}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* PRIVILEGES */}
        <section id="privileges" className="vk-section scroll-mt-24 bg-gradient-to-b from-vk-50 to-white">
          <div className="vk-container">
            <SectionHeading
              align="center"
              eyebrow="Patron Privileges"
              title={<>A place in the temple, <span className="text-vk-600">a bond with the Lord</span></>}
            />
            <div className="grid gap-6 md:grid-cols-3">
              {privileges.map((p, i) => (
                <Reveal key={p.title} delay={i * 0.08}>
                  <article className="group vk-card h-full overflow-hidden transition-shadow hover:shadow-lift">
                    <div className="relative aspect-[3/2] overflow-hidden">
                      <Image src={p.image} alt={p.alt} fill sizes="(min-width: 768px) 400px, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                      <span className="absolute left-4 top-4 rounded-full bg-vk-900/80 px-3 py-1 text-xs font-bold tracking-widest text-gold backdrop-blur">
                        0{i + 1}
                      </span>
                    </div>
                    <div className="relative p-6 pt-9">
                      <span className="absolute -top-7 left-6 grid h-14 w-14 place-items-center rounded-2xl bg-gold text-vk-900 shadow-lift ring-4 ring-white">
                        <p.icon className="h-6 w-6" />
                      </span>
                      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-vk-500">{p.eyebrow}</p>
                      <h3 className="mt-1 font-heading text-xl font-bold text-ink">{p.title}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.text}</p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>

            {/* Hall of Devotional Fame */}
            <Reveal className="mt-8">
              <div className="relative overflow-hidden rounded-3xl bg-gradient-navy text-white shadow-lift">
                <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-gold/15 blur-3xl" />
                <div className="relative grid items-center gap-8 p-8 md:p-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
                  <div>
                    <span className="mb-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-gold">
                      <Crown className="h-4 w-4" /> 04 · Lasting tribute
                    </span>
                    <h3 className="font-heading text-3xl font-extrabold tracking-tight md:text-4xl">Hall of Devotional Fame</h3>
                    <p className="mt-5 text-[15px] leading-relaxed text-white/80 md:text-base">
                      The &ldquo;Hall of Devotional Fame&rdquo; stands as a distinguished tribute to the generous patrons of the Hare Krishna Vaikuntham temple. It honors and recognizes the contributions of those who have helped build this monumental space, dedicated to culture and devotion. This hall will forever enshrine the names of patrons, symbolizing their lasting connection to this sacred endeavor and their role in preserving spiritual heritage for future generations.
                    </p>
                    <a href="#become-a-patron" className="mt-7 inline-flex h-12 items-center gap-2 rounded-xl bg-gold px-7 text-sm font-bold text-vk-900 transition hover:brightness-105">
                      Reserve your family&apos;s place <ArrowRight className="h-4 w-4" />
                    </a>
                  </div>
                  {/* Illustrative wall of nameplates — decorative only. */}
                  <div aria-hidden className="grid grid-cols-2 gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 md:gap-4 md:p-5">
                    {["", "", "", "your", "", ""].map((n, k) => (
                      <div
                        key={k}
                        className={`grid h-16 place-items-center rounded-lg text-center text-[11px] font-bold uppercase tracking-widest md:h-20 ${
                          n
                            ? "bg-gradient-to-br from-[#FFD66B] to-[#F5A623] text-vk-900 shadow-lift ring-2 ring-white/60"
                            : "border border-white/10 bg-white/5"
                        }`}
                      >
                        {n ? <>Your family<br />name here</> : <span className="flex w-2/3 flex-col gap-1.5"><i className="h-1 rounded bg-white/15" /><i className="h-1 w-2/3 self-center rounded bg-white/10" /></span>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* SCRIPTURES */}
        <section className="relative overflow-hidden bg-vk-900 py-14 text-white md:py-20">
          <Quote aria-hidden className="pointer-events-none absolute left-6 top-8 h-40 w-40 text-white/[0.04]" />
          <div className="vk-container relative">
            <SectionHeading
              light
              align="center"
              eyebrow="Shastra Says"
              title={<>The Glory of <span className="text-gold">Building a Temple</span></>}
              subtitle="What the Puranas and Srimad Bhagavatam declare for those who build and serve the Lord's abode."
            />
            <div className="mx-auto max-w-4xl">
              <div role="tablist" aria-label="Scriptures" className="mb-6 flex gap-2 overflow-x-auto pb-2 scrollbar-hide md:flex-wrap md:justify-center">
                {scriptures.map((s, i) => (
                  <button
                    key={i}
                    role="tab"
                    aria-selected={verse === i}
                    onClick={() => setVerse(i)}
                    className={`shrink-0 rounded-full border px-4 py-2 text-xs font-semibold transition ${
                      verse === i ? "border-gold bg-gold text-vk-900" : "border-white/20 text-white/75 hover:border-white/50 hover:text-white"
                    }`}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
              <div className="relative min-h-[260px] rounded-3xl border border-white/15 bg-white/[0.06] p-8 backdrop-blur md:min-h-[240px] md:p-12">
                <Quote className="mb-5 h-9 w-9 text-gold" />
                <AnimatePresence mode="wait">
                  <motion.figure
                    key={verse}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                  >
                    <blockquote className="font-heading text-xl font-semibold leading-snug md:text-[28px] md:leading-[1.3]">
                      {scriptures[verse].text}
                    </blockquote>
                    <figcaption className="mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-gold">
                      <BookOpen className="h-4 w-4" /> {scriptures[verse].name}
                    </figcaption>
                  </motion.figure>
                </AnimatePresence>
              </div>
              {/* All verses stay in the DOM for crawlers and screen readers. */}
              <ul className="sr-only">
                {scriptures.map((s, i) => <li key={i}>{s.name}: {s.text}</li>)}
              </ul>
            </div>
          </div>
        </section>

        {/* FORM */}
        <section id="become-a-patron" className="vk-section scroll-mt-24 bg-gradient-to-b from-white to-vk-50">
          <div className="vk-container grid items-start gap-8 lg:grid-cols-[1fr_1.2fr] lg:gap-12">
            <Reveal>
              <SectionHeading eyebrow="Join Us" title={<>Become a <span className="text-vk-600">Patron</span></>} subtitle="Share your details and our team will reach out personally." />
              <div className="-mt-4 space-y-3">
                <div className="vk-card p-5">
                  <div className="mb-3 flex items-center gap-3">
                    <span className="vk-icon-chip"><Clock className="h-5 w-5" /></span>
                    <h3 className="font-heading text-[17px] font-bold text-ink">Temple Timings</h3>
                  </div>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Morning</dt><dd className="font-semibold text-ink">4:30 AM – 1:00 PM</dd></div>
                    <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Evening</dt><dd className="font-semibold text-ink">4:00 PM – 8:30 PM</dd></div>
                  </dl>
                </div>
                {[
                  { icon: Phone, label: "Call us", value: "+91 89777 61187" },
                  { icon: Mail, label: "Write to us", value: "social@hkmvizag.org" },
                ].map((c) => (
                  <div key={c.label} className="vk-card flex items-center gap-4 p-4">
                    <span className="vk-icon-chip"><c.icon className="h-5 w-5" /></span>
                    <div>
                      <p className="text-xs text-muted-foreground">{c.label}</p>
                      <p className="text-sm font-semibold text-ink">{c.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              {sent ? (
                <div className="vk-card p-8 text-center md:p-12">
                  <span className="vk-icon-chip mx-auto mb-4 !h-16 !w-16 !rounded-2xl"><CheckCircle2 className="h-8 w-8" /></span>
                  <h3 className="vk-h3">Hare Krishna! Thank you.</h3>
                  <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
                    We&apos;ve received your request and our team will contact you shortly.
                  </p>
                  <button type="button" onClick={() => setSent(false)} className="vk-btn-primary mx-auto mt-6 h-11 px-6">
                    Submit another request
                  </button>
                </div>
              ) : (
                <form onSubmit={submit} className="vk-card space-y-4 p-5 md:p-8">
                  <h3 className="vk-bar-title text-xl text-foreground">Patron Request</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="First name" required>
                      <input id="patron-first" required placeholder="e.g. Ramesh" value={form.firstName} onChange={set("firstName")} className={inputCls} autoComplete="given-name" />
                    </Field>
                    <Field label="Last name" required>
                      <input id="patron-last" required placeholder="e.g. Kumar" value={form.lastName} onChange={set("lastName")} className={inputCls} autoComplete="family-name" />
                    </Field>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Email address" required>
                      <input id="patron-email" required type="email" placeholder="you@example.com" value={form.email} onChange={set("email")} className={inputCls} autoComplete="email" />
                    </Field>
                    <Field label="Phone number" required>
                      <input id="patron-phone" required type="tel" inputMode="tel" placeholder="10-digit mobile number" value={form.phone} onChange={set("phone")} className={inputCls} autoComplete="tel" />
                    </Field>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="City / District" required>
                      <input id="patron-city" required placeholder="e.g. Visakhapatnam" value={form.city} onChange={set("city")} className={inputCls} autoComplete="address-level2" />
                    </Field>
                    <Field label="State" required>
                      <input id="patron-state" required placeholder="e.g. Andhra Pradesh" value={form.state} onChange={set("state")} className={inputCls} autoComplete="address-level1" />
                    </Field>
                  </div>
                  <Field label="Message" hint="Optional">
                    <textarea
                      id="patron-message"
                      rows={4}
                      placeholder="Tell us how you would like to serve"
                      value={form.message}
                      onChange={set("message")}
                      className={`${inputCls} !h-auto py-3`}
                    />
                  </Field>
                  <label className="flex cursor-pointer items-start gap-3 text-[13px] leading-snug text-muted-foreground">
                    <Checkbox checked={authorization} onCheckedChange={(v) => setAuthorization(v === true)} className="mt-0.5 border-vk-500" />
                    I authorize Hare Krishna Movement Vizag to contact me by call, SMS or WhatsApp about patronage.
                  </label>
                  <button type="submit" disabled={sending} className="vk-btn-primary h-12 w-full gap-2 disabled:opacity-60">
                    {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    {sending ? "Sending…" : "Become a Patron"}
                  </button>
                  <p className="text-center text-xs text-muted-foreground">Our team will reach out personally. Your details are used only to contact you about patronage.</p>
                </form>
              )}
            </Reveal>
          </div>
        </section>

        {/* CROSS-LINKS */}
        <section className="vk-section pt-10 md:pt-16">
          <div className="vk-container">
            <div className="flex flex-col items-center justify-between gap-5 rounded-3xl bg-vk-50 p-8 text-center md:flex-row md:text-left">
              <div>
                <h2 className="vk-h3">Prefer to give right away?</h2>
                <p className="mt-1 text-sm text-muted-foreground">Sponsor a square foot or a brick of the Vaikuntham temple today.</p>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                <Link href="/sqft-seva-campaign" className="vk-btn-primary h-11 gap-2 px-5">Square Foot Seva <ArrowRight className="h-4 w-4" /></Link>
                <Link href="/brick-seva-campaign" className="inline-flex h-11 items-center gap-2 rounded-xl border border-vk-200 bg-white px-5 text-sm font-semibold text-vk-700 hover:border-vk-700">Brick Seva</Link>
              </div>
            </div>
          </div>
        </section>

        <WhatsAppCommunityCTA />
      </div>
    </PageLayout>
  );
}
