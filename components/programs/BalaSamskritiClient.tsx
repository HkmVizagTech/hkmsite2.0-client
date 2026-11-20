"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Image from "next/image";
import { MotionConfig, motion } from "framer-motion";
import {
  ArrowRight, BookOpen, CalendarDays, CheckCircle2, ChevronDown, Clock, Flower2, Hourglass, Loader2, Lock, MapPin,
  Heart, MessageCircle, Phone, ShieldCheck, Sparkles, Sun, Users,
} from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { SEVA_WHATSAPP_NUMBER } from "@/components/WhatsAppFloatButton";
import { useRazorpayPreload } from "@/lib/useRazorpayPreload";
import { useAttribution } from "@/lib/useAttribution";
import { cleanMobile } from "@/lib/phone";
import { scrollToSection } from "@/lib/scrollTop";

/**
 * /bala-samskriti — Vedic culture & values course for kids (6–13).
 *
 * The page is designed for this one program, but the program itself (fee,
 * dates, venues, open/closed) lives in Admin → Programs under the page link
 * "bala-samskriti". Every registration and payment from this page is counted
 * against that program in the admin dashboard. The values below are only the
 * fallback shown until the program loads.
 */

const SLUG = "bala-samskriti";
const apiBase = () => (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080").replace(/\/+$/, "");
const POSTER = "/assets/programs/bala-samskriti-poster.webp";
const BANNER = "/assets/programs/bala-samskriti-banner.webp";
const BANNER_ALT = "Bala Samskriti: Vedic culture and values for kids. Life skills, Gita for kids, meditation and more. Course starts 6 December 2026, a 3-month course for ages 6 to 13, every Sunday 10:30 AM to 1:30 PM. Course fee ₹2,500. Contact 9985364430 / 7207108219.";

interface Venue { name: string; mapUrl?: string }
interface Program {
  _id?: string;
  name: string;
  tagline?: string;
  fee: number;
  startDate: string;
  schedule?: string;
  duration?: string;
  ageMin?: number;
  ageMax?: number;
  venues: Venue[];
  contactPhones: string[];
  registrationOpen: boolean;
  full?: boolean;
}

const FALLBACK: Program = {
  name: "Bala Samskriti",
  tagline: "Vedic Culture & Values for Kids",
  fee: 2500,
  startDate: "2026-12-06T00:00:00+05:30",
  schedule: "Every Sunday, 10:30 AM to 1:30 PM",
  duration: "3 months",
  ageMin: 6,
  ageMax: 13,
  venues: [
    { name: "Gambhiram", mapUrl: "https://www.google.com/maps/search/?api=1&query=ISKCON+Gambheeram+Visakhapatnam" },
    { name: "Madhavadhara", mapUrl: "https://www.google.com/maps/search/?api=1&query=Hare+Krishna+Madhavadhara+Visakhapatnam" },
  ],
  contactPhones: ["9985364430", "7207108219"],
  registrationOpen: true,
};

const LEARN = [
  { photo: "/assets/programs/bs-write.webp", icon: Sun, title: "Life skills", text: "Discipline, focus, respect and good habits: the everyday skills that help children grow into confident, kind people.", ring: "ring-amber-300", chip: "bg-amber-400", glow: "from-amber-100" },
  { photo: "/assets/programs/bs-reading.webp", icon: BookOpen, title: "Gita for kids", text: "The timeless wisdom of the Bhagavad-gita, told through stories and simple lessons children can understand and live by.", ring: "ring-vk-300", chip: "bg-vk-500", glow: "from-vk-100" },
  { photo: "/assets/programs/bs-meditate.webp", icon: Flower2, title: "Meditation", text: "Gentle mantra meditation that helps young minds become calm, steady and joyful.", ring: "ring-teal-300", chip: "bg-teal-500", glow: "from-teal-100" },
  { photo: "/assets/programs/bs-pray.webp", icon: Sparkles, title: "And much more", text: "Vedic culture and values brought alive through activities that make every Sunday something to look forward to.", ring: "ring-rose-300", chip: "bg-rose-500", glow: "from-rose-100" },
];

const WHY = [
  { icon: Heart, title: "Values for life", text: "Honesty, gratitude and respect for parents, teachers and all living beings." },
  { icon: Flower2, title: "A calm, focused mind", text: "Meditation and simple practices that help children concentrate." },
  { icon: BookOpen, title: "Wisdom of the Gita", text: "Ancient answers, told in a way children love to listen to." },
  { icon: Users, title: "Good friends, good company", text: "A happy Sunday circle of children growing up with the same values." },
];

const istLong = (d: string) =>
  new Date(d).toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata", day: "numeric", month: "long", year: "numeric" });
const istShort = (d: string) =>
  new Date(d).toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata", weekday: "short", day: "numeric", month: "short" });
const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;
const telHref = (p: string) => `tel:+91${p}`;
const fmtPhone = (p: string) => `${p.slice(0, 5)} ${p.slice(5)}`;

type RazorpayInstance = { open: () => void; on: (ev: string, cb: (r: { error?: { description?: string } }) => void) => void };
type RazorpayConstructor = new (options: Record<string, unknown>) => RazorpayInstance;

type Done = { kind: "paid" | "free" | "already"; childName: string; message?: string };

const fade = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5, ease: "easeOut" },
} as const;

export default function BalaSamskritiClient() {
  const [program, setProgram] = useState<Program>(FALLBACK);
  const [loaded, setLoaded] = useState<"loading" | "ok" | "missing">("loading");

  useEffect(() => {
    let alive = true;
    fetch(`${apiBase()}/programs/public/${SLUG}`)
      .then(async (r) => {
        if (!alive) return;
        if (!r.ok) { setLoaded("missing"); return; }
        const d = await r.json();
        if (d.program) { setProgram({ ...FALLBACK, ...d.program, venues: d.program.venues?.length ? d.program.venues : FALLBACK.venues }); setLoaded("ok"); }
        else setLoaded("missing");
      })
      .catch(() => alive && setLoaded("missing"));
    return () => { alive = false; };
  }, []);

  const ages = `${program.ageMin ?? 6} to ${program.ageMax ?? 13} years`;
  const phones = program.contactPhones.length ? program.contactPhones : FALLBACK.contactPhones;
  const canRegister = loaded === "ok" && program.registrationOpen && !program.full;

  const facts = [
    { icon: CalendarDays, label: "Course starts", value: istLong(program.startDate), tint: "bg-vk-500" },
    { icon: Hourglass, label: "Duration", value: program.duration ? `${program.duration[0].toUpperCase()}${program.duration.slice(1)} course` : "", tint: "bg-violet-500" },
    { icon: Users, label: "Age group", value: ages, tint: "bg-emerald-500" },
    { icon: Clock, label: "Every week", value: program.schedule || "", tint: "bg-rose-500" },
  ].filter((f) => f.value);

  const faqs = useMemo(
    () => [
      { q: "Who can join Bala Samskriti?", a: `Children aged ${ages}. Parents register on the child's behalf.` },
      { q: "When and where are the classes?", a: `${program.schedule || "Every Sunday"}, starting ${istLong(program.startDate)}, at ${program.venues.map((v) => v.name).join(" or ")}. Choose the venue that suits you when you register.` },
      { q: "What is the course fee?", a: `${inr(program.fee)} for the full ${program.duration || "course"}, paid online when you register.` },
      { q: "How do I know my child is registered?", a: "As soon as the payment goes through you'll see a confirmation on this page and get a WhatsApp message on the number you entered." },
      { q: "My payment failed. What should I do?", a: "No money is taken for a failed payment. Just fill in the form again with the same details and pay; your child won't be registered twice. If money was deducted, call us and we'll check it." },
      { q: "Whom do I contact for more details?", a: `Call ${phones.join(" or ")}.` },
    ],
    [ages, program, phones]
  );

  const goRegister = () => scrollToSection("register");

  return (
    <PageLayout whatsappNumber={SEVA_WHATSAPP_NUMBER}>
      <MotionConfig reducedMotion="user">
        <main className="overflow-x-hidden bg-white pb-20 pt-[var(--header-h)] supports-[overflow:clip]:overflow-x-clip md:pb-0">
          {/* ═════════════ HERO: full-width program banner ═════════════ */}
          <section className="relative bg-[#0B6FB8]">
            <h1 className="sr-only">Bala Samskriti: Vedic Culture &amp; Values for Kids</h1>
            {/* Wide banner on tablet/laptop, the square poster on phones (the wide one's text is too small there). */}
            <Image src={BANNER} alt={BANNER_ALT} width={1600} height={900} priority sizes="100vw" className="hidden h-auto w-full md:block" />
            <Image src={POSTER} alt={BANNER_ALT} width={755} height={732} priority sizes="100vw" className="h-auto w-full md:hidden" />
          </section>

          {/* facts card, overlapping the banner's bottom edge */}
          <div className="relative z-10 bg-[#FFF9EC]">
            <div className="mx-auto -mt-6 max-w-6xl px-3 sm:px-6 md:-mt-14">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="flex flex-col gap-4 rounded-3xl bg-white p-4 shadow-2xl shadow-vk-900/15 ring-1 ring-slate-100 sm:p-5 md:flex-row md:items-center"
              >
                <ul className="grid flex-1 grid-cols-2 gap-3 lg:grid-cols-4">
                  {facts.map((f) => (
                    <li key={f.label} className="flex items-center gap-2.5">
                      <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-white shadow-md ${f.tint}`}><f.icon className="h-5 w-5" /></span>
                      <span className="min-w-0 leading-tight">
                        <span className="block text-[10.5px] font-semibold uppercase tracking-wider text-slate-500">{f.label}</span>
                        <span className="block text-[13px] font-bold text-slate-800">{f.value}</span>
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-amber-50 to-rose-50 p-3">
                  <div className="leading-tight">
                    <div className="text-[10.5px] font-semibold uppercase tracking-wider text-slate-500">Course fee</div>
                    <div className="text-2xl font-extrabold text-rose-600">{inr(program.fee)}</div>
                  </div>
                  <button
                    type="button"
                    onClick={goRegister}
                    className="group ml-auto inline-flex h-12 items-center gap-2 whitespace-nowrap rounded-full bg-gradient-to-r from-rose-600 to-orange-500 px-6 text-[15px] font-bold text-white shadow-lg shadow-rose-500/30 transition hover:brightness-110"
                  >
                    Register now <ArrowRight className="h-5 w-5 transition group-hover:translate-x-0.5" />
                  </button>
                </div>
              </motion.div>
            </div>
          </div>

          {/* ═════════════ WHAT THEY LEARN ═════════════ */}
          <section className="relative overflow-hidden bg-[#FFF9EC] pb-20 pt-16 md:pt-20">
            <div aria-hidden className="absolute -left-20 top-24 h-64 w-64 rounded-full bg-amber-200/40 blur-3xl" />
            <div aria-hidden className="absolute -right-20 bottom-10 h-72 w-72 rounded-full bg-teal-200/40 blur-3xl" />
            <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
              <Heading eyebrow="What your child will learn" title="Learn big things in small sessions" sub="Every Sunday is a happy mix of learning, reflection and fun, made for young hearts and curious minds." />
              <div className="mt-20 grid gap-x-5 gap-y-16 sm:grid-cols-2 lg:grid-cols-4">
                {LEARN.map((l, i) => (
                  <motion.div
                    key={l.title}
                    {...fade}
                    transition={{ ...fade.transition, delay: i * 0.08 }}
                    className={`group relative rounded-[1.75rem] bg-gradient-to-b ${l.glow} to-white px-6 pb-7 pt-20 text-center shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-1.5 hover:shadow-xl`}
                  >
                    <div className={`absolute -top-12 left-1/2 h-28 w-28 -translate-x-1/2 overflow-hidden rounded-full bg-white shadow-lg ring-4 ${l.ring} ring-offset-4 ring-offset-[#FFF9EC] transition group-hover:scale-105`}>
                      <Image src={l.photo} alt="" fill sizes="112px" className="scale-[1.15] object-cover" />
                    </div>
                    <span className={`absolute left-1/2 top-9 grid h-9 w-9 translate-x-7 place-items-center rounded-full text-white shadow-md ring-2 ring-white ${l.chip}`}>
                      <l.icon className="h-4 w-4" />
                    </span>
                    <h3 className="text-lg font-bold text-slate-800">{l.title}</h3>
                    <p className="mt-2 text-[14.5px] leading-relaxed text-slate-600">{l.text}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* ═════════════ NUMBERS BAND ═════════════ */}
          <section className="relative overflow-hidden bg-gradient-to-r from-vk-600 via-[#1279C0] to-teal-600 py-12 text-white">
            <PeacockFeather className="absolute -left-6 -top-16 h-72 w-auto -rotate-[25deg] opacity-20" />
            <PeacockFeather className="absolute -bottom-20 -right-4 h-72 w-auto rotate-[30deg] opacity-20" />
            <div className="relative mx-auto grid max-w-5xl grid-cols-2 gap-8 px-4 text-center sm:px-6 md:grid-cols-4">
              {[
                { big: "3 hrs", small: "of joyful learning every Sunday" },
                { big: (program.duration || "3 months").replace(/\s*months?/i, ""), small: "months of guided classes" },
                { big: `${program.ageMin ?? 6}–${program.ageMax ?? 13}`, small: "years: the age group" },
                { big: String(program.venues.length), small: `venue${program.venues.length === 1 ? "" : "s"} in Visakhapatnam` },
              ].map((n, i) => (
                <motion.div key={n.small} {...fade} transition={{ ...fade.transition, delay: i * 0.08 }}>
                  <div className="font-serif text-4xl font-extrabold text-amber-300 drop-shadow sm:text-5xl">{n.big}</div>
                  <div className="mt-1 text-sm text-white/85">{n.small}</div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ═════════════ WHY ═════════════ */}
          <section className="bg-white py-16 md:py-20">
            <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr]">
              <motion.div {...fade} className="relative mx-auto w-full max-w-sm">
                <div aria-hidden className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-200 via-rose-100 to-teal-100 blur-2xl" />
                <div className="relative mx-auto grid aspect-square w-full place-items-center rounded-full bg-gradient-to-br from-[#FFF4D6] to-white shadow-2xl shadow-amber-500/20 ring-8 ring-white">
                  <div className="relative h-[78%] w-[55%]">
                    <Image src="/assets/programs/bs-krishna.webp" alt="Little Krishna holding a plate of laddus" fill sizes="220px" className="object-contain mix-blend-multiply" />
                  </div>
                </div>
                <div className="absolute -right-2 top-6 rotate-6 rounded-2xl bg-white px-4 py-2 text-sm font-bold text-rose-600 shadow-xl ring-1 ring-rose-100">Ages {program.ageMin ?? 6}–{program.ageMax ?? 13}</div>
                <div className="absolute -left-2 bottom-8 -rotate-6 rounded-2xl bg-white px-4 py-2 text-sm font-bold text-vk-600 shadow-xl ring-1 ring-vk-100">Every Sunday</div>
              </motion.div>
              <div>
                <Heading align="left" eyebrow="Why Bala Samskriti" title="Give your child roots that last a lifetime" sub="In a world full of screens and hurry, Bala Samskriti gives children a calm, joyful space to learn the values and culture that shape good character." />
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  {WHY.map((w, i) => (
                    <motion.div key={w.title} {...fade} transition={{ ...fade.transition, delay: i * 0.07 }} className="flex gap-3 rounded-2xl bg-slate-50/80 p-4 ring-1 ring-slate-100">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-amber-400 to-rose-500 text-white shadow"><w.icon className="h-5 w-5" /></span>
                      <span>
                        <span className="block font-bold text-slate-800">{w.title}</span>
                        <span className="mt-0.5 block text-sm leading-relaxed text-slate-600">{w.text}</span>
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ═════════════ VENUES ═════════════ */}
          <section className="bg-gradient-to-b from-vk-50 to-white py-16 md:py-20">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
              <Heading eyebrow="Two venues" title="Choose the venue nearest to you" sub={`${program.schedule || "Every Sunday"} at both venues. Pick one when you register.`} />
              <div className="mx-auto mt-10 grid max-w-3xl gap-5 sm:grid-cols-2">
                {program.venues.map((v, i) => (
                  <motion.div key={v.name} {...fade} transition={{ ...fade.transition, delay: i * 0.1 }} className="flex items-center gap-4 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-vk-100">
                    <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-rose-500 to-orange-400 text-white shadow-md"><MapPin className="h-7 w-7" /></span>
                    <div className="min-w-0 flex-1">
                      <div className="text-lg font-bold text-slate-800">{v.name}</div>
                      <div className="text-sm text-slate-500">Visakhapatnam</div>
                    </div>
                    {v.mapUrl && (
                      <a href={v.mapUrl} target="_blank" rel="noreferrer" className="shrink-0 rounded-full bg-vk-50 px-4 py-2 text-sm font-semibold text-vk-600 ring-1 ring-vk-100 transition hover:bg-vk-100">
                        Directions
                      </a>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* ═════════════ REGISTER ═════════════ */}
          <section id="register" className="relative scroll-mt-24 overflow-hidden bg-gradient-to-br from-[#FFF9EC] via-white to-[#EEF9FB] py-16 md:py-20">
            <div aria-hidden className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-amber-200/30 blur-3xl" />
            <div aria-hidden className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-teal-200/30 blur-3xl" />
            <div className="relative mx-auto grid max-w-5xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
              <div className="lg:sticky lg:top-28">
                <Heading align="left" eyebrow="Registration" title="Register your child" sub="Fill in the details, choose a venue and pay the course fee online. It takes less than two minutes." />
                <ul className="mt-6 space-y-3 text-[15px] text-slate-700">
                  {[
                    "Instant confirmation on this page",
                    "A WhatsApp message on your number",
                    "Secure payment by UPI, card or net banking",
                  ].map((x) => (
                    <li key={x} className="flex items-start gap-2.5"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />{x}</li>
                  ))}
                </ul>
                <div className="mt-6 rounded-2xl bg-white/80 p-4 text-sm text-slate-600 ring-1 ring-slate-100">
                  Questions? Call{" "}
                  {phones.map((p, i) => (
                    <span key={p}>{i > 0 && " / "}<a href={telHref(p)} className="font-semibold text-vk-600 hover:underline">{fmtPhone(p)}</a></span>
                  ))}
                </div>
              </div>

              <RegistrationCard program={program} loaded={loaded} canRegister={canRegister} phones={phones} />
            </div>
          </section>

          {/* ═════════════ FAQ ═════════════ */}
          <section className="bg-white py-16 md:py-20">
            <div className="mx-auto max-w-3xl px-4 sm:px-6">
              <Heading eyebrow="Questions" title="Parents often ask" />
              <Faq faqs={faqs} />
            </div>
          </section>

          {/* ═════════════ FINAL CTA ═════════════ */}
          <section className="px-4 pb-16 sm:px-6">
            <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] bg-gradient-to-br from-vk-500 via-vk-600 to-teal-600 px-6 py-12 text-center text-white shadow-xl sm:px-12">
              <PeacockFeather className="absolute -bottom-10 -right-6 h-64 w-auto rotate-[30deg] opacity-25" />
              <div aria-hidden className="absolute bottom-0 left-4 hidden h-44 w-32 md:block">
                <Image src="/assets/programs/bs-krishna.webp" alt="" fill sizes="128px" className="rounded-t-full bg-white/90 object-contain object-bottom p-2" />
              </div>
              <h2 className="relative font-serif text-3xl font-bold sm:text-4xl">Give your child the gift of Samskriti</h2>
              <p className="relative mx-auto mt-3 max-w-xl text-white/85">
                Starts {istLong(program.startDate)}. Register early to reserve your child's place.
              </p>
              <div className="relative mt-7 flex flex-wrap justify-center gap-3">
                <button type="button" onClick={goRegister} className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-7 font-bold text-vk-700 shadow-lg transition hover:bg-amber-50">
                  Register now <ArrowRight className="h-5 w-5" />
                </button>
                <a href={telHref(phones[0])} className="inline-flex h-12 items-center gap-2 rounded-full bg-white/15 px-6 font-semibold ring-1 ring-white/40 transition hover:bg-white/25">
                  <Phone className="h-4 w-4" /> {fmtPhone(phones[0])}
                </a>
              </div>
            </div>
          </section>

          {/* mobile sticky bar */}
          <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur md:hidden">
            <div className="leading-tight">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Course fee</div>
              <div className="text-lg font-extrabold text-slate-800">{inr(program.fee)}</div>
            </div>
            <button type="button" onClick={goRegister} className="ml-auto inline-flex h-11 items-center gap-1.5 rounded-full bg-vk-500 px-6 font-bold text-white shadow-md">
              Register <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </main>
      </MotionConfig>
    </PageLayout>
  );
}

// ───────────────────────────────────────────────────────── registration form

function RegistrationCard({ program, loaded, canRegister, phones }: { program: Program; loaded: "loading" | "ok" | "missing"; canRegister: boolean; phones: string[] }) {
  const razorpayReady = useRazorpayPreload();
  const attribution = useAttribution("program:bala-samskriti");
  const [form, setForm] = useState({ name: "", age: "", parentName: "", mobile: "", email: "", venue: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<Done | null>(null);

  const minAge = program.ageMin ?? 6;
  const maxAge = program.ageMax ?? 13;
  const ageOptions = Array.from({ length: maxAge - minAge + 1 }, (_, i) => minAge + i);
  const set = (k: keyof typeof form, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => { const n = { ...e }; delete n[k]; return n; });
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Enter the child's name";
    if (!form.age) e.age = "Choose the age";
    if (!form.parentName.trim()) e.parentName = "Enter the parent's name";
    if (!/^[6-9]\d{9}$/.test(cleanMobile(form.mobile))) e.mobile = "Enter a valid 10-digit WhatsApp number";
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = "Enter a valid email, or leave it blank";
    if (program.venues.length && !form.venue) e.venue = "Choose a venue";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setError(null);
    if (!validate()) return;
    setSubmitting(true);
    const childName = form.name.trim();
    try {
      const res = await fetch(`${apiBase()}/programs/public/${SLUG}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, name: childName, mobile: cleanMobile(form.mobile), age: Number(form.age), utm: attribution.payload().utm }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 409 && data.alreadyRegistered) { setDone({ kind: "already", childName, message: data.message }); setSubmitting(false); return; }
      if (!res.ok) throw new Error(data.message || "Couldn't register. Please try again.");
      if (data.status === "free") { setDone({ kind: "free", childName }); setSubmitting(false); return; }

      const p = data.payment;
      await razorpayReady();
      const Razorpay = (window as unknown as { Razorpay?: RazorpayConstructor }).Razorpay;
      if (!Razorpay) throw new Error("Couldn't open the payment window. Please check your connection and try again.");
      const rzp = new Razorpay({
        key: p.key,
        order_id: p.orderId,
        amount: p.amount,
        currency: p.currency,
        name: "Hare Krishna Vaikuntham Cultural Centre",
        description: `${p.programName} registration: ${childName}`,
        prefill: { name: form.parentName.trim(), contact: cleanMobile(form.mobile), ...(form.email.trim() ? { email: form.email.trim() } : {}) },
        notes: { program: p.programName, child: childName },
        theme: { color: "#2F5BD3" },
        handler: async (resp: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          try {
            await fetch(`${apiBase()}/programs/public/registrations/${data.id}/verify`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(resp),
            });
          } catch {
            // Razorpay also tells our server directly, so the registration is still marked paid.
          }
          setDone({ kind: "paid", childName });
          setSubmitting(false);
        },
        modal: {
          ondismiss: () => {
            setSubmitting(false);
            setError("Payment not completed. Your details are saved. Tap Pay again to finish registering.");
          },
        },
      });
      rzp.on("payment.failed", (r) => {
        setError(`Payment failed${r?.error?.description ? `: ${r.error.description}` : ""}. You can try again with another method.`);
      });
      rzp.open();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  if (done) {
    const ok = done.kind !== "already";
    return (
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="rounded-[1.75rem] bg-white p-8 text-center shadow-xl ring-1 ring-slate-100">
        <span className={`mx-auto grid h-16 w-16 place-items-center rounded-full ${ok ? "bg-emerald-100 text-emerald-600" : "bg-vk-100 text-vk-600"}`}>
          <CheckCircle2 className="h-9 w-9" />
        </span>
        <h3 className="mt-5 font-serif text-2xl font-bold text-slate-800">{ok ? "Registration confirmed!" : "Already registered"}</h3>
        <p className="mx-auto mt-3 max-w-sm text-slate-600">
          {ok
            ? <>Hare Krishna! <b>{done.childName}</b> is registered for {program.name}. We&apos;ve sent a WhatsApp message to your number. See you on {istLong(program.startDate)}!</>
            : done.message}
        </p>
        <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-vk-50 px-4 py-2 text-sm text-vk-700"><MessageCircle className="h-4 w-4" /> Questions? Call {fmtPhone(phones[0])}</div>
        <div className="mt-5">
          <button type="button" onClick={() => { setDone(null); setForm((f) => ({ ...f, name: "", age: "" })); }} className="text-sm font-semibold text-vk-600 hover:underline">
            Register another child
          </button>
        </div>
      </motion.div>
    );
  }

  const inputCls = (k: string) =>
    `h-12 w-full rounded-xl border bg-white px-4 text-[15px] text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-vk-400 focus:ring-4 focus:ring-vk-100 ${errors[k] ? "border-rose-400" : "border-slate-200"}`;

  return (
    <form onSubmit={submit} noValidate className="relative rounded-[1.75rem] bg-white p-5 shadow-xl shadow-vk-900/5 ring-1 ring-slate-100 sm:p-7">
      <div className="mb-5 flex items-center justify-between gap-3 rounded-2xl bg-gradient-to-r from-vk-50 to-amber-50 px-4 py-3">
        <div>
          <div className="text-sm font-bold text-slate-800">{program.name}</div>
          <div className="text-xs text-slate-500">{program.duration ? `${program.duration} · ` : ""}from {istShort(program.startDate)}</div>
        </div>
        <div className="text-right">
          <div className="text-xl font-extrabold text-slate-800">{inr(program.fee)}</div>
          <div className="text-[11px] text-slate-500">full course</div>
        </div>
      </div>

      <fieldset disabled={!canRegister || submitting} className="space-y-4 disabled:opacity-100">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Child</div>
        <div className="grid gap-4 sm:grid-cols-[1fr_8rem]">
          <Field label="Child's name" error={errors.name}>
            <input className={inputCls("name")} value={form.name} onChange={(e) => set("name", e.target.value)} autoComplete="off" placeholder="Full name" />
          </Field>
          <Field label="Age" error={errors.age}>
            <select className={inputCls("age")} value={form.age} onChange={(e) => set("age", e.target.value)}>
              <option value="">Age</option>
              {ageOptions.map((a) => <option key={a} value={a}>{a} years</option>)}
            </select>
          </Field>
        </div>

        <div className="pt-1 text-xs font-bold uppercase tracking-wider text-slate-400">Parent</div>
        <Field label="Parent's name" error={errors.parentName}>
          <input className={inputCls("parentName")} value={form.parentName} onChange={(e) => set("parentName", e.target.value)} autoComplete="name" placeholder="Full name" />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="WhatsApp number" error={errors.mobile}>
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[15px] text-slate-400">+91</span>
              <input className={`${inputCls("mobile")} pl-12`} value={form.mobile} onChange={(e) => set("mobile", e.target.value)} inputMode="numeric" autoComplete="tel-national" placeholder="10-digit number" maxLength={14} />
            </div>
          </Field>
          <Field label="Email (optional)" error={errors.email}>
            <input className={inputCls("email")} value={form.email} onChange={(e) => set("email", e.target.value)} type="email" autoComplete="email" placeholder="you@example.com" />
          </Field>
        </div>

        {program.venues.length > 0 && (
          <Field label="Venue" error={errors.venue}>
            <div className="grid gap-3 sm:grid-cols-2">
              {program.venues.map((v) => {
                const on = form.venue === v.name;
                return (
                  <button
                    key={v.name}
                    type="button"
                    onClick={() => set("venue", v.name)}
                    aria-pressed={on}
                    className={`flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition ${on ? "border-vk-500 bg-vk-50" : "border-slate-200 hover:border-vk-200"}`}
                  >
                    <MapPin className={`h-5 w-5 ${on ? "text-vk-600" : "text-slate-400"}`} />
                    <span className="font-semibold text-slate-800">{v.name}</span>
                    <span className={`ml-auto grid h-5 w-5 place-items-center rounded-full border-2 ${on ? "border-vk-500 bg-vk-500" : "border-slate-300"}`}>
                      {on && <span className="h-2 w-2 rounded-full bg-white" />}
                    </span>
                  </button>
                );
              })}
            </div>
          </Field>
        )}
      </fieldset>

      {error && <p role="alert" className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}

      {canRegister ? (
        <button type="submit" disabled={submitting} className="mt-6 inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-vk-500 to-vk-600 text-base font-bold text-white shadow-lg shadow-vk-500/25 transition hover:from-vk-600 hover:to-vk-700 disabled:opacity-70">
          {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Lock className="h-4 w-4" />}
          {submitting ? "Please wait…" : `Pay ${inr(program.fee)} & register`}
        </button>
      ) : (
        <div className="mt-6 rounded-2xl bg-amber-50 px-4 py-4 text-center text-sm text-amber-800">
          {loaded === "loading" ? (
            <span className="inline-flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Loading…</span>
          ) : program.full ? (
            "All seats are filled for this batch."
          ) : (
            <>Online registration isn&apos;t open right now. Please call <a className="font-semibold underline" href={telHref(phones[0])}>{fmtPhone(phones[0])}</a> to register.</>
          )}
        </div>
      )}
      <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-slate-400"><ShieldCheck className="h-3.5 w-3.5" /> Secured by Razorpay</p>
    </form>
  );
}

// ───────────────────────────────────────────────────────── small pieces

function Faq({ faqs }: { faqs: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const ld = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };
  return (
    <div className="mt-8 space-y-3">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      {faqs.map((f, i) => {
        const on = open === i;
        return (
          <div key={f.q} className={`rounded-2xl border bg-white transition ${on ? "border-vk-200 shadow-md" : "border-slate-100"}`}>
            <button type="button" onClick={() => setOpen(on ? null : i)} aria-expanded={on} className="flex w-full items-center gap-3 px-5 py-4 text-left">
              <span className="flex-1 font-semibold text-slate-800">{f.q}</span>
              <ChevronDown className={`h-5 w-5 shrink-0 text-vk-500 transition ${on ? "rotate-180" : ""}`} />
            </button>
            {on && <p className="px-5 pb-5 text-[15px] leading-relaxed text-slate-600">{f.a}</p>}
          </div>
        );
      })}
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-slate-700">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs font-medium text-rose-600">{error}</span>}
    </label>
  );
}

function Heading({ eyebrow, title, sub, align = "center" }: { eyebrow: string; title: string; sub?: string; align?: "center" | "left" }) {
  return (
    <motion.div {...fade} className={align === "center" ? "mx-auto max-w-2xl text-center" : ""}>
      <span className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-[11.5px] font-bold uppercase tracking-[0.14em] text-vk-700 ring-1 ring-vk-100">
        <Sparkles className="h-3.5 w-3.5 text-amber-500" /> {eyebrow}
      </span>
      <h2 className="mt-4 font-serif text-3xl font-bold text-slate-800 sm:text-4xl">{title}</h2>
      {sub && <p className="mt-3 text-[15.5px] leading-relaxed text-slate-600">{sub}</p>}
    </motion.div>
  );
}

/** A simple peacock feather, used as a soft decoration. */
function PeacockFeather({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 320" className={className} aria-hidden>
      <path d="M60 318 C60 250 58 180 60 70" stroke="#B7791F" strokeWidth="3" fill="none" />
      {Array.from({ length: 14 }).map((_, i) => {
        const y = 80 + i * 16;
        const w = 46 - i * 2.2;
        return (
          <g key={i} stroke="#0F766E" strokeOpacity="0.55" strokeWidth="1.4" fill="none">
            <path d={`M60 ${y} C${60 - w} ${y - 22} ${60 - w - 6} ${y - 50} ${60 - w + 8} ${y - 70}`} />
            <path d={`M60 ${y} C${60 + w} ${y - 22} ${60 + w + 6} ${y - 50} ${60 + w - 8} ${y - 70}`} />
          </g>
        );
      })}
      <ellipse cx="60" cy="62" rx="34" ry="46" fill="#14B8A6" fillOpacity="0.55" />
      <ellipse cx="60" cy="66" rx="22" ry="30" fill="#D69E2E" />
      <ellipse cx="60" cy="70" rx="14" ry="19" fill="#1E3A8A" />
      <ellipse cx="60" cy="72" rx="7" ry="10" fill="#0E7490" />
    </svg>
  );
}
