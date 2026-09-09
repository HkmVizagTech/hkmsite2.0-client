"use client";

import { FormEvent, useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import {
  Check, Copy, ShieldCheck, User, Phone, Mail,
  FileCheck2, UtensilsCrossed, Clock, Heart,
  ChevronDown, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DonorExtrasFields from "@/components/DonorExtrasFields";
import WhatsAppFloatButton from "@/components/WhatsAppFloatButton";
import FaqSection from "@/components/sqft-campaign/FaqSection";
import PageLayout from "@/components/PageLayout";
import { useRazorpayPreload } from "@/lib/useRazorpayPreload";
import { useAttribution } from "@/lib/useAttribution";
import { useSearchParams } from "next/navigation";
import { usePaymentStatusPoller } from "@/lib/usePaymentStatusPoller";
import { useScrollToDonate } from "@/lib/useScrollToDonate";
import {
  newEventId,
  getMetaBrowserData,
  trackInitiateCheckout,
  trackPurchase,
} from "@/lib/metaPixel";

// ─── Types ───────────────────────────────────────────────────────────────────

type SevaOption = {
  legacySevaId: number;
  label: string;
  amount: number | null;
};

type Seva = {
  slug: string;
  title: string;
  description: string;
  icon: string;
  image: string;
  options: SevaOption[];
};

type CheckoutForm = {
  donorName: string;
  donorMobile: string;
  donorEmail: string;
  customAmount: string;
  wantPrasadam: boolean;
  want80G: boolean;
  panNumber: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  sevakName: string;
  dob: string;
};

type SelectedOffering = {
  seva: Seva;
  option: SevaOption;
};

type RazorpayConstructor = new (
  options: Record<string, unknown>
) => { open: () => void };

// ─── Data ────────────────────────────────────────────────────────────────────

const DESKTOP_BANNER =
  "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1788946765218-1788946764659-Radhashtamidesk.webp";
const MOBILE_BANNER =
  "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1788946765793-1788946764894-Radhashtamimob.webp";
const DECOR_GARLAND =
  "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1785481873117-1785481872052-garland-removebg-preview.png";

const sevas: Seva[] = [
  {
    slug: "yajamana",
    title: "Yajamana Seva",
    description:
      "Become the chief sponsor of the grand Radhashtami celebrations. The Yajamana is honoured with special sankalpa, priority darshan and the most sacred blessings of Srimati Radharani.",
    icon: "🙏",
    image:
      "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1785833231776-1785833231103-ChatGPTImageAug42026021053PM.webp",
    options: [
      { legacySevaId: 3200, label: "Donate Rs. 25,555", amount: 25555 },
      { legacySevaId: 3201, label: "Donate Rs. 15,555", amount: 15555 },
      { legacySevaId: 3202, label: "Donate Rs. 11,111", amount: 11111 },
      { legacySevaId: 3203, label: "Donate Any Other Amount", amount: null },
    ],
  },
  {
    slug: "annadana",
    title: "Annadana Seva",
    description:
      "Sponsor sanctified prasadam for every devotee visiting the temple on Radhashtami. Anna Daan is the highest charity — feeding the hungry in the Lord's name.",
    icon: "🍛",
    image: "/assets/janmashtami-sk1.webp",
    options: [
      { legacySevaId: 3210, label: "Donate Rs. 15,555", amount: 15555 },
      { legacySevaId: 3211, label: "Donate Rs. 11,111", amount: 11111 },
      { legacySevaId: 3212, label: "Donate Rs. 5,555", amount: 5555 },
      { legacySevaId: 3213, label: "Donate Any Other Amount", amount: null },
    ],
  },
  {
    slug: "abhishekam",
    title: "Abhishekam Seva",
    description:
      "Sponsor the sacred Abhishekam of Sri Sri Radha Madan Mohan — the bathing ceremony with milk, honey, curd and sacred waters on the divine appearance day of Srimati Radharani.",
    icon: "🪷",
    image: "/assets/janmashtami-sk3.webp",
    options: [
      { legacySevaId: 3220, label: "Donate Rs. 11,111", amount: 11111 },
      { legacySevaId: 3221, label: "Donate Rs. 5,555", amount: 5555 },
      { legacySevaId: 3222, label: "Donate Rs. 2,111", amount: 2111 },
      { legacySevaId: 3223, label: "Donate Any Other Amount", amount: null },
    ],
  },
  {
    slug: "pushpalankara",
    title: "Pushpalankara Seva",
    description:
      "Offer divine flower garlands and floral decorations to Srimati Radharani — the most beautiful alankara that pleases Her transcendental senses on Radhashtami.",
    icon: "🌺",
    image: "/assets/janmashtami-sk2.webp",
    options: [
      { legacySevaId: 3230, label: "Donate Rs. 9,999", amount: 9999 },
      { legacySevaId: 3231, label: "Donate Rs. 5,555", amount: 5555 },
      { legacySevaId: 3232, label: "Donate Rs. 2,111", amount: 2111 },
      { legacySevaId: 3233, label: "Donate Any Other Amount", amount: null },
    ],
  },
  {
    slug: "naivedya",
    title: "Naivedya Seva",
    description:
      "Sponsor the sacred food offering to the Lordships. Naivedya is the devotional preparation of exquisite dishes offered to Sri Sri Radha Madan Mohan with love.",
    icon: "🍽️",
    image:
      "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1785833545819-1785833545717-naivedya.jpeg",
    options: [
      { legacySevaId: 3240, label: "Donate Rs. 7,777", amount: 7777 },
      { legacySevaId: 3241, label: "Donate Rs. 5,555", amount: 5555 },
      { legacySevaId: 3242, label: "Donate Rs. 2,111", amount: 2111 },
      { legacySevaId: 3243, label: "Donate Any Other Amount", amount: null },
    ],
  },
  {
    slug: "gau-seva",
    title: "Gau Seva",
    description:
      "Serve the sacred cows at our goshala with fodder, green grass and medicines on Radhashtami. Lord Krishna, the cowherd boy, is supremely pleased by Gau Seva.",
    icon: "🐄",
    image: "/assets/janmashtami-sk4.webp",
    options: [
      { legacySevaId: 3250, label: "Donate Rs. 5,555", amount: 5555 },
      { legacySevaId: 3251, label: "Donate Rs. 3,111", amount: 3111 },
      { legacySevaId: 3252, label: "Donate Rs. 1,111", amount: 1111 },
      { legacySevaId: 3253, label: "Donate Any Other Amount", amount: null },
    ],
  },
];

const TRUST_BADGES = [
  { icon: FileCheck2, label: "80G Tax Exemption" },
  { icon: UtensilsCrossed, label: "Mahaprasadam Sent" },
  { icon: Clock, label: "Instant Confirmation" },
  { icon: ShieldCheck, label: "Secure Razorpay Checkout" },
];

const PRIVILEGES = [
  {
    icon: UtensilsCrossed,
    title: "Sanctified Prasadam",
    text: "Receive the Lord's prasadam from the temple as a blessing for your seva (within India).",
  },
  {
    icon: Heart,
    title: "Sankalpa & Aarti",
    text: "Your name is included in the sankalpa and offered during aarti to Their Lordships.",
  },
  {
    icon: FileCheck2,
    title: "Contribution Certificate",
    text: "A digital certificate honouring your valued offering to the temple.",
  },
  {
    icon: ShieldCheck,
    title: "80G Tax Exemption",
    text: "Donations qualify for tax exemption under Section 80G of the Income Tax Act.",
  },
];

const FAQS = [
  {
    q: "What is Radhashtami?",
    a: "Radhashtami is the sacred appearance day (birthday) of Srimati Radharani, the supreme goddess of devotion and the most beloved of Lord Krishna. It falls on the eighth day (Ashtami) of the bright fortnight in the month of Bhadrapada (August–September). Devotees celebrate by offering special sevas, abhishekam, flowers and food to the Lordships.",
  },
  {
    q: "What sevas can I offer on Radhashtami?",
    a: "You can offer Yajamana Seva (chief sponsor), Annadana Seva (food distribution), Abhishekam Seva (sacred bathing ceremony), Pushpalankara Seva (flower decorations), Naivedya Seva (food offering to the Deities), and Gau Seva (serving the sacred cows). You may also donate any custom amount.",
  },
  {
    q: "How will my donation be used?",
    a: "Your donation directly funds the Radhashtami celebrations — the Abhishekam materials, flower decorations, prasadam preparation and distribution, cow care and all sacred rituals. We are fully transparent about how every rupee is spent.",
  },
  {
    q: "Is my donation eligible for 80G tax exemption?",
    a: "Yes. Donations to Hare Krishna Movement qualify for tax exemption under Section 80G of the Income Tax Act. Select the '80G receipt' option during checkout and provide your PAN.",
  },
  {
    q: "Will I receive a receipt?",
    a: "Yes. An email receipt is sent automatically the moment your payment is confirmed. Your 80G certificate follows separately once your PAN is verified.",
  },
  {
    q: "Is it safe to donate online here?",
    a: "Yes. All payments are processed through Razorpay, a PCI-DSS-compliant payment gateway. We never see or store your card details. You may also donate via direct bank transfer using the details on this page.",
  },
];

const initialForm: CheckoutForm = {
  donorName: "",
  donorMobile: "",
  donorEmail: "",
  customAmount: "",
  wantPrasadam: false,
  want80G: false,
  panNumber: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  sevakName: "",
  dob: "",
};

const apiBase = () =>
  (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080").replace(
    /\/+$/,
    ""
  );
const formatAmount = (amount: number) => amount.toLocaleString("en-IN");

// ─── Color tokens ────────────────────────────────────────────────────────────

const C = {
  deepGreen: "#064C3F",
  emerald: "#023B32",
  teal: "#087A68",
  mint: "#C9F3E8",
  lightMint: "#F2FAF7",
  gold: "#D6A93A",
  softGold: "#F2D98B",
  magenta: "#C21875",
  pink: "#E84A8A",
  yellow: "#F2C318",
  heading: "#063D35",
  text: "#263A36",
} as const;

// ─── Component ───────────────────────────────────────────────────────────────

export default function RadhashtamiClient() {
  const reduce = useReducedMotion();
  const attribution = useAttribution("radhashtami");
  const razorpayReady = useRazorpayPreload();
  const searchParams = useSearchParams();
  const { startPolling, stopPolling } = usePaymentStatusPoller({
    onCompleted: (result) => {
      window.location.assign(
        `/payment/thank-you?type=seva&seva=${encodeURIComponent(result.sevaName || "Radhashtami Seva")}&amount=${result.amount}&source=${encodeURIComponent("the Radhashtami seva programme")}`
      );
    },
  });
  useScrollToDonate("offer-seva");

  const [selected, setSelected] = useState<SelectedOffering | null>(null);
  const [form, setForm] = useState<CheckoutForm>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error" | "idle";
    message: string;
  }>({ type: "idle", message: "" });
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [highlightedSlug, setHighlightedSlug] = useState<string | null>(null);

  const finalAmount = selected?.option.amount ?? Number(form.customAmount || 0);
  const showTaxField = finalAmount >= 500;
  const showPrasadamField = finalAmount >= 1000;
  const needsAddress = form.want80G || form.wantPrasadam;

  useEffect(() => {
    const sevaSlug = searchParams.get("seva");
    if (!sevaSlug) return;
    const matched = sevas.find((s) => s.slug === sevaSlug);
    if (!matched) return;
    setHighlightedSlug(sevaSlug);
    const timer = setTimeout(() => {
      document
        .getElementById(`seva-card-${sevaSlug}`)
        ?.scrollIntoView({
          behavior: reduce ? "auto" : "smooth",
          block: "center",
        });
    }, 500);
    return () => clearTimeout(timer);
  }, [searchParams, reduce]);

  const updateForm = (patch: Partial<CheckoutForm>) => {
    setForm((c) => ({ ...c, ...patch }));
  };

  const openCheckout = (seva: Seva, option: SevaOption) => {
    setSelected({ seva, option });
    setForm(initialForm);
    setStatus({ type: "idle", message: "" });
    trackInitiateCheckout({ content_name: seva.title });
  };

  const closeCheckout = () => {
    if (!submitting) setSelected(null);
  };

  const validate = () => {
    if (!selected) return "Please select a seva.";
    if (!finalAmount || finalAmount < 100) return "Amount must be at least Rs.100.";
    if (!form.donorName.trim()) return "Donor name is required.";
    if (!/^[6-9]\d{9}$/.test(form.donorMobile))
      return "Please enter a valid 10 digit mobile number.";
    if (
      form.donorEmail.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.donorEmail.trim())
    )
      return "Please enter a valid email address, or leave it blank.";
    if (form.want80G && !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(form.panNumber))
      return "Please enter a valid PAN number.";
    if (needsAddress) {
      if (!form.address.trim() || !form.city.trim() || !form.state.trim() || !/^\d{6}$/.test(form.pincode))
        return "Please fill address, city, state and a valid 6-digit pincode.";
    }
    return "";
  };

  const submitDonation = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const error = validate();
    if (error) {
      setStatus({ type: "error", message: error });
      return;
    }
    if (!selected) return;
    setSubmitting(true);
    setStatus({ type: "idle", message: "" });

    try {
      const metaEventId = newEventId();
      const metaBrowser = getMetaBrowserData();
      const orderResponse = await fetch(`${apiBase()}/payments/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourcePage: "radhashtami",
          utm: attribution.payload().utm,
          festivalSlug: "radhashtami",
          type: "Sri Radhashtami",
          sevaName: selected.seva.title,
          legacySevaId: selected.option.legacySevaId,
          name: form.donorName.trim(),
          email: form.donorEmail.trim().toLowerCase(),
          mobile: form.donorMobile,
          amount: finalAmount,
          sevakName: form.sevakName.trim() || undefined,
          dob: form.dob || undefined,
          certificate: form.want80G,
          panNumber: form.want80G ? form.panNumber : undefined,
          mahaprasadam: form.wantPrasadam,
          prasadamAddress: needsAddress
            ? {
                street: form.address.trim(),
                city: form.city.trim(),
                state: form.state.trim(),
                pincode: form.pincode.trim(),
                country: "India",
              }
            : null,
          metaEventId,
          metaFbp: metaBrowser.fbp,
          metaFbc: metaBrowser.fbc,
        }),
      });

      if (!orderResponse.ok) throw new Error("Unable to create payment order.");
      const order = await orderResponse.json();
      await razorpayReady();

      const win = window as unknown as { Razorpay?: RazorpayConstructor };
      if (!win.Razorpay) throw new Error("Razorpay checkout is unavailable.");

      new win.Razorpay({
        key: order.key,
        amount: Math.round(finalAmount * 100),
        currency: "INR",
        name: "Hare Krishna Movement Vizag",
        description: `${selected.seva.title} — Radhashtami`,
        order_id: order.orderId,
        prefill: {
          name: form.donorName,
          email: form.donorEmail,
          contact: form.donorMobile,
        },
        notes: {
          sourcePage: "radhashtami",
          festivalSlug: "radhashtami",
          legacySevaId: selected.option.legacySevaId,
          sevaName: selected.seva.title,
          sevaOption: selected.option.label,
        },
        handler: async (response: Record<string, string>) => {
          stopPolling();
          try {
            const verifyResponse = await fetch(`${apiBase()}/payments/verify`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                donationId: order.donationId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            if (!verifyResponse.ok)
              throw new Error("Payment verification failed.");
            trackPurchase({
              value: finalAmount,
              eventId: metaEventId,
              content_name: selected.seva.title,
            });
            window.location.assign(
              `/payment/thank-you?type=seva&seva=${encodeURIComponent(selected.seva.title)}&amount=${finalAmount}&source=${encodeURIComponent("the Radhashtami seva programme")}`
            );
            setSelected(null);
          } catch (e) {
            setStatus({
              type: "error",
              message:
                e instanceof Error ? e.message : "Payment verification failed.",
            });
          } finally {
            setSubmitting(false);
          }
        },
        modal: {
          ondismiss: () => {
            setStatus({
              type: "idle",
              message:
                "If you completed the payment, your receipt will arrive shortly.",
            });
          },
        },
        theme: { color: C.deepGreen },
      }).open();

      startPolling(order.orderId);
    } catch (e) {
      setStatus({
        type: "error",
        message:
          e instanceof Error
            ? e.message
            : "Donation could not be completed. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageLayout>
      <main className="min-h-screen text-slate-950" style={{ background: C.lightMint }}>
        <WhatsAppFloatButton />

      {/* ═══════════════════════════════════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden pt-[88px] md:pt-[104px]" style={{ background: C.lightMint }}>
        {/* Floating golden particles */}
        {!reduce && (
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute h-1.5 w-1.5 rounded-full"
                style={{
                  background: i % 3 === 0 ? C.gold : i % 3 === 1 ? C.pink : C.yellow,
                  left: `${(i * 7 + 3) % 100}%`,
                  top: `${(i * 11 + 5) % 100}%`,
                }}
                animate={{
                  y: [0, -35, 0],
                  opacity: [0, 0.6, 0],
                  scale: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 3 + (i % 4),
                  repeat: Infinity,
                  delay: i * 0.35,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        )}

        <div className="relative overflow-hidden rounded-b-[2rem] md:rounded-b-[2.5rem]">
          <a href="#offer-seva" className="block">
            <picture>
              <source media="(max-width: 640px)" srcSet={MOBILE_BANNER} />
              <img
                src={DESKTOP_BANNER}
                alt="Sri Radhashtami celebrations at Hare Krishna Movement Vizag"
                className="h-auto w-full"
              />
            </picture>
          </a>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SEVA CARDS
      ═══════════════════════════════════════════════════════════════════ */}
      <section
        id="offer-seva"
        className="relative overflow-hidden px-4 py-12 md:py-16"
        style={{ background: `linear-gradient(180deg, ${C.lightMint}, #e8f8f0 50%, ${C.lightMint})` }}
      >
        {/* Decorative background elements */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          {/* Toran garlands hanging from the top corners */}
          <Image
            src={DECOR_GARLAND}
            alt=""
            unoptimized
            width={145}
            height={350}
            draggable={false}
            className="absolute left-0 top-0 h-[140px] w-auto opacity-30 md:h-[220px] md:opacity-40 lg:h-[300px] lg:opacity-50"
          />
          <Image
            src={DECOR_GARLAND}
            alt=""
            unoptimized
            width={145}
            height={350}
            draggable={false}
            className="absolute right-0 top-0 h-[140px] w-auto -scale-x-100 opacity-30 md:h-[220px] md:opacity-40 lg:h-[300px] lg:opacity-50"
          />
          <div
            className="absolute -left-20 top-1/4 h-72 w-72 rounded-full blur-[90px]"
            style={{ background: `${C.teal}10` }}
          />
          <div
            className="absolute -right-16 top-10 h-64 w-64 rounded-full blur-[80px]"
            style={{ background: `${C.gold}10` }}
          />
          <div
            className="absolute bottom-20 left-1/3 h-48 w-48 rounded-full blur-[70px]"
            style={{ background: `${C.magenta}08` }}
          />
        </div>

        <div className="relative mx-auto max-w-6xl">
          {/* Section heading */}
          <motion.div
            initial={reduce ? undefined : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <div className="mx-auto mb-5 flex items-center justify-center gap-4">
              <span
                className="h-px w-10 sm:w-16 md:w-24"
                style={{
                  background: `linear-gradient(to right, transparent, ${C.gold}80)`,
                }}
              />
              <svg
                className="h-6 w-6 md:h-8 md:w-8"
                viewBox="0 0 40 40"
                fill={C.gold}
              >
                <path d="M20 2 C24 8 26 14 20 20 C14 14 16 8 20 2Z" />
                <path d="M20 2 C24 8 26 14 20 20 C14 14 16 8 20 2Z" transform="rotate(72 20 20)" />
                <path d="M20 2 C24 8 26 14 20 20 C14 14 16 8 20 2Z" transform="rotate(144 20 20)" />
                <path d="M20 2 C24 8 26 14 20 20 C14 14 16 8 20 2Z" transform="rotate(216 20 20)" />
                <path d="M20 2 C24 8 26 14 20 20 C14 14 16 8 20 2Z" transform="rotate(288 20 20)" />
                <circle cx="20" cy="20" r="5" />
              </svg>
              <span
                className="h-px w-10 sm:w-16 md:w-24"
                style={{
                  background: `linear-gradient(to left, transparent, ${C.gold}80)`,
                }}
              />
            </div>
            <p
              className="text-xs font-semibold uppercase tracking-[0.28em] md:text-sm"
              style={{ color: C.teal }}
            >
              Choose Your Offering
            </p>
            <h2
              className="mt-2 text-3xl font-bold md:text-4xl lg:text-5xl"
              style={{ color: C.heading }}
            >
              Radhashtami Sevas
            </h2>
            <p
              className="mx-auto mt-4 max-w-lg text-sm leading-relaxed md:text-base"
              style={{ color: C.teal }}
            >
              Select a sacred seva and receive the divine blessings of Srimati
              Radharani
            </p>
          </motion.div>

          {/* Seva cards grid */}
          <motion.div
            initial={reduce ? undefined : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {sevas.map((seva, idx) => (
              <motion.article
                key={seva.slug}
                id={`seva-card-${seva.slug}`}
                initial={reduce ? undefined : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: reduce ? 0 : idx * 0.08 }}
                className="group scroll-mt-24 overflow-hidden rounded-2xl border bg-white transition-all duration-500 hover:-translate-y-1"
                style={{
                  borderColor:
                    highlightedSlug === seva.slug ? C.gold : `${C.teal}40`,
                  boxShadow:
                    highlightedSlug === seva.slug
                      ? `0 0 0 4px ${C.gold}50, 0 8px 30px ${C.teal}18`
                      : `0 2px 20px ${C.teal}12`,
                  ...(highlightedSlug === seva.slug && {
                    ringColor: C.gold,
                  }),
                }}
              >
                {/* Card image with gradient overlay + title */}
                <div className="relative h-44 overflow-hidden md:h-48">
                  <Image
                    src={seva.image}
                    alt={seva.title}
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(to top, ${C.emerald}ee, rgba(2,59,50,0.35) 55%, rgba(2,59,50,0.05))`,
                    }}
                  />
                  <div className="absolute bottom-2.5 left-4 right-4 flex items-center gap-2">
                    <span className="text-2xl drop-shadow">{seva.icon}</span>
                    <h3 className="text-lg font-bold tracking-wide text-white drop-shadow-md md:text-xl">
                      {seva.title}
                    </h3>
                  </div>
                </div>

                {/* Card body */}
                <div className="p-4 pt-3">
                  <p className="min-h-[52px] text-[13px] leading-relaxed md:text-sm" style={{ color: C.text }}>
                    {seva.description}
                  </p>
                  <div className="mt-4 space-y-2">
                    {(() => {
                      const primary = seva.options[0];
                      const custom = seva.options.find((o) => !o.amount) || seva.options[seva.options.length - 1];
                      return (
                        <>
                          <button
                            type="button"
                            onClick={() => openCheckout(seva, primary)}
                            className="flex w-full items-center justify-between rounded-xl border px-4 py-3.5 text-left transition-all duration-300"
                            style={{
                              borderColor: `${C.teal}50`,
                              background: `linear-gradient(135deg, ${C.deepGreen}, ${C.teal})`,
                              color: "white",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.borderColor = C.gold;
                              e.currentTarget.style.boxShadow = `0 4px 16px ${C.teal}30`;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.borderColor = `${C.teal}50`;
                              e.currentTarget.style.boxShadow = "none";
                            }}
                          >
                            <span className="text-[13px] font-semibold leading-tight">
                              Sponsor for{" "}
                              <span className="font-bold">
                                ₹{primary.amount != null ? formatAmount(primary.amount) : "—"}
                              </span>
                            </span>
                            <svg
                              className="h-4 w-4 shrink-0 opacity-70"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M5 12h14M13 6l6 6-6 6" />
                            </svg>
                          </button>

                          <button
                            type="button"
                            onClick={() => openCheckout(seva, custom)}
                            className="flex w-full items-center justify-center gap-1.5 rounded-xl border px-3 py-3 text-[13px] font-bold transition-all duration-300"
                            style={{
                              borderColor: `${C.gold}90`,
                              background: `linear-gradient(135deg, ${C.mint}, ${C.softGold}40)`,
                              color: C.deepGreen,
                            }}
                          >
                            <svg
                              className="h-3 w-3"
                              style={{ color: C.teal }}
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                            >
                              <line x1="12" y1="5" x2="12" y2="19" />
                              <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                            <span>Donate Other Amount</span>
                          </button>
                        </>
                      );
                    })()}
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>
      {/* ═══════════════════════════════════════════════════════════════════
          INTRO / ABOUT STRIP
      ═══════════════════════════════════════════════════════════════════ */}
      <motion.section
        initial={reduce ? undefined : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative px-4 py-12 text-white md:py-16"
        style={{
          background: `linear-gradient(135deg, ${C.emerald}, ${C.deepGreen} 60%, ${C.teal})`,
        }}
      >
        {!reduce && (
          <motion.div
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            aria-hidden
            style={{
              background: `linear-gradient(135deg, transparent 30%, ${C.gold} 50%, transparent 70%)`,
              backgroundSize: "200% 200%",
            }}
            animate={{ backgroundPosition: ["100% 100%", "0% 0%"] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
        )}
        <div className="relative mx-auto grid max-w-6xl gap-8 md:grid-cols-[1.35fr_0.65fr] md:items-center">
          <div>
            <p
              className="mb-3 text-sm font-semibold uppercase tracking-[0.22em]"
              style={{ color: C.softGold }}
            >
              Hare Krishna Movement
            </p>
            <h1
              className="text-3xl font-bold leading-tight md:text-5xl"
              style={{
                color: C.softGold,
                textShadow: `0 0 40px ${C.gold}40, 0 0 80px ${C.gold}20`,
              }}
            >
              Sri Radhashtami
            </h1>
            <p className="mt-5 max-w-4xl text-base leading-8 text-white/92 md:text-lg">
              Celebrate the divine appearance of Srimati Radharani — the supreme
              goddess of devotion and the most beloved of Lord Krishna. Offer
              sacred sevas and receive the unlimited blessings of Radha Rani at
              HKM Vizag.
            </p>
            <p
              className="mt-5 max-w-4xl border-l-4 pl-4 text-sm font-medium italic leading-7 text-white/90 md:text-base"
              style={{ borderColor: C.softGold }}
            >
              &ldquo;The divinity of Radharani is that She is the only one who
              can completely satisfy Krishna. The Lord is worshiped by all, but
              Radharani is the only one who can please Him.&rdquo;
            </p>
          </div>
          <div
            className="rounded-lg border p-5 shadow-2xl backdrop-blur"
            style={{ borderColor: "rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.1)" }}
          >
            <div className="flex items-start gap-3">
              <ShieldCheck
                className="mt-1 h-6 w-6 shrink-0"
                style={{ color: C.softGold }}
              />
              <div>
                <h2 className="text-lg font-bold text-white">
                  Offer Seva This Radhashtami
                </h2>
                <p className="mt-2 text-sm leading-6 text-white/78">
                  Your offering sustains the sacred Abhishekam, flower
                  decorations, Annadana and every divine ritual performed at
                  HKM Vizag on Srimati Radharani&apos;s appearance day.
                </p>
              </div>
            </div>
            <motion.a
              href="#offer-seva"
              animate={
                reduce
                  ? undefined
                  : {
                      boxShadow: [
                        `0 0 0 0 ${C.gold}66`,
                        `0 0 0 16px ${C.gold}00`,
                        `0 0 0 0 ${C.gold}66`,
                      ],
                    }
              }
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="mt-5 inline-flex w-full items-center justify-center rounded-md px-5 py-3 text-sm font-bold uppercase tracking-[0.08em] shadow-lg transition"
              style={{
                background: C.gold,
                color: C.emerald,
              }}
            >
              Offer Seva
            </motion.a>
          </div>
        </div>
      </motion.section>

      {/* ═══════════════════════════════════════════════════════════════════
          TRUST BADGES
      ═══════════════════════════════════════════════════════════════════ */}
      <motion.section
        initial={reduce ? undefined : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="border-y-2 py-3.5"
        style={{
          borderColor: `${C.gold}99`,
          background: C.emerald,
        }}
      >
        <div className="container mx-auto flex flex-wrap items-center justify-center gap-x-10 gap-y-2 px-4">
          {TRUST_BADGES.map((b) => (
            <span
              key={b.label}
              className="flex items-center gap-2 text-xs font-semibold tracking-wide text-white/90 md:text-sm"
            >
              <span
                className="flex h-6 w-6 items-center justify-center rounded-full"
                style={{
                  background: `${C.gold}22`,
                  boxShadow: `inset 0 0 0 1px ${C.gold}66`,
                }}
              >
                <b.icon className="h-3 w-3" style={{ color: C.gold }} />
              </span>
              {b.label}
            </span>
          ))}
        </div>
      </motion.section>

      {/* ═══════════════════════════════════════════════════════════════════
          BANK TRANSFER + NOTE
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="px-4 py-6" style={{ background: C.emerald }}>
        <div className="mx-auto max-w-6xl text-sm leading-7 text-white/90 md:text-base">
          While making UPI/Bank payments, please send a screenshot with your
          name, mobile, address and PAN details to our WhatsApp{" "}
          <a
            className="font-bold"
            href="tel:+918977761187"
            style={{ color: C.softGold }}
          >
            +91 89777 61187
          </a>{" "}
          or email{" "}
          <a
            className="font-bold"
            href="mailto:social@hkmvizag.org"
            style={{ color: C.softGold }}
          >
            social@hkmvizag.org
          </a>
          .
        </div>
      </section>

      <section className="px-4 py-12 md:py-16" style={{ background: C.lightMint }}>
        <div
          className="mx-auto max-w-6xl overflow-hidden rounded-2xl border bg-white p-6 shadow-lg md:p-8"
          style={{ borderColor: `${C.teal}30` }}
        >
          <h2
            className="text-xl font-bold"
            style={{ color: C.heading }}
          >
            Donation Through Bank (NEFT / RTGS)
          </h2>
          <div className="mt-4 space-y-3" style={{ color: C.text }}>
            {[
              { label: "Beneficiary Name", value: "HARE KRISHNA MOVEMENT INDIA" },
              { label: "Bank Name", value: "IDFC FIRST BANK LTD" },
              { label: "A/c No", value: "10091415313" },
              { label: "IFSC Code", value: "IDFB0080412" },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center gap-3">
                <span className="font-medium">{label}:</span>
                <span className="select-all">{value}</span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(value);
                    setCopiedField(label);
                    setTimeout(() => setCopiedField(null), 1500);
                  }}
                  className="ml-1 inline-flex items-center rounded p-1 transition-colors hover:bg-slate-100"
                  title={`Copy ${label}`}
                >
                  {copiedField === label ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4 text-slate-400" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          ABOUT RADHASHTAMI
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="px-4 py-12 md:py-16" style={{ background: C.lightMint }}>
        <div className="mx-auto max-w-4xl text-center">
          <div className="mx-auto mb-5 flex items-center justify-center gap-4">
            <span
              className="h-px w-16 md:w-24"
              style={{
                background: `linear-gradient(to right, transparent, ${C.gold}80)`,
              }}
            />
            <svg
              className="h-6 w-6 md:h-8 md:w-8"
              viewBox="0 0 40 40"
              fill={C.gold}
            >
              <path d="M20 2 C24 8 26 14 20 20 C14 14 16 8 20 2Z" />
              <path d="M20 2 C24 8 26 14 20 20 C14 14 16 8 20 2Z" transform="rotate(72 20 20)" />
              <path d="M20 2 C24 8 26 14 20 20 C14 14 16 8 20 2Z" transform="rotate(144 20 20)" />
              <path d="M20 2 C24 8 26 14 20 20 C14 14 16 8 20 2Z" transform="rotate(216 20 20)" />
              <path d="M20 2 C24 8 26 14 20 20 C14 14 16 8 20 2Z" transform="rotate(288 20 20)" />
              <circle cx="20" cy="20" r="5" />
            </svg>
            <span
              className="h-px w-16 md:w-24"
              style={{
                background: `linear-gradient(to left, transparent, ${C.gold}80)`,
              }}
            />
          </div>
          <p
            className="text-xs font-semibold uppercase tracking-[0.28em] md:text-sm"
            style={{ color: C.teal }}
          >
            The Divine Significance
          </p>
          <h2
            className="mt-2 text-3xl font-bold md:text-4xl"
            style={{ color: C.heading }}
          >
            Why Radhashtami Matters
          </h2>
          <div className="mt-8 space-y-5 text-left">
            <p
              className="text-sm leading-relaxed md:text-base"
              style={{ color: C.text }}
            >
              Srimati Radharani is the Supreme Goddess of devotion — the
              embodiment of divine love (prema) for Lord Krishna. Her
              appearance day, Radhashtami, is one of the most auspicious
              celebrations in the Vaishnava calendar. The scriptures declare
              that serving Radharani is the most direct way to attain the
              mercy of Lord Krishna, for She is the redistribution centre of
              all His love and blessings.
            </p>
            <p
              className="text-sm leading-relaxed md:text-base"
              style={{ color: C.text }}
            >
              On this sacred day, the Deities of Sri Sri Radha Madan Mohan
              are bathed in Panchamrit (five sacred liquids), decorated with
              elaborate flower garlands, and offered an opulent feast of
              Naivedya. The temple reverberates with kirtan, the chanting of
              the holy names, and every devotee participates in the joyous
              celebration of Radharani&apos;s divine mercy.
            </p>
            <p
              className="text-sm leading-relaxed md:text-base"
              style={{ color: C.text }}
            >
              By offering seva on Radhashtami, you participate directly in
              these sacred ceremonies. Your Annadana feeds the hungry, your
              Pushpalankara adorns the Lordships with divine flowers, your
              Abhishekam purifies the atmosphere, and your Gau Seva pleases
              Lord Krishna who served cows as a cowherd boy in Vrindavana.
              Every offering — no matter the amount — is received with love
              by Srimati Radharani.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          DONOR PRIVILEGES
      ═══════════════════════════════════════════════════════════════════ */}
      <section
        className="px-4 py-12 md:py-16"
        style={{ background: `linear-gradient(135deg, ${C.emerald}, ${C.deepGreen})` }}
      >
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <p
              className="mb-2 text-xs font-semibold uppercase tracking-[0.25em]"
              style={{ color: C.softGold }}
            >
              Our gratitude to every donor
            </p>
            <h2
              className="text-2xl font-bold text-white md:text-3xl"
            >
              Donor Privileges
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PRIVILEGES.map((p, i) => (
              <motion.div
                key={p.title}
                initial={reduce ? undefined : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="rounded-2xl border p-6"
                style={{
                  borderColor: "rgba(255,255,255,0.1)",
                  background: "rgba(255,255,255,0.05)",
                }}
              >
                <div
                  className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl"
                  style={{ background: `${C.gold}22` }}
                >
                  <p.icon className="h-6 w-6" style={{ color: C.gold }} />
                </div>
                <h3 className="mb-2 text-base font-bold text-white">
                  {p.title}
                </h3>
                <p className="text-sm leading-relaxed text-white/70">
                  {p.text}
                </p>
              </motion.div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <a
              href="#offer-seva"
              className="inline-flex items-center rounded-full px-10 py-3.5 text-sm font-bold shadow-lg transition-all hover:scale-105"
              style={{
                background: `linear-gradient(135deg, ${C.gold}, ${C.softGold})`,
                color: C.emerald,
                boxShadow: `0 8px 24px ${C.gold}50`,
              }}
            >
              Donate Now
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          FAQS
      ═══════════════════════════════════════════════════════════════════ */}
      <FaqSection faqs={FAQS} tone="mint" />

      {/* ═══════════════════════════════════════════════════════════════════
          STATUS TOAST
      ═══════════════════════════════════════════════════════════════════ */}
      {status.message && !selected && (
        <div
          className={`fixed bottom-6 left-1/2 z-[120] -translate-x-1/2 rounded-lg px-5 py-3 text-sm font-semibold shadow-lg ${
            status.type === "success" ? "bg-green-700 text-white" : "bg-red-700 text-white"
          }`}
        >
          {status.message}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          CHECKOUT MODAL
      ═══════════════════════════════════════════════════════════════════ */}
      {selected && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm">
          <div
            className="radhashtami-form-scroll relative max-h-[92vh] w-full max-w-2xl overflow-x-hidden overflow-y-auto rounded-2xl border shadow-2xl"
            style={{
              borderColor: `${C.teal}40`,
              background: `linear-gradient(180deg, ${C.lightMint}, white 40%)`,
            }}
          >
            <style>{`
              .radhashtami-form-scroll::-webkit-scrollbar { width: 6px; }
              .radhashtami-form-scroll::-webkit-scrollbar-track { background: transparent; }
              .radhashtami-form-scroll::-webkit-scrollbar-thumb { background: ${C.gold}; border-radius: 9999px; }
              .radhashtami-form-scroll::-webkit-scrollbar-thumb:hover { background: ${C.deepGreen}; }
              .radhashtami-form-scroll { scrollbar-width: thin; scrollbar-color: ${C.gold} transparent; }
            `}</style>

            {/* Gold accent bar */}
            <div
              className="h-1.5 w-full"
              style={{
                background: `linear-gradient(to right, ${C.deepGreen}, ${C.teal}, ${C.gold}, ${C.magenta})`,
              }}
            />

            <div className="relative z-10">
              {/* Sticky header */}
              <div
                className="sticky top-0 z-10 flex items-center justify-between border-b px-6 py-4 backdrop-blur"
                style={{
                  borderColor: `${C.teal}20`,
                  background: `${C.lightMint}ee`,
                }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-11 w-11 items-center justify-center rounded-full text-2xl shadow-sm"
                    style={{
                      background: `linear-gradient(135deg, ${C.deepGreen}, ${C.teal})`,
                    }}
                  >
                    <span className="drop-shadow">{selected.seva.icon}</span>
                  </span>
                  <div>
                    <p
                      className="text-[10px] font-semibold uppercase tracking-[0.18em]"
                      style={{ color: `${C.magenta}cc` }}
                    >
                      Radhashtami Seva
                    </p>
                    <h2
                      className="text-lg font-bold leading-tight"
                      style={{ color: C.heading }}
                    >
                      {selected.seva.title}
                    </h2>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={closeCheckout}
                  className="rounded-full border p-2 transition hover:scale-105"
                  style={{
                    borderColor: `${C.teal}30`,
                    background: "white",
                    color: C.teal,
                  }}
                  aria-label="Close checkout"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={submitDonation} className="space-y-5 p-5 md:p-6">
                {/* Summary */}
                <div
                  className="grid gap-4 rounded-lg border p-4 md:grid-cols-2"
                  style={{
                    borderColor: `${C.teal}20`,
                    background: "white",
                  }}
                >
                  <div>
                    <p className="text-xs font-semibold" style={{ color: `${C.teal}aa` }}>
                      Seva Name
                    </p>
                    <p
                      className="mt-1 font-bold"
                      style={{ color: C.heading }}
                    >
                      {selected.seva.title}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold" style={{ color: `${C.teal}aa` }}>
                      Seva Amount
                    </p>
                    <p
                      className="mt-1 font-bold"
                      style={{ color: C.heading }}
                    >
                      {selected.option.amount
                        ? `₹${formatAmount(selected.option.amount)}`
                        : "Enter amount below"}
                    </p>
                  </div>
                </div>

                {/* Custom amount */}
                {!selected.option.amount && (
                  <label className="block max-w-sm">
                    <span
                      className="text-sm font-semibold"
                      style={{ color: C.heading }}
                    >
                      Enter Seva Amount *
                    </span>
                    <Input
                      type="number"
                      min={100}
                      value={form.customAmount}
                      onChange={(e) =>
                        updateForm({
                          customAmount: e.target.value,
                          want80G: false,
                          wantPrasadam: false,
                        })
                      }
                      placeholder="Enter amount"
                      className="mt-2"
                      style={{ borderColor: `${C.teal}40` }}
                    />
                    <span
                      className="mt-1 block text-xs"
                      style={{ color: `${C.teal}80` }}
                    >
                      Amount must be at least Rs.100.
                    </span>
                  </label>
                )}

                {/* Donor fields */}
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <span
                      className="text-sm font-semibold"
                      style={{ color: C.heading }}
                    >
                      Donor Name *
                    </span>
                    <Input
                      value={form.donorName}
                      maxLength={39}
                      onChange={(e) =>
                        updateForm({
                          donorName: e.target.value.replace(/[^a-zA-Z ]/g, ""),
                        })
                      }
                      placeholder="Your Name"
                      className="mt-2"
                    />
                  </label>
                  <label className="block">
                    <span
                      className="text-sm font-semibold"
                      style={{ color: C.heading }}
                    >
                      Mobile Number *
                    </span>
                    <Input
                      value={form.donorMobile}
                      maxLength={10}
                      onChange={(e) =>
                        updateForm({
                          donorMobile: e.target.value.replace(/\D/g, ""),
                        })
                      }
                      placeholder="Your Mobile Number"
                      className="mt-2"
                    />
                  </label>
                  <label className="block md:col-span-2">
                    <span
                      className="text-sm font-semibold"
                      style={{ color: C.heading }}
                    >
                      E-Mail ID (optional)
                    </span>
                    <Input
                      type="email"
                      value={form.donorEmail}
                      onChange={(e) =>
                        updateForm({ donorEmail: e.target.value.toLowerCase() })
                      }
                      placeholder="Your Email"
                      className="mt-2"
                    />
                  </label>
                </div>

                <DonorExtrasFields
                  sevakName={form.sevakName}
                  dob={form.dob}
                  onSevakNameChange={(v) => updateForm({ sevakName: v })}
                  onDobChange={(v) => updateForm({ dob: v })}
                  variant="amber"
                  collapsible
                />

                {/* Add-ons */}
                <div className="space-y-3">
                  {showPrasadamField && (
                    <label
                      className="flex items-start gap-3 rounded-lg border p-4 text-sm"
                      style={{
                        borderColor: `${C.teal}30`,
                        color: C.heading,
                        background: "white",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={form.wantPrasadam}
                        onChange={(e) =>
                          updateForm({ wantPrasadam: e.target.checked })
                        }
                        className="mt-1 accent-emerald-600"
                      />
                      I would like to receive Maha Prasadam (Only within
                      India)
                    </label>
                  )}
                  {showTaxField && (
                    <label
                      className="flex items-start gap-3 rounded-lg border p-4 text-sm"
                      style={{
                        borderColor: `${C.teal}30`,
                        color: C.heading,
                        background: "white",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={form.want80G}
                        onChange={(e) =>
                          updateForm({ want80G: e.target.checked })
                        }
                        className="mt-1 accent-emerald-600"
                      />
                      <span>
                        I wish to receive 80G Tax Exemption
                        <span
                          className="mt-1 block text-xs"
                          style={{ color: `${C.teal}80` }}
                        >
                          PAN and address are mandatory when 80G is selected.
                        </span>
                      </span>
                    </label>
                  )}
                </div>

                {form.want80G && (
                  <label className="block max-w-sm">
                    <span
                      className="text-sm font-semibold"
                      style={{ color: C.heading }}
                    >
                      PAN Number *
                    </span>
                    <Input
                      value={form.panNumber}
                      maxLength={10}
                      onChange={(e) =>
                        updateForm({
                          panNumber: e.target.value
                            .toUpperCase()
                            .replace(/[^A-Z0-9]/g, ""),
                        })
                      }
                      placeholder="Eg: ABCDE1234F"
                      className="mt-2"
                    />
                  </label>
                )}

                {needsAddress && (
                  <div
                    className="grid gap-4 rounded-lg border p-4 md:grid-cols-2"
                    style={{
                      borderColor: `${C.teal}30`,
                      background: "white",
                    }}
                  >
                    <label className="block md:col-span-2">
                      <span
                        className="text-sm font-semibold"
                        style={{ color: C.heading }}
                      >
                        Full Address *
                      </span>
                      <Input
                        value={form.address}
                        maxLength={80}
                        onChange={(e) =>
                          updateForm({ address: e.target.value })
                        }
                        placeholder="Door No, Street, Area"
                        className="mt-2"
                      />
                    </label>
                    <label className="block">
                      <span
                        className="text-sm font-semibold"
                        style={{ color: C.heading }}
                      >
                        City *
                      </span>
                      <Input
                        value={form.city}
                        maxLength={30}
                        onChange={(e) =>
                          updateForm({
                            city: e.target.value.toUpperCase().replace(/[^A-Z ]/g, ""),
                          })
                        }
                        className="mt-2"
                      />
                    </label>
                    <label className="block">
                      <span
                        className="text-sm font-semibold"
                        style={{ color: C.heading }}
                      >
                        State *
                      </span>
                      <Input
                        value={form.state}
                        maxLength={30}
                        onChange={(e) =>
                          updateForm({
                            state: e.target.value.toUpperCase().replace(/[^A-Z ]/g, ""),
                          })
                        }
                        className="mt-2"
                      />
                    </label>
                    <label className="block">
                      <span
                        className="text-sm font-semibold"
                        style={{ color: C.heading }}
                      >
                        PIN Code *
                      </span>
                      <Input
                        value={form.pincode}
                        maxLength={6}
                        onChange={(e) =>
                          updateForm({
                            pincode: e.target.value.replace(/\D/g, ""),
                          })
                        }
                        className="mt-2"
                      />
                    </label>
                  </div>
                )}

                {status.type === "error" && (
                  <p className="rounded-lg bg-red-100 px-4 py-3 text-sm font-semibold text-red-700">
                    {status.message}
                  </p>
                )}

                <motion.div
                  animate={
                    reduce
                      ? undefined
                      : { scale: [1, 1.02, 1] }
                  }
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-6 text-base font-bold"
                    style={{
                      background: `linear-gradient(135deg, ${C.gold}, ${C.softGold})`,
                      color: C.emerald,
                    }}
                  >
                    <Heart className="mr-2 h-5 w-5 fill-current" />
                    {submitting
                      ? "Opening Checkout..."
                      : `Donate Rs. ${formatAmount(finalAmount || 0)}`}
                  </Button>
                </motion.div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          STICKY MOBILE DONATE BAR
      ═══════════════════════════════════════════════════════════════════ */}
      {!selected && (
        <div className="fixed inset-x-0 bottom-0 z-40 flex justify-center px-3 pb-3 pt-1 md:hidden">
          <a
            href="#offer-seva"
            className="inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-xs font-bold shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${C.gold}, ${C.softGold})`,
              color: C.emerald,
              boxShadow: `0 8px 24px ${C.gold}50`,
            }}
          >
            🪔 Donate Now
          </a>
        </div>
      )}
    </main>
    </PageLayout>
  );
}
