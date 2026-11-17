"use client";

import { cleanMobile } from "@/lib/phone";
import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, MotionConfig, animate, motion, useInView, useReducedMotion } from "framer-motion";
import {
  ArrowLeft, ArrowRight, BadgeCheck, CalendarCheck, ChevronRight, ClipboardCheck, CookingPot,
  HandHeart, Heart, Hospital, Loader2, Lock, Mail, MapPin, MessageCircle, Phone, Quote, ShieldCheck,
  Sparkles, Truck, User, Users, UtensilsCrossed,
} from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { SEVA_WHATSAPP_NUMBER } from "@/components/WhatsAppFloatButton";
import { useT } from "@/components/i18n/LocaleProvider";
import type { TFunction } from "@/lib/i18n/translate";
import { Eyebrow, SectionTitle, EdFaq, PrasadamIcon, IVORY } from "@/components/seva-campaign/EditorialSections";
import DonorExtrasFields from "@/components/DonorExtrasFields";
import { useRazorpayPreload } from "@/lib/useRazorpayPreload";
import { useAttribution } from "@/lib/useAttribution";
import { useDonorPrefill } from "@/lib/donorPrefill";
import { prefillEmail } from "@/lib/razorpayPrefill";
import { newEventId, getMetaBrowserData, trackInitiateCheckout, trackPurchase } from "@/lib/metaPixel";
import TouchstoneCharitiesLogo from "@/assets/TouchstoneCharitiesLogo.png";
import HKMLogoBlack from "@/assets/HKMLogoBlack.jpg";

/**
 * /subhojanam — free meals for patients and attendants at government hospitals.
 * Vaikuntham blue + gold, like the Anna Daan / Gau / Gita Daan pages, with the
 * donation widget inside the hero. Donations go to Touchstone Charities
 * (Razorpay account "touchstone"), so there is no bank-transfer, UPI-fallback,
 * 80G/PAN, prasadam or monthly option here — each of those would route to, or
 * promise for, the temple's own trust.
 */

type RazorpayConstructor = new (options: Record<string, unknown>) => { open: () => void };
const apiBase = () => (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080").replace(/\/+$/, "");

const SEVA_NAME = "Subhojanam";
const PATH = "/subhojanam";
const MEAL_PRICE = 25;
const MIN_AMOUNT = 100;

const R2 = "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library";
const PHOTOS = {
  counter: `${R2}/1783677363792-1783677363601-462395264797134589073566144398536696847591n.jpg`,
  inspiration: `${R2}/1786100757954-1786100756855-annadan2.jpg`,
  serving: `${R2}/1786100757016-1786100756575-annadan45.jpg`,
};

const TIERS = [
  { meals: 100, amount: 2500 },
  { meals: 200, amount: 5000 },
  { meals: 300, amount: 7500 },
  { meals: 400, amount: 10000, popular: true },
  { meals: 500, amount: 12500 },
];

const STATS = [
  { icon: UtensilsCrossed, to: 3000, suffix: "+", label: "Meals served daily" },
  { icon: Hospital, to: 3, suffix: "", label: "Government hospitals" },
  { icon: Users, to: 1095000, suffix: "+", label: "Annual beneficiaries" },
  { icon: CalendarCheck, to: 365, suffix: "", label: "Days a year" },
];

const HOSPITALS = [
  { short: "KGH", name: "King George Hospital", city: "Visakhapatnam", meals: 1700, display: "1,700+" },
  { short: "GGH", name: "Government General Hospital", city: "Kakinada", meals: 500, display: "Up to 500" },
  { short: "HBCH", name: "Homi Bhabha Cancer Hospital & Research Centre", city: "Visakhapatnam · Tata Memorial Centre", meals: 500, display: "Up to 500" },
];

// Day sponsorships, worked out from the daily meal counts above at ₹25 a meal.
const DAY_SPONSORSHIPS = [
  { amount: 12500, meals: 500, title: "A day at GGH Kakinada", text: "Every meal served at GGH Kakinada for one day." },
  { amount: 42500, meals: 1700, title: "A day at KGH Visakhapatnam", text: "Every meal served at King George Hospital for one day." },
  { amount: 75000, meals: 3000, title: "A full day of Subhojanam", text: "All 3,000 meals across the three hospitals for one day.", featured: true },
];

const STEPS = [
  { icon: CookingPot, title: "Kitchen preparation", text: "Every morning, trained cooks prepare fresh, hygienic meals in our dedicated kitchen following strict quality standards." },
  { icon: ClipboardCheck, title: "Quality check", text: "Each batch is inspected for nutrition, hygiene and taste before it is packed for distribution." },
  { icon: Truck, title: "To the hospital", text: "Volunteers carry the meals to the hospitals and serve them directly to patients and their families." },
  { icon: CalendarCheck, title: "Every single day", text: "The cycle runs 365 days a year, without exception, rain or shine." },
];

const TESTIMONIALS = [
  { quote: "When my mother was admitted at KGH, we couldn't afford both food and medicine. The Subhojanam meals were a blessing from God.", name: "Ramesh K.", role: "Patient attendant · KGH Visakhapatnam" },
  { quote: "I've been volunteering for two years. Seeing the gratitude in people's eyes when they receive a warm meal is the most fulfilling experience of my life.", name: "Priya S.", role: "Volunteer · Subhojanam Programme" },
  { quote: "The nutritious food helped my father recover faster. We are forever grateful to the Hare Krishna Movement for this noble service.", name: "Suresh M.", role: "Patient family · GGH Kakinada" },
];

export const SUBHOJANAM_FAQS = [
  { q: "What is Subhojanam?", a: "Subhojanam is a free meal programme that serves fresh, hygienic and nutritious meals every day to patients and their attendants at government hospitals — KGH Visakhapatnam, GGH Kakinada and the Homi Bhabha Cancer Hospital & Research Centre, Visakhapatnam." },
  { q: "How many meals does my donation provide?", a: "Every ₹25 sponsors one meal. ₹2,500 sponsors 100 meals and ₹12,500 sponsors 500 meals. The minimum online offering is ₹100 (4 meals); any other amount provides a proportional number of meals." },
  { q: "Who runs Subhojanam?", a: "Subhojanam is a charitable programme run under Touchstone Charities, an initiative of Hare Krishna Movement Visakhapatnam — one of the trusts of Srila Prabhupada's ISKCON Gambheeram Visakhapatnam. Your donation is received by Touchstone Charities." },
  { q: "Can I sponsor meals on a birthday or in memory of someone?", a: "Yes. In the donation form, open the dedication option and choose a birthday, wedding anniversary, in-memory or another occasion, with the name and date." },
  { q: "Will I receive a receipt?", a: "Yes. A receipt is sent to your WhatsApp once your payment is confirmed." },
  { q: "Is it safe to donate online here?", a: "Yes. Payments are processed by Razorpay, a PCI-DSS compliant payment gateway, and we never see or store your card details. UPI, cards and netbanking are all accepted." },
];

interface Donor { name: string; amount: number; time: string }
interface SevaStats { donors: Donor[]; totalAmount: number; donorCount: number }
type DonorForm = { name: string; email: string; mobile: string; sevakName: string; dob: string; dedicationOccasion: string; dedicationNote: string };

const rise = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.5 },
};

const isTextField = (el: EventTarget | null) =>
  el instanceof HTMLElement && el.matches("input:not([type=checkbox]):not([type=radio]), textarea, select");

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

/** Counts up to `to` the first time it scrolls into view. */
function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!inView) return;
    if (reduce) { setValue(to); return; }
    const controls = animate(0, to, { duration: 1.6, ease: "easeOut", onUpdate: (v) => setValue(Math.round(v)) });
    return () => controls.stop();
  }, [inView, reduce, to]);
  return <span ref={ref}>{value.toLocaleString("en-IN")}{suffix}</span>;
}

/** Gold ornamental divider, the same one the Anna Daan / Gau / Gita Daan heroes end with. */
function GoldDivider() {
  return (
    <div aria-hidden className="flex items-center justify-center gap-3 bg-white px-6 pt-6 md:pt-8">
      <span className="h-px w-full max-w-[220px] bg-gradient-to-r from-transparent via-gold/60 to-gold" />
      <span className="flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 rotate-45 bg-gold/70" />
        <span className="h-2.5 w-2.5 rotate-45 border border-gold bg-[#FFF3D6]" />
        <span className="h-1.5 w-1.5 rotate-45 bg-gold/70" />
      </span>
      <span className="h-px w-full max-w-[220px] bg-gradient-to-l from-transparent via-gold/60 to-gold" />
    </div>
  );
}

type FloatInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
};

/** Compact floating-label input. */
function FloatInput({ id, label, icon: Icon, ...props }: FloatInputProps) {
  return (
    <div className="relative">
      <input
        id={id}
        placeholder=" "
        {...props}
        className="peer h-[52px] w-full rounded-xl border border-vk-200 bg-white pb-1 pl-10 pr-3 pt-4 text-[15px] font-medium text-ink outline-none transition-[border-color,box-shadow] hover:border-vk-300 focus:border-vk-500 focus:shadow-[0_0_0_4px_rgba(47,91,211,0.12)]"
      />
      <Icon aria-hidden className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-vk-400 transition-colors peer-focus:text-vk-600" />
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-10 right-3 top-1/2 -translate-y-1/2 truncate text-[14px] text-muted-foreground transition-all duration-150 peer-focus:top-[13px] peer-focus:text-[10.5px] peer-focus:font-semibold peer-focus:text-vk-600 peer-[:not(:placeholder-shown)]:top-[13px] peer-[:not(:placeholder-shown)]:text-[10.5px] peer-[:not(:placeholder-shown)]:font-semibold"
      >
        {label}
      </label>
    </div>
  );
}

/* ───────────────────────── Donation widget ───────────────────────── */

interface WidgetProps {
  t: TFunction;
  step: 1 | 2;
  setStep: (s: 1 | 2) => void;
  tierIndex: number;
  useCustom: boolean;
  customAmount: string;
  selectTier: (i: number) => void;
  setCustom: (v: string) => void;
  finalAmount: number;
  meals: number;
  form: DonorForm;
  setForm: React.Dispatch<React.SetStateAction<DonorForm>>;
  lookupHint: ReactNode;
  status: { type: "success" | "error"; message: string } | null;
  setStatus: (s: { type: "success" | "error"; message: string } | null) => void;
  submitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
  payRef: React.RefObject<HTMLDivElement | null>;
}

function DonationWidget(p: WidgetProps) {
  const { t, step, finalAmount, meals } = p;
  const customTooLow = p.useCustom && p.customAmount !== "" && Number(p.customAmount) < MIN_AMOUNT;
  const lit = meals > 0 ? Math.min(8, Math.max(1, Math.round(Math.log2(meals + 1) * 0.9))) : 0;

  const goToDetails = () => {
    if (finalAmount < MIN_AMOUNT) {
      p.setStatus({ type: "error", message: `The minimum offering is ₹${MIN_AMOUNT}.` });
      return;
    }
    p.setStatus(null);
    p.setStep(2);
  };

  return (
    <div className="relative overflow-hidden rounded-[26px] bg-white shadow-[0_30px_70px_-40px_rgba(47,91,211,0.45)] ring-1 ring-vk-100">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-vk-100 bg-gradient-to-r from-vk-50 to-white px-5 py-3.5">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gold text-vk-900"><PrasadamIcon className="h-5 w-5" /></span>
          <div className="min-w-0">
            <p className="font-heading text-[15px] font-bold leading-tight text-vk-900">{t("Sponsor meals")}</p>
            <p className="truncate text-[11.5px] text-ink/55">{t("Received by Touchstone Charities")}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1.5" aria-label={t("Step {n} of 2", { n: step })}>
          {[1, 2].map((n) => (
            <span key={n} className={`h-1.5 rounded-full transition-all ${n === step ? "w-6 bg-gold" : n < step ? "w-3 bg-vk-500" : "w-3 bg-vk-100"}`} />
          ))}
        </div>
      </div>

      <form
        onSubmit={(e) => { if (step === 1) { e.preventDefault(); goToDetails(); } else p.onSubmit(e); }}
        className="p-4 sm:p-5"
      >
        <AnimatePresence mode="wait" initial={false}>
          {step === 1 ? (
            <motion.div key="s1" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }}>
              <p className="mb-2.5 text-[12px] font-bold uppercase tracking-[0.12em] text-vk-700">{t("How many meals?")}</p>
              <div role="radiogroup" aria-label={t("How many meals?")} className="grid grid-cols-3 gap-2">
                {TIERS.map((tier, i) => {
                  const on = !p.useCustom && p.tierIndex === i;
                  return (
                    <button
                      key={tier.amount}
                      type="button"
                      role="radio"
                      aria-checked={on}
                      onClick={() => p.selectTier(i)}
                      className={`relative flex flex-col items-center rounded-xl border-2 px-1 pb-2 pt-2.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vk-500 ${
                        on ? "border-gold bg-[#FFF8E6] shadow-[0_10px_24px_-14px_rgba(201,150,43,0.9)]" : "border-vk-100 bg-white hover:border-vk-300"
                      }`}
                    >
                      {tier.popular && (
                        <span className="absolute -top-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-gold px-1.5 py-px text-[9px] font-bold uppercase tracking-wide text-vk-900">{t("Popular")}</span>
                      )}
                      <span className="font-heading text-[1.3rem] font-extrabold leading-none text-vk-900">{tier.meals}</span>
                      <span className="mt-0.5 text-[10.5px] font-semibold uppercase tracking-wide text-ink/45">{t("meals")}</span>
                      <span className={`mt-1 text-[13px] font-bold ${on ? "text-gold-deep" : "text-vk-700"}`}>{inr(tier.amount)}</span>
                    </button>
                  );
                })}
                <label
                  className={`flex cursor-text flex-col justify-center rounded-xl border-2 px-2.5 py-1.5 transition-all ${
                    p.useCustom ? "border-gold bg-[#FFF8E6]" : "border-dashed border-vk-200 focus-within:border-vk-500"
                  }`}
                >
                  <span className="text-[10.5px] font-semibold uppercase tracking-wide text-ink/50">{t("Other")}</span>
                  <span className="mt-0.5 flex items-baseline gap-0.5">
                    <span aria-hidden className="font-heading text-[15px] font-bold text-vk-700">₹</span>
                    <input
                      type="number"
                      inputMode="numeric"
                      min={MIN_AMOUNT}
                      placeholder={String(MIN_AMOUNT)}
                      aria-label={t("Other amount")}
                      aria-invalid={customTooLow || undefined}
                      value={p.customAmount}
                      onFocus={() => p.setCustom(p.customAmount)}
                      onChange={(e) => p.setCustom(e.target.value)}
                      className="w-full min-w-0 bg-transparent font-heading text-[15px] font-bold text-ink outline-none [appearance:textfield] placeholder:text-ink/30 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    />
                  </span>
                </label>
              </div>
              <p className={`mt-1.5 text-[11px] ${customTooLow ? "font-semibold text-red-600" : "text-ink/45"}`}>
                {t("Minimum ₹{min}", { min: MIN_AMOUNT })} · {t("₹25 = 1 meal")}
              </p>

              {/* Impact */}
              <div className="mt-3.5 flex items-center gap-3 rounded-2xl bg-gradient-to-br from-vk-100 via-vk-50 to-white px-4 py-3 text-vk-900 ring-1 ring-vk-200" aria-live="polite">
                <div className="min-w-0 flex-1">
                  <p className="font-heading text-[1.35rem] font-extrabold leading-none text-gold">
                    {meals > 0 ? meals.toLocaleString("en-IN") : "0"} <span className="text-[13px] font-semibold text-ink/70">{t("hot meals")}</span>
                  </p>
                  <p className="mt-1 text-[11.5px] text-ink/55">{t("for patients and their attendants")}</p>
                </div>
                <div className="grid shrink-0 grid-cols-4 gap-1" aria-hidden>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <motion.span key={i} animate={{ opacity: i < lit ? 1 : 0.25, scale: i < lit ? 1 : 0.8 }} transition={{ delay: i * 0.03 }}
                      className="flex h-5 w-5 items-center justify-center rounded-full bg-gold text-vk-900">
                      <PrasadamIcon className="h-3 w-3" />
                    </motion.span>
                  ))}
                </div>
              </div>

              {p.status?.type === "error" && <p role="alert" className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-[12.5px] font-medium text-red-700">{t(p.status.message)}</p>}

              <button type="submit" className="vk-btn-gold group mt-4 h-[52px] w-full rounded-xl text-[15px] font-bold">
                {t("Continue")} · {finalAmount > 0 ? inr(finalAmount) : "₹—"}
                <ArrowRight aria-hidden className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </motion.div>
          ) : (
            <motion.div key="s2" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }} transition={{ duration: 0.2 }} className="space-y-2.5">
              <div className="flex items-center justify-between gap-2 rounded-xl bg-[#FFF8E6] px-3 py-2 ring-1 ring-gold/40">
                <span className="min-w-0 text-[13px] font-semibold text-vk-900">
                  {meals.toLocaleString("en-IN")} {t("meals")} · <span className="text-gold-deep">{inr(finalAmount)}</span>
                </span>
                <button type="button" onClick={() => p.setStep(1)} className="inline-flex shrink-0 items-center gap-1 text-[12.5px] font-semibold text-vk-600 hover:text-vk-800">
                  <ArrowLeft className="h-3.5 w-3.5" /> {t("Change")}
                </button>
              </div>
              <FloatInput id="sj-name" icon={User} label={t("Full name")} type="text" required autoComplete="name"
                value={p.form.name} onChange={(e) => p.setForm((f) => ({ ...f, name: e.target.value }))} />
              <FloatInput id="sj-mobile" icon={Phone} label={t("Mobile number")} type="tel" required maxLength={10} inputMode="numeric" autoComplete="tel-national"
                value={p.form.mobile} onChange={(e) => p.setForm((f) => ({ ...f, mobile: cleanMobile(e.target.value) }))} />
              {p.lookupHint}
              <FloatInput id="sj-email" icon={Mail} label={`${t("Email address")} ${t("(optional)")}`} type="email" inputMode="email" autoComplete="email"
                value={p.form.email} onChange={(e) => p.setForm((f) => ({ ...f, email: e.target.value }))} />
              <DonorExtrasFields
                sevakName={p.form.sevakName}
                dob={p.form.dob}
                onSevakNameChange={(v) => p.setForm((f) => ({ ...f, sevakName: v }))}
                onDobChange={(v) => p.setForm((f) => ({ ...f, dob: v }))}
                occasion={p.form.dedicationOccasion}
                occasionNote={p.form.dedicationNote}
                onOccasionChange={(v) => p.setForm((f) => ({ ...f, dedicationOccasion: v }))}
                onOccasionNoteChange={(v) => p.setForm((f) => ({ ...f, dedicationNote: v }))}
                collapsible
              />
              {p.status && (
                <p role={p.status.type === "error" ? "alert" : "status"} className={`rounded-xl px-3 py-2 text-[12.5px] font-medium ${p.status.type === "error" ? "bg-red-50 text-red-700" : "bg-green-50 text-green-800"}`}>
                  {t(p.status.message)}
                </p>
              )}
              <div ref={p.payRef}>
                <button type="submit" disabled={p.submitting} className="vk-btn-gold group h-[52px] w-full rounded-xl text-[15px] font-bold disabled:cursor-wait disabled:opacity-80">
                  {p.submitting ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> {t("Processing…")}</>
                  ) : (
                    <><Heart className="h-4 w-4 fill-current" /> {t("Donate {amount}", { amount: inr(finalAmount) })} <ArrowRight aria-hidden className="h-4 w-4 transition-transform group-hover:translate-x-1" /></>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <ul className="mt-3.5 flex items-center justify-center gap-x-3 gap-y-1 text-[10.5px] font-semibold text-ink/55">
          <li className="inline-flex items-center gap-1"><Lock className="h-3 w-3 text-vk-500" /> {t("Secure · Razorpay")}</li>
          <li aria-hidden>·</li>
          <li className="inline-flex items-center gap-1"><MessageCircle className="h-3 w-3 text-vk-500" /> {t("Receipt on WhatsApp")}</li>
        </ul>
      </form>
    </div>
  );
}

/* ───────────────────────── Page ───────────────────────── */

export default function SubhojanamClient() {
  const t = useT();
  const attribution = useAttribution(PATH);
  const razorpayReady = useRazorpayPreload();

  // Like useScrollToDonate, but only for visitors arriving from an ad or WhatsApp
  // link (utm/amount in the URL); everyone else sees the banner first.
  useEffect(() => {
    const qs = new URLSearchParams(window.location.search);
    if (![...qs.keys()].some((k) => k === "amount" || k.startsWith("utm_"))) return;
    const timer = setTimeout(() => document.getElementById("donate")?.scrollIntoView({ behavior: "smooth", block: "start" }), 400);
    return () => clearTimeout(timer);
  }, []);

  const [step, setStep] = useState<1 | 2>(1);
  const [tierIndex, setTierIndex] = useState(TIERS.findIndex((x) => x.popular));
  const [useCustom, setUseCustom] = useState(false);
  const [customAmount, setCustomAmount] = useState("");
  const [form, setForm] = useState<DonorForm>({ name: "", email: "", mobile: "", sevakName: "", dob: "", dedicationOccasion: "", dedicationNote: "" });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [stats, setStats] = useState<SevaStats | null>(null);
  const [widgetInView, setWidgetInView] = useState(true);
  const [typing, setTyping] = useState(false);
  const [quote, setQuote] = useState(0);

  const { lookupHint } = useDonorPrefill({ form, setForm });

  const widgetRef = useRef<HTMLDivElement>(null);
  const payRef = useRef<HTMLDivElement>(null);

  const finalAmount = useCustom ? Number(customAmount) || 0 : TIERS[tierIndex]?.amount || 0;
  const meals = Math.floor(finalAmount / MEAL_PRICE);

  const selectTier = (i: number) => { setUseCustom(false); setTierIndex(i); setStatus(null); };
  const setCustom = (v: string) => { setUseCustom(true); setCustomAmount(v); setStatus(null); };

  useEffect(() => {
    const el = widgetRef.current;
    if (!el) return;
    const o = new IntersectionObserver(([e]) => setWidgetInView(e.isIntersecting), { threshold: 0.15 });
    o.observe(el);
    return () => o.disconnect();
  }, []);

  useEffect(() => {
    // ?amount=5000 in an ad or WhatsApp link preselects that amount.
    const amt = Number(new URLSearchParams(window.location.search).get("amount"));
    if (!amt) return;
    const idx = TIERS.findIndex((x) => x.amount === amt);
    if (idx >= 0) setTierIndex(idx);
    else if (amt > 0) { setUseCustom(true); setCustomAmount(String(amt)); }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${apiBase()}/seva-stats?sevaName=${encodeURIComponent(SEVA_NAME)}&limit=5`);
        if (res.ok) setStats(await res.json());
      } catch {}
    })();
  }, []);

  useEffect(() => {
    const id = setInterval(() => setQuote((q) => (q + 1) % TESTIMONIALS.length), 7000);
    return () => clearInterval(id);
  }, []);

  const scrollToDonate = () => document.getElementById("donate")?.scrollIntoView({ behavior: "smooth", block: "center" });

  const sponsorAmount = (amount: number) => {
    const idx = TIERS.findIndex((x) => x.amount === amount);
    if (idx >= 0) selectTier(idx);
    else setCustom(String(amount));
    setStep(1);
    scrollToDonate();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    if (finalAmount < MIN_AMOUNT) {
      setStatus({ type: "error", message: `The minimum offering is ₹${MIN_AMOUNT}.` });
      return;
    }
    if (!form.name.trim()) {
      setStatus({ type: "error", message: "Please fill in your name and phone number." });
      return;
    }
    if (!/^[6-9]\d{9}$/.test(form.mobile.trim())) {
      setStatus({ type: "error", message: "Please enter a valid 10-digit mobile number." });
      return;
    }
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setStatus({ type: "error", message: "Please enter a valid email address, or leave it blank." });
      return;
    }

    setSubmitting(true);
    trackInitiateCheckout({ value: finalAmount, content_name: SEVA_NAME });
    try {
      const metaEventId = newEventId();
      const metaBrowser = getMetaBrowserData();
      const orderRes = await fetch(`${apiBase()}/payments/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          account: "touchstone",
          sourcePage: PATH,
          utm: attribution.payload().utm,
          sevaName: SEVA_NAME,
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          mobile: form.mobile.trim(),
          amount: finalAmount,
          sevakName: form.sevakName.trim() || undefined,
          dob: form.dedicationOccasion === "birthday" ? form.dob || undefined : undefined,
          dedicationOccasion: form.dedicationOccasion || undefined,
          dedicationNote: form.dedicationOccasion === "other" ? form.dedicationNote.trim() || undefined : undefined,
          dedicationDate: form.dedicationOccasion ? form.dob || undefined : undefined,
          metaEventId,
          metaFbp: metaBrowser.fbp,
          metaFbc: metaBrowser.fbc,
        }),
      });
      if (!orderRes.ok) {
        const body = await orderRes.json().catch(() => ({}));
        throw new Error(body.message || "Unable to create payment order. Please try again.");
      }
      const order = await orderRes.json();
      await razorpayReady();
      const win = window as unknown as { Razorpay?: RazorpayConstructor };
      if (!win.Razorpay) throw new Error("Razorpay checkout is unavailable. Please try again.");
      new win.Razorpay({
        key: order.key,
        amount: Math.round(finalAmount * 100),
        currency: "INR",
        name: "Touchstone Charities",
        description: `Subhojanam — ${meals.toLocaleString("en-IN")} meals`,
        order_id: order.orderId,
        prefill: { name: form.name, email: prefillEmail(form.email), contact: form.mobile },
        notes: { sourcePage: PATH, sevaName: SEVA_NAME },
        handler: async (response: Record<string, string>) => {
          try {
            const verifyRes = await fetch(`${apiBase()}/payments/verify`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                donationId: order.donationId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            if (!verifyRes.ok) throw new Error("Payment verification failed.");
            trackPurchase({ value: finalAmount, eventId: metaEventId, content_name: SEVA_NAME });
            window.location.assign(`/payment/thank-you?type=donation&seva=${encodeURIComponent(SEVA_NAME)}&amount=${finalAmount}&source=${encodeURIComponent("the Subhojanam meal programme")}`);
          } catch (err) {
            setStatus({ type: "error", message: err instanceof Error ? err.message : "Payment verification failed." });
          } finally {
            setSubmitting(false);
          }
        },
        modal: { ondismiss: () => setSubmitting(false) },
        theme: { color: "#D69E2E" },
      }).open();
    } catch (err) {
      setStatus({ type: "error", message: err instanceof Error ? err.message : "Something went wrong." });
      setSubmitting(false);
    }
  };

  const maxHospitalMeals = Math.max(...HOSPITALS.map((h) => h.meals));
  const q = TESTIMONIALS[quote];

  return (
    <PageLayout whatsappNumber={SEVA_WHATSAPP_NUMBER}>
      <MotionConfig reducedMotion="user">
        <main
          className="overflow-x-hidden bg-white pt-[var(--header-h)] supports-[overflow:clip]:overflow-x-clip"
          onFocus={(e) => { if (isTextField(e.target)) setTyping(true); }}
          onBlur={(e) => { if (!isTextField(e.relatedTarget)) setTyping(false); }}
        >
          {/* ═════════════ HERO ═════════════ */}
          <section className="relative isolate overflow-hidden bg-gradient-to-br from-vk-100 via-vk-50 to-white">
            <Image src={PHOTOS.counter} alt="" fill priority sizes="100vw" className="-z-20 object-cover opacity-[0.06]" />
            <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_10%_10%,rgba(246,199,82,0.30),transparent_45%),radial-gradient(ellipse_at_90%_85%,rgba(47,91,211,0.22),transparent_55%)]" />
            <div aria-hidden className="absolute inset-0 -z-10 opacity-[0.08] [background-image:radial-gradient(#2f5bd3_1px,transparent_1px)] [background-size:22px_22px]" />
            <div aria-hidden className="absolute -right-32 -top-32 -z-10 h-[30rem] w-[30rem] rounded-full border border-gold/30" />
            <div aria-hidden className="absolute -right-16 -top-16 -z-10 h-[22rem] w-[22rem] rounded-full border border-gold/20" />

            <div className="vk-container grid items-center gap-10 py-10 md:py-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14 lg:py-20">
              {/* Copy */}
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="min-w-0">
                <nav aria-label="Breadcrumb" className="mb-4 inline-flex items-center gap-1.5 text-[12.5px] font-medium text-ink/50">
                  <Link href="/" className="hover:text-vk-700">{t("Home")}</Link>
                  <ChevronRight aria-hidden className="h-3.5 w-3.5 opacity-60" />
                  <span className="text-vk-900" aria-current="page">Subhojanam</span>
                </nav>
                <div><Eyebrow>{t("Free hospital meal programme")}</Eyebrow></div>
                <h1 className="mt-4 font-heading text-[2.2rem] font-extrabold leading-[1.06] tracking-tight text-vk-900 sm:text-[2.9rem] lg:text-[3.2rem] xl:text-[3.6rem]">
                  {t("No patient should choose between")}{" "}
                  <span className="relative inline-block text-vk-600">
                    {t("food and medicine.")}
                    <svg aria-hidden viewBox="0 0 300 12" className="absolute -bottom-2 left-0 h-3 w-full text-gold/70" preserveAspectRatio="none">
                      <path d="M2 9c60-6 120-8 296-4" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                  </span>
                </h1>
                <p className="mt-6 max-w-xl text-[15.5px] leading-relaxed text-ink/70 md:text-[17px]">
                  {t("Subhojanam serves free, hygienic and nutritious meals every day to patients and their attendants at government hospitals in Visakhapatnam and Kakinada.")}
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <motion.button type="button" onClick={scrollToDonate} whileTap={{ scale: 0.98 }} className="vk-btn-gold h-14 rounded-2xl px-8 text-base font-bold shadow-[0_16px_34px_-14px_rgba(246,199,82,0.8)]">
                    <Heart className="h-4 w-4 fill-current" /> {t("Sponsor meals")} <ArrowRight className="h-4 w-4" />
                  </motion.button>
                  <button
                    type="button"
                    onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
                    className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl border border-vk-200 bg-white px-7 text-[15px] font-semibold text-vk-800 transition hover:border-vk-400 hover:bg-vk-50"
                  >
                    {t("How it works")}
                  </button>
                </div>
                <ul className="mt-8 flex flex-wrap gap-2">
                  {HOSPITALS.map((h) => (
                    <li key={h.short} className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[12px] font-semibold text-vk-800 shadow-sm ring-1 ring-vk-100">
                      <Hospital aria-hidden className="h-3.5 w-3.5 text-gold" /> {h.short} · {t(h.city.split(" · ")[0])}
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Photo collage with floating chips */}
              <div className="relative mx-auto h-[300px] w-full max-w-[560px] sm:h-[400px] lg:h-[460px]">
                <div aria-hidden className="absolute inset-8 -z-10 rounded-full bg-[radial-gradient(closest-side,rgba(246,199,82,0.35),transparent)] blur-2xl" />
                <motion.div initial={{ opacity: 0, y: 18, rotate: -3 }} animate={{ opacity: 1, y: 0, rotate: -3 }} transition={{ delay: 0.15, duration: 0.7 }}
                  className="absolute left-0 top-[6%] h-[78%] w-[64%] overflow-hidden rounded-[26px] border-[5px] border-white shadow-[0_30px_60px_-24px_rgba(0,0,0,0.7)]">
                  <Image src={PHOTOS.counter} alt={t("Volunteers serving Subhojanam meals")} fill priority sizes="(min-width: 1024px) 360px, 64vw" className="object-cover object-[60%_center]" />
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 18, rotate: 4 }} animate={{ opacity: 1, y: 0, rotate: 4 }} transition={{ delay: 0.3, duration: 0.7 }}
                  className="absolute right-0 top-0 z-10 h-[52%] w-[46%] overflow-hidden rounded-[22px] border-[5px] border-white shadow-[0_30px_60px_-24px_rgba(0,0,0,0.7)]">
                  <Image src={PHOTOS.inspiration} alt={t("Subhojanam meals being served")} fill unoptimized sizes="260px" className="object-cover" />
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 18, rotate: -2 }} animate={{ opacity: 1, y: 0, rotate: -2 }} transition={{ delay: 0.45, duration: 0.7 }}
                  className="absolute bottom-0 right-[4%] z-10 h-[44%] w-[48%] overflow-hidden rounded-[22px] border-[5px] border-white shadow-[0_30px_60px_-24px_rgba(0,0,0,0.7)]">
                  <Image src={PHOTOS.serving} alt={t("A meal being served")} fill unoptimized sizes="270px" className="object-cover object-left" />
                </motion.div>
                <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.75, type: "spring" }}
                  className="absolute bottom-[6%] left-[4%] z-20 inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-2 text-[12.5px] font-bold text-vk-900 shadow-xl">
                  <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75 motion-reduce:hidden" /><span className="relative h-2 w-2 rounded-full bg-emerald-500" /></span>
                  {t("Served every day · 365 days")}
                </motion.span>
                <motion.div initial={{ opacity: 0, scale: 0.7, rotate: -10 }} animate={{ opacity: 1, scale: 1, rotate: -8 }} transition={{ delay: 0.9, type: "spring", stiffness: 200, damping: 14 }}
                  className="absolute -left-1 -top-2 z-30 flex h-[76px] w-[76px] flex-col items-center justify-center rounded-full bg-gold text-center text-vk-900 shadow-[0_18px_40px_-12px_rgba(201,150,43,0.9)] ring-4 ring-white sm:-left-4 sm:-top-4 sm:h-24 sm:w-24">
                  <PrasadamIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                  <span className="font-heading text-[1.2rem] font-extrabold leading-none sm:text-[1.5rem]">₹25</span>
                  <span className="text-[8.5px] font-bold sm:text-[10px] uppercase tracking-[0.12em]">{t("= 1 meal")}</span>
                </motion.div>
              </div>
            </div>

          </section>
          <GoldDivider />

          {/* ═════════════ STATS ═════════════ */}
          <section className="bg-white pb-6 pt-4 md:pb-10">
            <div className="vk-container">
              <dl className="mx-auto grid max-w-6xl grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
                {STATS.map((s, i) => (
                  <motion.div key={s.label} {...rise} transition={{ duration: 0.5, delay: i * 0.08 }}
                    className="group relative overflow-hidden rounded-2xl bg-white p-4 ring-1 ring-vk-100 transition-shadow hover:shadow-[0_20px_40px_-28px_rgba(47,91,211,0.6)] md:p-5">
                    <span aria-hidden className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-gold/10 transition-transform duration-500 group-hover:scale-125" />
                    <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-vk-50 text-vk-600"><s.icon className="h-5 w-5" /></span>
                    <dt className="sr-only">{t(s.label)}</dt>
                    <dd className="relative mt-3 font-heading text-[1.55rem] font-extrabold leading-none text-vk-700 md:text-[2rem]"><CountUp to={s.to} suffix={s.suffix} /></dd>
                    <dd className="relative mt-1.5 text-[12.5px] font-medium text-ink/55 md:text-[13px]">{t(s.label)}</dd>
                  </motion.div>
                ))}
              </dl>
            </div>
          </section>

          {/* ═════════════ DONATE ═════════════ */}
          <section className={`${IVORY} relative overflow-hidden py-14 md:py-20`}>
            <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border border-gold/25" />
            <div className="vk-container relative">
              <div className="mx-auto grid max-w-5xl items-center gap-10 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-14">
                <motion.div {...rise} className="min-w-0 text-center lg:text-left">
                  <Eyebrow>{t("Sponsor meals")}</Eyebrow>
                  <h2 className="mt-4 font-heading text-[1.85rem] font-extrabold leading-[1.12] tracking-tight text-vk-900 md:text-[2.5rem]">
                    {t("Feed a patient and their family")} <span className="text-vk-600">{t("today")}</span>
                  </h2>
                  <p className="mx-auto mt-4 max-w-lg text-[15.5px] leading-relaxed text-ink/65 lg:mx-0">
                    {t("Every ₹25 puts a warm, nutritious meal in the hands of a patient or attendant who would otherwise go without.")}
                  </p>
                  <ul className="mx-auto mt-7 max-w-md space-y-3 text-left lg:mx-0">
                    {[
                      [PrasadamIcon, "₹25 sponsors one hot meal", "Fresh rice, dal and vegetables, cooked that morning."],
                      [Hospital, "Served at the hospital itself", "At KGH, GGH Kakinada and Homi Bhabha Cancer Hospital."],
                      [MessageCircle, "Receipt on WhatsApp", "Sent as soon as your payment is confirmed."],
                    ].map(([Icon, title, text]) => {
                      const I = Icon as typeof Hospital;
                      return (
                        <li key={title as string} className="flex gap-3.5 rounded-2xl bg-white p-4 ring-1 ring-vk-100">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold/15 text-gold-deep"><I className="h-5 w-5" /></span>
                          <span className="min-w-0">
                            <span className="block font-heading text-[15px] font-bold text-vk-900">{t(title as string)}</span>
                            <span className="mt-0.5 block text-[13.5px] leading-snug text-ink/60">{t(text as string)}</span>
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </motion.div>

                <motion.div id="donate" ref={widgetRef} {...rise} className="relative mx-auto w-full max-w-[420px] min-w-0 scroll-mt-28">
                  <div aria-hidden className="absolute -inset-4 -z-10 rounded-[36px] bg-[radial-gradient(closest-side,rgba(47,91,211,0.18),transparent)] blur-2xl" />
                  <DonationWidget
                    t={t}
                    step={step}
                    setStep={setStep}
                    tierIndex={tierIndex}
                    useCustom={useCustom}
                    customAmount={customAmount}
                    selectTier={selectTier}
                    setCustom={setCustom}
                    finalAmount={finalAmount}
                    meals={meals}
                    form={form}
                    setForm={setForm}
                    lookupHint={lookupHint}
                    status={status}
                    setStatus={setStatus}
                    submitting={submitting}
                    onSubmit={handleSubmit}
                    payRef={payRef}
                  />
                </motion.div>
              </div>
            </div>
          </section>


          {/* ═════════════ STORY ═════════════ */}
          <section className="bg-white py-14 md:py-20">
            <div className="vk-container">
              <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2 md:gap-16">
                <motion.div {...rise} className="relative mx-auto w-full max-w-md md:max-w-none">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] shadow-[0_34px_70px_-38px_rgba(10,18,51,0.6)]">
                    <Image src={PHOTOS.inspiration} alt={t("Subhojanam meals being served")} fill unoptimized sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                    <figure className="absolute inset-x-4 bottom-4 rounded-2xl bg-white/95 p-5 shadow-xl backdrop-blur md:inset-x-6 md:bottom-6 md:p-6">
                      <Quote aria-hidden className="h-7 w-7 text-gold" />
                      <blockquote className="mt-2 font-heading text-[1.3rem] font-bold leading-snug text-vk-900 md:text-[1.35rem]">
                        {t("No one within a ten-mile radius of our center should go hungry.")}
                      </blockquote>
                      <figcaption className="mt-2 text-[13px] font-semibold text-gold">— {t("Srila Prabhupada, our inspiration")}</figcaption>
                    </figure>
                  </div>
                  <div aria-hidden className="absolute -bottom-4 -left-4 -z-10 h-full w-full rounded-[28px] bg-gold/20" />
                </motion.div>
                <motion.div {...rise} className="min-w-0">
                  <Eyebrow>{t("The programme")}</Eyebrow>
                  <h2 className="mt-4 font-heading text-[1.85rem] font-extrabold leading-[1.12] tracking-tight text-vk-900 md:text-[2.5rem]">
                    {t("Feeding hope,")} <span className="text-vk-600">{t("one meal at a time")}</span>
                  </h2>
                  <div className="mt-5 space-y-4 text-[15.5px] leading-[1.8] text-ink/70 md:text-base">
                    <p>{t("Annadana is one of the greatest forms of charity. Subhojanam provides free, hygienic and nutritious meals to underprivileged patients and their attendants in government hospitals.")}</p>
                    <p>{t("Many families stay hungry to save money for medicine. Subhojanam makes sure they never have to make that impossible choice. Every meal is prepared with love in hygienic kitchens, following strict quality standards, and served with devotion.")}</p>
                  </div>
                  <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                    {[
                      [Sparkles, "Fresh and hygienic", "Cooked every morning to strict quality standards."],
                      [HandHeart, "Served with dignity", "Handed to patients and attendants at the hospital."],
                    ].map(([Icon, title, text]) => {
                      const I = Icon as typeof Sparkles;
                      return (
                        <li key={title as string} className={`flex gap-3 rounded-2xl ${IVORY} p-4 ring-1 ring-gold/25`}>
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-gold-deep ring-1 ring-gold/30"><I className="h-5 w-5" /></span>
                          <span className="min-w-0">
                            <span className="block font-heading text-[15px] font-bold text-vk-900">{t(title as string)}</span>
                            <span className="mt-0.5 block text-[13.5px] leading-snug text-ink/60">{t(text as string)}</span>
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                  <button type="button" onClick={scrollToDonate} className="vk-btn-gold mt-8 h-14 rounded-2xl px-8 text-base font-bold">
                    <Heart className="h-4 w-4 fill-current" /> {t("Sponsor meals")}
                  </button>
                </motion.div>
              </div>
            </div>
          </section>

          {/* ═════════════ SPONSOR A FULL DAY ═════════════ */}
          <section className={`${IVORY} relative overflow-hidden py-14 md:py-24`}>
            <div aria-hidden className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full border border-gold/25" />
            <div className="vk-container relative">
              <SectionTitle eyebrow={t("Sponsor a full day")} title={t("Feed an entire hospital for a day")} sub={t("Mark a birthday, an anniversary or the memory of a loved one by sponsoring every meal served for a day.")} />
              <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-3 md:gap-5">
                {DAY_SPONSORSHIPS.map((d, i) => (
                  <motion.article key={d.amount} {...rise} transition={{ duration: 0.5, delay: i * 0.08 }} whileHover={{ y: -6 }}
                    className={`relative flex flex-col overflow-hidden rounded-[26px] p-6 md:p-7 ${
                      d.featured
                        ? "bg-gradient-to-br from-vk-100 via-vk-50 to-white ring-2 ring-vk-300 shadow-[0_30px_60px_-34px_rgba(47,91,211,0.6)]"
                        : "bg-white shadow-[0_18px_40px_-30px_rgba(10,18,51,0.45)] ring-1 ring-vk-100"
                    }`}>
                    {d.featured && <span className="absolute right-5 top-5 rounded-full bg-gold px-2.5 py-1 text-[10.5px] font-extrabold uppercase tracking-wide text-vk-900">{t("All hospitals")}</span>}
                    <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${d.featured ? "bg-gold/15 text-gold" : "bg-vk-50 text-vk-600"}`}>
                      {d.featured ? <Sparkles className="h-6 w-6" /> : <Hospital className="h-6 w-6" />}
                    </span>
                    <h3 className={`mt-5 font-heading text-[18px] font-bold text-vk-900`}>{t(d.title)}</h3>
                    <p className={`mt-1.5 text-[14px] leading-relaxed text-ink/60`}>{t(d.text)}</p>
                    <div className={`mt-6 flex items-end justify-between gap-3 border-t border-dashed pt-5 ${"border-vk-200"}`}>
                      <div>
                        <p className={`font-heading text-[1.9rem] font-extrabold leading-none ${d.featured ? "text-vk-600" : "text-vk-900"}`}>{inr(d.amount)}</p>
                        <p className={`mt-1 text-[12.5px] font-medium text-ink/50`}>{d.meals.toLocaleString("en-IN")} {t("meals")}</p>
                      </div>
                    </div>
                    <button type="button" onClick={() => sponsorAmount(d.amount)}
                      className={`mt-5 inline-flex h-12 items-center justify-center gap-2 rounded-xl text-[14.5px] font-bold transition ${
                        d.featured ? "vk-btn-gold" : "bg-vk-50 text-vk-800 ring-1 ring-vk-200 hover:bg-vk-100"
                      }`}>
                      {t("Sponsor this day")} <ArrowRight className="h-4 w-4" />
                    </button>
                  </motion.article>
                ))}
              </div>
            </div>
          </section>

          {/* ═════════════ HOSPITALS ═════════════ */}
          <section className="bg-white py-14 md:py-24">
            <div className="vk-container">
              <SectionTitle eyebrow={t("Where the meals go")} title={t("Three hospitals, every single day")} sub={t("Patients and the family members who stay beside them receive a hot meal at the hospital itself.")} />
              <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-3 md:gap-5">
                {HOSPITALS.map((h, i) => (
                  <motion.article key={h.short} {...rise} transition={{ duration: 0.5, delay: i * 0.08 }}
                    className="group relative flex flex-col overflow-hidden rounded-[26px] bg-white shadow-[0_18px_40px_-30px_rgba(10,18,51,0.45)] ring-1 ring-vk-100">
                    <div className="relative overflow-hidden bg-gradient-to-br from-vk-100 via-vk-50 to-white px-6 pb-6 pt-5 text-vk-900 border-b border-vk-100">
                      <span aria-hidden className="absolute -right-6 -top-8 font-heading text-[6.5rem] font-extrabold leading-none text-vk-600/[0.07]">{h.short}</span>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-vk-700 ring-1 ring-vk-200">
                        <Hospital className="h-3.5 w-3.5" /> {h.short}
                      </span>
                      <p className="mt-4 font-heading text-[2.1rem] font-extrabold leading-none text-vk-600">{t(h.display)}</p>
                      <p className="mt-1 text-[12.5px] font-medium text-ink/55">{t("meals a day")}</p>
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="font-heading text-[17px] font-bold leading-snug text-vk-900">{t(h.name)}</h3>
                      <p className="mt-1 inline-flex items-start gap-1 text-[13px] text-ink/55"><MapPin aria-hidden className="mt-0.5 h-3.5 w-3.5 shrink-0" />{t(h.city)}</p>
                      <div className="mt-auto pt-5">
                        <div className="h-2 overflow-hidden rounded-full bg-vk-50" aria-hidden>
                          <motion.div initial={{ width: 0 }} whileInView={{ width: `${(h.meals / maxHospitalMeals) * 100}%` }} viewport={{ once: true }} transition={{ duration: 1.1, delay: 0.2 + i * 0.1, ease: "easeOut" }}
                            className="h-full rounded-full bg-gradient-to-r from-gold to-[hsl(var(--gold-deep))]" />
                        </div>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            </div>
          </section>

          {/* ═════════════ HOW IT WORKS ═════════════ */}
          <section id="how-it-works" className={`${IVORY} scroll-mt-28 py-14 md:py-24`}>
            <div className="vk-container">
              <SectionTitle eyebrow={t("How it works")} title={t("From our kitchen to the hospital ward")} />
              <ol className="relative mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
                <span aria-hidden className="absolute left-[12%] right-[12%] top-[52px] hidden border-t-2 border-dashed border-gold/50 lg:block" />
                {STEPS.map((s, i) => (
                  <motion.li key={s.title} {...rise} transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="relative flex flex-col items-center rounded-[24px] bg-white px-5 pb-6 pt-5 text-center shadow-[0_18px_40px_-32px_rgba(10,18,51,0.45)] ring-1 ring-vk-100">
                    <span className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-vk-100 text-vk-700 ring-1 ring-vk-200">
                      <s.icon className="h-7 w-7" />
                      <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-gold font-heading text-[12px] font-extrabold text-vk-900 ring-4 ring-white">{i + 1}</span>
                    </span>
                    <h3 className="mt-5 font-heading text-[17px] font-bold text-vk-900">{t(s.title)}</h3>
                    <p className="mt-1.5 text-[14px] leading-relaxed text-ink/60">{t(s.text)}</p>
                  </motion.li>
                ))}
              </ol>
            </div>
          </section>

          {/* ═════════════ STORIES ═════════════ */}
          <section className="bg-white py-14 md:py-24">
            <div className="vk-container">
              <div className="mx-auto grid max-w-6xl items-center gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
                <motion.div {...rise} className="relative hidden aspect-[5/4] overflow-hidden rounded-[28px] shadow-[0_34px_70px_-38px_rgba(10,18,51,0.6)] lg:block">
                  <Image src={PHOTOS.serving} alt={t("A meal being served")} fill unoptimized sizes="45vw" className="object-cover object-left" />
                  <span className="absolute bottom-5 left-5 rounded-2xl bg-white/95 px-4 py-3 shadow-xl backdrop-blur">
                    <span className="block font-heading text-xl font-extrabold leading-none text-vk-900"><CountUp to={3000} suffix="+" /></span>
                    <span className="mt-1 block text-[12px] font-medium text-ink/60">{t("people fed every day")}</span>
                  </span>
                </motion.div>
                <div className="min-w-0">
                  <SectionTitle align="left" eyebrow={t("Real stories")} title={t("Voices of gratitude")} />
                  <div className="relative -mt-2 min-h-[260px] rounded-[26px] bg-gradient-to-br from-vk-50 via-white to-[#FFF7E3] p-6 ring-1 ring-vk-100 md:p-8">
                    <Quote aria-hidden className="absolute right-6 top-6 h-14 w-14 text-gold/20" />
                    <AnimatePresence mode="wait">
                      <motion.figure key={quote} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }}>
                        <blockquote className="font-heading text-[1.15rem] font-semibold leading-relaxed text-vk-900 md:text-[1.3rem]">“{t(q.quote)}”</blockquote>
                        <figcaption className="mt-6 flex items-center gap-3">
                          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gradient-to-br from-gold to-[hsl(var(--gold-deep))] font-heading text-[16px] font-extrabold text-vk-900">{q.name.charAt(0)}</span>
                          <span className="min-w-0">
                            <span className="block font-heading text-[15.5px] font-bold text-vk-900">{q.name}</span>
                            <span className="block text-[13px] text-ink/55">{t(q.role)}</span>
                          </span>
                        </figcaption>
                      </motion.figure>
                    </AnimatePresence>
                  </div>
                  <div className="mt-5 flex items-center gap-2">
                    {TESTIMONIALS.map((x, i) => (
                      <button key={x.name} type="button" onClick={() => setQuote(i)} aria-label={t("Show story {n}", { n: i + 1 })}
                        className={`h-2.5 rounded-full transition-all ${i === quote ? "w-8 bg-gold" : "w-2.5 bg-vk-200 hover:bg-vk-300"}`} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ═════════════ RECENT DONORS (only when the API has some) ═════════════ */}
          {stats && stats.donors.length > 0 && (
            <section className={`${IVORY} py-14 md:py-20`}>
              <div className="vk-container">
                <div className="mx-auto grid max-w-5xl items-center gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12">
                  <div className="min-w-0 text-center lg:text-left">
                    <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-emerald-700 ring-1 ring-emerald-100">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75 motion-reduce:hidden" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                      </span>
                      {t("Live")}
                    </span>
                    <h2 className="mt-4 font-heading text-[1.6rem] font-extrabold leading-tight tracking-tight text-vk-900 md:text-[2rem]">{t("Recent sponsors of Subhojanam")}</h2>
                    <p className="mx-auto mt-2 max-w-md text-[15px] leading-relaxed text-ink/65 lg:mx-0">{t("Thank you to everyone who has fed a patient recently.")}</p>
                    <button type="button" onClick={scrollToDonate} className="vk-btn-gold mt-6 h-12 px-8 text-[15px] font-bold">
                      <Heart className="h-4 w-4 fill-current" /> {t("Join them")}
                    </button>
                  </div>
                  <ul className="min-w-0 overflow-hidden rounded-3xl bg-white shadow-[0_24px_50px_-34px_rgba(47,91,211,0.45)] ring-1 ring-vk-100">
                    {stats.donors.slice(0, 5).map((d, i) => (
                      <motion.li key={`${d.name}-${i}`} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.35, delay: i * 0.06 }}
                        className="flex items-center gap-3 border-b border-vk-50 px-4 py-3.5 last:border-b-0 sm:px-5">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-vk-100 font-heading text-[15px] font-bold text-vk-700">{d.name.charAt(0).toUpperCase()}</span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[15px] font-semibold text-vk-900">{d.name}</span>
                          <span className="block text-[12px] text-ink/50">{d.time}</span>
                        </span>
                        <span className="shrink-0 text-right">
                          <span className="block font-heading text-[14px] font-bold text-vk-700">{inr(d.amount)}</span>
                          <span className="block text-[11px] text-ink/50">{t("{n} meals", { n: Math.floor(d.amount / MEAL_PRICE).toLocaleString("en-IN") })}</span>
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          )}

          {/* ═════════════ RUN UNDER ═════════════ */}
          <section className="bg-white py-14 md:py-20">
            <div className="vk-container">
              <motion.div {...rise} className="mx-auto grid max-w-6xl items-center gap-8 rounded-[28px] bg-gradient-to-br from-vk-50 via-white to-[#FFF7E3] p-6 ring-1 ring-vk-100 md:grid-cols-[auto_1fr] md:gap-12 md:p-10">
                <div className="flex items-center justify-center gap-4">
                  <span className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-vk-100">
                    <Image src={TouchstoneCharitiesLogo} alt="Touchstone Charities" width={220} height={220} className="h-16 w-auto object-contain md:h-20" />
                  </span>
                  <span className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-vk-100">
                    <Image src={HKMLogoBlack} alt="Srila Prabhupada's Hare Krishna Movement Visakhapatnam" width={300} height={162} className="h-12 w-auto max-w-full object-contain md:h-14" />
                  </span>
                </div>
                <div className="min-w-0 text-center md:text-left">
                  <Eyebrow>{t("Run under")}</Eyebrow>
                  <p className="mt-3 text-[15px] leading-relaxed text-ink/70">
                    {t("Subhojanam is a charitable programme run under Touchstone Charities, an initiative of Hare Krishna Movement Visakhapatnam — one of the trusts of Srila Prabhupada's ISKCON Gambheeram Visakhapatnam.")}
                  </p>
                  <ul className="mt-4 flex flex-wrap justify-center gap-2 md:justify-start">
                    {["FCRA Registered Trust", "80G Tax Exemption Available", "Serving since 2018"].map((c) => (
                      <li key={c} className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[12.5px] font-semibold text-vk-800 ring-1 ring-vk-100">
                        <ShieldCheck aria-hidden className="h-4 w-4 text-vk-500" /> {t(c)}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </div>
          </section>

          {/* ═════════════ FAQ ═════════════ */}
          <EdFaq faqs={SUBHOJANAM_FAQS} topic={SEVA_NAME} />

          {/* ═════════════ FINAL CALL ═════════════ */}
          <section className="bg-white px-4 pb-16 pt-4 md:pb-24">
            <motion.div {...rise} className="relative isolate mx-auto max-w-6xl overflow-hidden rounded-[32px] bg-gradient-to-br from-vk-100 via-vk-50 to-white px-6 py-12 ring-1 ring-vk-200 text-center md:px-14 md:py-20">
              <Image src={PHOTOS.serving} alt="" fill unoptimized sizes="100vw" className="-z-20 object-cover opacity-[0.06]" />
              <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_0%,rgba(246,199,82,0.22),transparent_60%)]" />
              <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 -z-10 h-72 w-72 rounded-full border border-gold/30" />
              <div aria-hidden className="pointer-events-none absolute -bottom-32 -left-20 -z-10 h-72 w-72 rounded-full border border-vk-200" />
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gold text-vk-900 shadow-[0_14px_30px_-10px_rgba(246,199,82,0.8)]"><PrasadamIcon className="h-7 w-7" /></span>
              <h2 className="mx-auto mt-6 max-w-3xl font-heading text-[1.9rem] font-extrabold leading-[1.12] tracking-tight text-vk-900 md:text-[3rem]">
                {t("Someone at the hospital is waiting for a meal")}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-[15.5px] leading-relaxed text-ink/65 md:text-lg">
                {t("Sponsor meals today, or give your time in our kitchen and distribution team.")}
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <button type="button" onClick={scrollToDonate} className="vk-btn-gold h-14 w-full max-w-xs rounded-2xl px-8 text-base font-bold sm:w-auto">
                  <Heart className="h-4 w-4 fill-current" /> {t("Sponsor meals")} <ArrowRight className="h-4 w-4" />
                </button>
                <Link href="/contact" className="inline-flex h-14 w-full max-w-xs items-center justify-center gap-2 rounded-2xl border border-vk-200 bg-white px-7 text-[15px] font-semibold text-vk-800 transition hover:border-vk-500 hover:bg-vk-50 sm:w-auto">
                  <Users className="h-4 w-4" /> {t("Volunteer with us")}
                </Link>
              </div>
              <p className="mt-8 flex flex-wrap justify-center gap-x-5 gap-y-1 text-[13px] text-ink/55">
                <a href="tel:+918977761187" className="inline-flex items-center gap-1.5 hover:text-vk-700"><Phone className="h-3.5 w-3.5" /> +91 89777 61187</a>
                <a href="mailto:social@hkmvizag.org" className="inline-flex items-center gap-1.5 hover:text-vk-700"><Mail className="h-3.5 w-3.5" /> social@hkmvizag.org</a>
                <span className="inline-flex items-center gap-1.5"><BadgeCheck className="h-3.5 w-3.5" /> Touchstone Charities</span>
              </p>
            </motion.div>
          </section>

          {/* ── Sticky phone donate bar (when the widget is off-screen and nobody is typing) ── */}
          <AnimatePresence>
            {!widgetInView && !typing && (
              <motion.div key="sticky" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }} transition={{ duration: 0.2 }}
                className="fixed bottom-[calc(var(--bottom-nav-space)+4px+env(safe-area-inset-bottom))] left-3 right-[76px] z-40 lg:hidden">
                <div className="flex items-center justify-between gap-2 rounded-2xl border border-vk-100 bg-white p-2 pl-3.5 shadow-[0_14px_34px_-14px_rgba(10,18,51,0.45)]">
                  <div className="min-w-0">
                    <p className="truncate text-[11px] font-medium text-muted-foreground">{meals > 0 ? t("{n} meals", { n: meals.toLocaleString("en-IN") }) : "Subhojanam"}</p>
                    <p className="truncate font-heading text-base font-extrabold text-vk-800">{finalAmount > 0 ? inr(finalAmount) : "₹—"}</p>
                  </div>
                  <button type="button" onClick={scrollToDonate} className="vk-btn-gold h-11 shrink-0 whitespace-nowrap px-4 text-sm">
                    <Heart className="h-4 w-4 fill-current" /> {t("Donate")}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </MotionConfig>
    </PageLayout>
  );
}
