"use client";

import { FormEvent, useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import Image from "next/image";
import {
  Check, Copy, ShieldCheck,
  FileCheck2, UtensilsCrossed, Clock, Heart,
  X, ArrowRight, Plus, Landmark,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import SectionHeading from "@/components/site/SectionHeading";
import Reveal from "@/components/site/Reveal";
import DonorExtrasFields from "@/components/DonorExtrasFields";
import { useDonorPrefill } from "@/lib/donorPrefill";
import WhatsAppFloatButton from "@/components/WhatsAppFloatButton";
import FaqSection from "@/components/sqft-campaign/FaqSection";
import PageLayout from "@/components/PageLayout";
import { useRazorpayPreload } from "@/lib/useRazorpayPreload";
import { useAttribution } from "@/lib/useAttribution";
import SearchParamsWatcher from "@/components/SearchParamsWatcher";
import { usePaymentStatusPoller } from "@/lib/usePaymentStatusPoller";
import { useScrollToDonate } from "@/lib/useScrollToDonate";
import PhonePeUpiCard from "@/components/PhonePeUpiCard";
import {
  newEventId,
  getMetaBrowserData,
  trackInitiateCheckout,
  trackPurchase,
} from "@/lib/metaPixel";
import { useUpiFallback } from "@/components/UpiFallbackDialog";

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
  "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1789476038584-1789476037499-govardhan-desk.webp";
const MOBILE_BANNER =
  "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1789476039312-1789476037958-govardhan-mobile.webp";

const sevas: Seva[] = [
  {
    slug: "govardhan",
    title: "Govardhan Seva",
    description:
      "Sponsor the sacred worship of Govardhan Hill — the divine mountain lifted by Lord Krishna to protect the residents of Vrindavan.",
    icon: "⛰️",
    image: "/assets/janmashtami-sk3.webp",
    options: [
      { legacySevaId: 3400, label: "Donate Rs. 21,111", amount: 21111 },
      { legacySevaId: 3401, label: "Donate Rs. 11,111", amount: 11111 },
      { legacySevaId: 3402, label: "Donate Rs. 5,555", amount: 5555 },
      { legacySevaId: 3403, label: "Donate Rs. 2,100", amount: 2100 },
      { legacySevaId: 3404, label: "Donate Any Other Amount", amount: null },
    ],
  },
  {
    slug: "gau-seva",
    title: "Gau Seva",
    description:
      "Serve the sacred cows at our goshala — a seva supremely dear to Lord Krishna and Govardhan.",
    icon: "🐄",
    image: "/assets/janmashtami-sk4.webp",
    options: [
      { legacySevaId: 3410, label: "Donate Rs. 5,555", amount: 5555 },
      { legacySevaId: 3411, label: "Donate Rs. 3,100", amount: 3100 },
      { legacySevaId: 3412, label: "Donate Rs. 2,100", amount: 2100 },
      { legacySevaId: 3413, label: "Donate Rs. 1,100", amount: 1100 },
      { legacySevaId: 3414, label: "Donate Any Other Amount", amount: null },
    ],
  },
  {
    slug: "bhog",
    title: "Bhog Seva",
    description:
      "Sponsor the sacred food offering — exquisite dishes prepared with love for the Lordships on Govardhan Puja.",
    icon: "🍽️",
    image:
      "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1785833545819-1785833545717-naivedya.jpeg",
    options: [
      { legacySevaId: 3420, label: "Donate Rs. 11,111", amount: 11111 },
      { legacySevaId: 3421, label: "Donate Rs. 7,777", amount: 7777 },
      { legacySevaId: 3422, label: "Donate Rs. 5,555", amount: 5555 },
      { legacySevaId: 3423, label: "Donate Rs. 2,100", amount: 2100 },
      { legacySevaId: 3424, label: "Donate Any Other Amount", amount: null },
    ],
  },
  {
    slug: "alankar",
    title: "Alankar Seva",
    description:
      "Offer divine flower garlands and floral decorations to adorn the Lordships on the festive day.",
    icon: "🌺",
    image: "/assets/janmashtami-sk2.webp",
    options: [
      { legacySevaId: 3430, label: "Donate Rs. 9,999", amount: 9999 },
      { legacySevaId: 3431, label: "Donate Rs. 5,555", amount: 5555 },
      { legacySevaId: 3432, label: "Donate Rs. 3,100", amount: 3100 },
      { legacySevaId: 3433, label: "Donate Rs. 1,100", amount: 1100 },
      { legacySevaId: 3434, label: "Donate Any Other Amount", amount: null },
    ],
  },
  {
    slug: "annakoot",
    title: "Annakoot Seva",
    description:
      "Sponsor the grand Annakoot — a mountain of food offered to the Lord, mirroring the feast that honours Govardhan Hill.",
    icon: "🏔️",
    image:
      "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1785833232608-1785833231421-chapan-bhog.webp",
    options: [
      { legacySevaId: 3440, label: "Donate Rs. 25,555", amount: 25555 },
      { legacySevaId: 3441, label: "Donate Rs. 15,555", amount: 15555 },
      { legacySevaId: 3442, label: "Donate Rs. 11,111", amount: 11111 },
      { legacySevaId: 3443, label: "Donate Rs. 5,555", amount: 5555 },
      { legacySevaId: 3444, label: "Donate Any Other Amount", amount: null },
    ],
  },
  {
    slug: "vaishnav-bhojan",
    title: "Vaishnav Bhojan",
    description:
      "Feed visiting devotees and guests with sanctified prasadam on this auspicious day of Govardhan Puja.",
    icon: "🍛",
    image: "/assets/janmashtami-sk1.webp",
    options: [
      { legacySevaId: 3450, label: "Donate Rs. 7,777", amount: 7777 },
      { legacySevaId: 3451, label: "Donate Rs. 5,555", amount: 5555 },
      { legacySevaId: 3452, label: "Donate Rs. 3,100", amount: 3100 },
      { legacySevaId: 3453, label: "Donate Rs. 1,500", amount: 1500 },
      { legacySevaId: 3454, label: "Donate Any Other Amount", amount: null },
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
    q: "What is Govardhan Puja?",
    a: "Govardhan Puja, also known as Annakoot, is the day after Diwali when devotees remember Lord Krishna lifting Govardhan Hill on His little finger for seven days to protect the residents of Vrindavan from torrential rains sent by Indra. A grand mountain of vegetarian delicacies (Annakoot) is offered to the Lord.",
  },
  {
    q: "What sevas can I offer on Govardhan Puja?",
    a: "You can offer Govardhan Seva (worship of the sacred hill), Gau Seva (cow care), Bhog Seva (sacred food offering), Alankar Seva (flower decorations), Annakoot Seva (the grand feast of 56 delicacies) and Vaishnav Bhojan (feeding devotees). You may also donate any custom amount.",
  },
  {
    q: "How will my donation be used?",
    a: "Your donation directly funds the Govardhan Puja celebrations — the worship of Govardhan Hill, the grand Annakoot feast, bhog preparations, flower decorations, cow care and prasadam distribution. We are fully transparent about how every rupee is spent.",
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

// Shared field styling for the checkout modal inputs (merged over ui/Input defaults).
const inputCls =
  "mt-1.5 h-11 rounded-xl border-vk-200 text-[15px] focus-visible:border-vk-500 focus-visible:ring-vk-500/20 focus-visible:ring-offset-0 md:text-[15px]";

// ─── Color tokens ────────────────────────────────────────────────────────────
// Page chrome is styled with the Vaikuntham Blue vk-* classes; these hexes are
// only for places that need a raw colour (Razorpay theme, modal scrollbar).
// deepGreen = original palette value (Razorpay theme) · teal = vk-300

const C = {
  deepGreen: "#0B2D4A", // kept: Razorpay checkout theme colour
  teal: "#B9C8FB",
} as const;

// ─── Component ───────────────────────────────────────────────────────────────

export default function GovardhanPujaClient() {
  const reduce = useReducedMotion();
  const attribution = useAttribution("govardhan-puja");
  const razorpayReady = useRazorpayPreload();
  const { offerUpi, upiFallbackDialog } = useUpiFallback();
  const [searchParams, setSearchParams] = useState<URLSearchParams>(() => new URLSearchParams());
  const { startPolling, stopPolling } = usePaymentStatusPoller({
    onCompleted: (result) => {
      window.location.assign(
        `/payment/thank-you?type=seva&seva=${encodeURIComponent(result.sevaName || "Govardhan Puja Seva")}&amount=${result.amount}&source=${encodeURIComponent("the Govardhan Puja seva programme")}`
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

  // Donor pre-fill: logged-in profile auto-fills name/email/mobile; a
  // returning donor's phone lookup fills the same fields after they type
  // their 10-digit number. PAN/address are filled only when 80G/prasadam
  // are selected.
  const { lookupHint, prefill, handle80GToggle, handlePrasadamToggle } = useDonorPrefill({
    form,
    setForm,
    fieldMap: { name: "donorName", email: "donorEmail", mobile: "donorMobile" },
    onMahaPrasadamSelect: (saved) => {
      setForm((c) =>
        !c.address && !c.city && !c.state && !c.pincode
          ? {
              ...c,
              address: (saved.street || "").trim(),
              city: saved.city,
              state: saved.state,
              pincode: saved.pincode,
            }
          : c
      );
    },
  });

  const openCheckout = (seva: Seva, option: SevaOption) => {
    setSelected({ seva, option });
    setForm(
      prefill
        ? {
            ...initialForm,
            donorName: prefill.name,
            donorMobile: prefill.mobile,
            donorEmail: prefill.email,
            panNumber: prefill.panNumber,
          }
        : initialForm
    );
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
          sourcePage: "govardhan-puja",
          // Page hero banner — used as the header image of the pending-payment WhatsApp reminder.
          bannerImage: DESKTOP_BANNER,
          utm: attribution.payload().utm,
          festivalSlug: "govardhan-puja",
          type: "Sri Govardhan Puja",
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
      if (!win.Razorpay) {
        offerUpi({ donationId: order.donationId, orderId: order.orderId, amount: finalAmount, campaign: `Govardhan Puja — ${selected.seva.title}`, donorName: form.donorName });
        return;
      }

      new win.Razorpay({
        key: order.key,
        amount: Math.round(finalAmount * 100),
        currency: "INR",
        name: "Hare Krishna Movement Vizag",
        description: `${selected.seva.title} — Govardhan Puja`,
        order_id: order.orderId,
        prefill: {
          name: form.donorName,
          email: form.donorEmail,
          contact: form.donorMobile,
        },
        notes: {
          sourcePage: "govardhan-puja",
          festivalSlug: "govardhan-puja",
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
              `/payment/thank-you?type=seva&seva=${encodeURIComponent(selected.seva.title)}&amount=${finalAmount}&source=${encodeURIComponent("the Govardhan Puja seva programme")}`
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
            offerUpi({ donationId: order.donationId, orderId: order.orderId, amount: finalAmount, campaign: `Govardhan Puja — ${selected.seva.title}`, donorName: form.donorName });
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
      {upiFallbackDialog}
      <SearchParamsWatcher onChange={setSearchParams} />
      <main className="min-h-screen bg-white pt-[var(--header-h)] text-ink">
        <WhatsAppFloatButton />

      {/* ═══════════════════════════════════════════════════════════════════
          HERO — campaign banner in an inset rounded card
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="bg-gradient-to-b from-vk-50 to-white pb-4 pt-4 md:pb-6 md:pt-6">
        <div className="vk-container">
          <div className="overflow-hidden rounded-3xl bg-vk-900 shadow-[0_24px_60px_-28px_rgba(10,18,51,0.6)]">
            <a href="#offer-seva" className="block">
              <picture>
                <source media="(max-width: 640px)" srcSet={MOBILE_BANNER} />
                <img
                  src={DESKTOP_BANNER}
                  alt="Sri Govardhan Puja celebrations at Hare Krishna Movement Vizag"
                  className="block h-auto w-full"
                />
              </picture>
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SEVA CARDS
      ═══════════════════════════════════════════════════════════════════ */}
      <section id="offer-seva" className="vk-section">
        <div className="vk-container">
          <SectionHeading
            eyebrow="Choose Your Offering"
            title="Govardhan Puja Sevas"
            subtitle="Select a sacred seva and receive the divine blessings of Govardhan"
            align="center"
          />

          {/* Seva cards grid */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {sevas.map((seva, idx) => {
              const primary = seva.options[0];
              const tiers = seva.options.slice(1, 4);
              const custom = seva.options.find((o) => !o.amount) || seva.options[seva.options.length - 1];
              const highlighted = highlightedSlug === seva.slug;
              return (
                <Reveal key={seva.slug} delay={reduce ? 0 : (idx % 3) * 0.06} className="h-full">
                  <article
                    id={`seva-card-${seva.slug}`}
                    className={`vk-card vk-card-hover group flex h-full scroll-mt-24 flex-col overflow-hidden ${
                      highlighted ? "ring-2 ring-vk-500 ring-offset-2" : ""
                    }`}
                  >
                    {/* Card image */}
                    <div className="relative h-44 overflow-hidden bg-vk-900 md:h-48">
                      <Image
                        src={seva.image}
                        alt={seva.title}
                        fill
                        unoptimized
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-vk-900/60 via-vk-900/5 to-transparent" />
                      <span
                        className="absolute left-3 top-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/90 text-xl shadow-sm backdrop-blur"
                        aria-hidden
                      >
                        {seva.icon}
                      </span>
                    </div>

                    {/* Card body */}
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="vk-h3 !text-xl">{seva.title}</h3>
                      <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground md:text-sm">
                        {seva.description}
                      </p>
                      <div className="mt-auto space-y-2.5 pt-5">
                        <button
                          type="button"
                          onClick={() => openCheckout(seva, primary)}
                          className="vk-btn-gold h-12 w-full justify-between px-4 text-[14px] font-bold"
                        >
                          <span>
                            Sponsor for{" "}
                            <span className="font-extrabold">
                              ₹{primary.amount != null ? formatAmount(primary.amount) : "—"}
                            </span>
                          </span>
                          <ArrowRight className="h-4 w-4 shrink-0" />
                        </button>

                        <div className="grid grid-cols-3 gap-2">
                          {tiers.map((t) => (
                            <button
                              key={t.legacySevaId}
                              type="button"
                              onClick={() => openCheckout(seva, t)}
                              className="min-h-[44px] rounded-xl border border-vk-200 bg-white px-1 py-2.5 text-center text-sm font-bold text-vk-800 transition-all hover:border-vk-500 hover:bg-vk-50"
                            >
                              ₹{t.amount != null ? formatAmount(t.amount) : "—"}
                            </button>
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={() => openCheckout(seva, custom)}
                          className="vk-btn-outline h-11 w-full text-[13px] font-bold"
                        >
                          <Plus className="h-4 w-4" />
                          <span>Donate Other Amount</span>
                        </button>
                      </div>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Direct PhonePe / UPI payment, for donors who can't use Razorpay */}
      <PhonePeUpiCard campaign="Govardhan Puja" />

      {/* ═══════════════════════════════════════════════════════════════════
          INTRO / ABOUT + TRUST BADGES
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="vk-section vk-band">
        <div className="vk-container">
          <Reveal>
            <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr] lg:items-center lg:gap-10">
              <div>
                <span className="vk-pill mb-4">Hare Krishna Movement</span>
                <h1 className="vk-h1">Sri Govardhan Puja</h1>
                <p className="vk-lead mt-4 max-w-3xl md:!text-lg">
                  Celebrate the divine pastime of Lord Krishna&apos;s lifting of
                  Govardhan Hill — the day He taught the world that protecting the
                  sacred earth and its creatures pleases the Lord most. Offer sacred
                  sevas and receive the unlimited blessings of Govardhan at HKM
                  Vizag.
                </p>
                <p className="mt-5 max-w-3xl border-l-4 border-vk-300 pl-4 font-serif-display text-[15px] italic leading-7 text-vk-700 md:text-base">
                  &ldquo;Just as Govardhan Hill protects all who shelter at its
                  base, Lord Krishna protects every soul who takes shelter of Him.
                  Worship Govardhan — the very form of the Lord&apos;s protection.&rdquo;
                </p>
              </div>
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-vk-700 via-vk-600 to-vk-500 p-6 text-white shadow-[0_24px_50px_-24px_rgba(30,58,138,0.7)]">
                <div aria-hidden className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10" />
                <div className="relative flex items-start gap-3">
                  <span className="vk-icon-chip bg-white/15 text-[hsl(var(--gold))]">
                    <ShieldCheck className="h-5 w-5" />
                  </span>
                  <div>
                    <h2 className="text-lg font-bold text-white">
                      Offer Seva This Govardhan Puja
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-white/80">
                      Your offering sustains the sacred worship of Govardhan Hill,
                      the grand Annakoot feast, bhog preparations and every divine
                      ritual performed at ISKCON Gambheeram Visakhapatnam on this auspicious day.
                    </p>
                  </div>
                </div>
                <a
                  href="#offer-seva"
                  className="vk-btn-gold relative mt-5 h-12 w-full text-[15px] font-bold"
                >
                  Offer Seva
                </a>
              </div>
            </div>
          </Reveal>

          <div className="mt-8 grid grid-cols-2 gap-3 md:mt-10 md:grid-cols-4 md:gap-4">
            {TRUST_BADGES.map((b, i) => (
              <Reveal key={b.label} delay={reduce ? 0 : i * 0.05} className="h-full">
                <div className="vk-card flex h-full items-center gap-3 p-3.5 md:p-4">
                  <span className="vk-icon-chip h-10 w-10">
                    <b.icon className="h-5 w-5" />
                  </span>
                  <span className="text-[13px] font-semibold leading-snug text-ink md:text-sm">
                    {b.label}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          BANK TRANSFER + NOTE
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="vk-section">
        <div className="vk-container">
          <Reveal>
            <div className="vk-card mx-auto max-w-4xl p-5 md:p-8">
              <div className="flex items-center gap-3">
                <span className="vk-icon-chip">
                  <Landmark className="h-5 w-5" />
                </span>
                <h2 className="vk-h3">Donation Through Bank (NEFT / RTGS)</h2>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {[
                  { label: "Beneficiary Name", value: "HARE KRISHNA MOVEMENT INDIA" },
                  { label: "Bank Name", value: "IDFC FIRST BANK LTD" },
                  { label: "A/c No", value: "10091415313" },
                  { label: "IFSC Code", value: "IDFB0080412" },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="flex items-center justify-between gap-3 rounded-xl bg-vk-50 p-4 text-sm"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-muted-foreground">{label}</p>
                      <p className="mt-0.5 select-all break-words font-semibold text-ink">{value}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(value);
                        setCopiedField(label);
                        setTimeout(() => setCopiedField(null), 1500);
                      }}
                      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors hover:bg-white"
                      title={`Copy ${label}`}
                      aria-label={`Copy ${label}`}
                    >
                      {copiedField === label ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4 text-vk-400" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
              <p className="mt-5 rounded-xl border border-vk-100 bg-vk-50/60 px-4 py-3 text-sm leading-relaxed text-ink/80">
                While making UPI/Bank payments, please send a screenshot with your
                name, mobile, address and PAN details to our WhatsApp{" "}
                <a
                  className="font-semibold text-vk-700 underline-offset-2 hover:underline"
                  href="tel:+918977761187"
                >
                  +91 89777 61187
                </a>{" "}
                or email{" "}
                <a
                  className="font-semibold text-vk-700 underline-offset-2 hover:underline"
                  href="mailto:social@hkmvizag.org"
                >
                  social@hkmvizag.org
                </a>
                .
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          ABOUT GOVARDHAN PUJA
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="vk-section vk-band">
        <div className="vk-container">
          <SectionHeading
            eyebrow="The Divine Significance"
            title="Why Govardhan Puja Matters"
            align="center"
          />
          <Reveal className="mx-auto max-w-3xl">
            <div className="vk-card space-y-5 p-6 text-[15px] leading-relaxed text-ink/80 md:p-10 md:text-base">
              <p>
                Govardhan Puja commemorates the famous pastime in which Lord
                Krishna lifted Govardhan Hill on His little finger for seven
                days, sheltering the residents of Vrindavan from torrential rains
                sent by an angry Indra. He taught that worship of Govardhan — the
                sustainer of the cows, the forests and the community — and service
                to one&apos;s dependents is dearer to Him than proud sacrifices.
              </p>
              <p>
                On this blessed day, also called Annakoot, the Deities of Sri Sri
                Radha Madan Mohan are adorned in beautiful Alankar, and a grand
                mountain of vegetarian delicacies — a feast of devotion — is
                offered to the Lord and distributed to all as Maha Prasadam. The
                temple reverberates with kirtan and the chanting of the holy
                names.
              </p>
              <p>
                By offering seva on Govardhan Puja, you participate directly in
                these sacred ceremonies. Your Govardhan Seva honours the divine
                hill, your Annakoot Seva provides the mountain of food, your Bhog
                and Vaishnav Bhojan feed the hungry, your Alankar adorns the
                Lordships with beauty, and your Gau Seva pleases the Lord who is
                ever-protective of His cows. Every offering — no matter the
                amount — is received with love.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          DONOR PRIVILEGES
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="vk-section bg-gradient-navy">
        <div className="vk-container">
          <SectionHeading
            eyebrow="Our gratitude to every donor"
            title="Donor Privileges"
            align="center"
            light
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PRIVILEGES.map((p, i) => (
              <Reveal key={p.title} delay={reduce ? 0 : i * 0.06} className="h-full">
                <div className="h-full rounded-2xl border border-white/10 bg-white/5 p-5 md:p-6">
                  <span className="vk-icon-chip mb-4 bg-white/10 text-[hsl(var(--gold))]">
                    <p.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mb-2 text-base font-bold text-white">
                    {p.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-white/70">
                    {p.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-10 text-center">
            <a href="#offer-seva" className="vk-btn-gold h-12 px-8 text-[15px] font-bold">
              Donate Now
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          FAQS
      ═══════════════════════════════════════════════════════════════════ */}
      <FaqSection faqs={FAQS} tone="blue" />

      {/* ═══════════════════════════════════════════════════════════════════
          STATUS TOAST
      ═══════════════════════════════════════════════════════════════════ */}
      {status.message && !selected && (
        <div
          className={`fixed bottom-36 left-1/2 z-[120] w-max max-w-[calc(100%-2rem)] -translate-x-1/2 rounded-xl px-5 py-3 text-center text-sm font-semibold shadow-lift lg:bottom-6 ${
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
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-vk-900/60 backdrop-blur-sm sm:items-center sm:p-4">
          <div className="govardhan-form-scroll relative max-h-[92vh] w-full max-w-2xl overflow-x-hidden overflow-y-auto rounded-t-3xl bg-white shadow-[0_24px_60px_-28px_rgba(10,18,51,0.6)] sm:rounded-3xl">
            <style>{`
              .govardhan-form-scroll::-webkit-scrollbar { width: 6px; }
              .govardhan-form-scroll::-webkit-scrollbar-track { background: transparent; }
              .govardhan-form-scroll::-webkit-scrollbar-thumb { background: ${C.teal}; border-radius: 9999px; }
              .govardhan-form-scroll::-webkit-scrollbar-thumb:hover { background: ${C.deepGreen}; }
              .govardhan-form-scroll { scrollbar-width: thin; scrollbar-color: ${C.teal} transparent; }
            `}</style>

            <div className="relative z-10">
              {/* Sticky header */}
              <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-vk-100 bg-white/95 px-5 py-4 backdrop-blur md:px-6">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="vk-icon-chip text-2xl" aria-hidden>
                    {selected.seva.icon}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-vk-600">
                      Govardhan Puja Seva
                    </p>
                    <h2 className="vk-h3 !text-lg md:!text-xl">
                      {selected.seva.title}
                    </h2>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={closeCheckout}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-vk-200 bg-white text-vk-700 transition hover:bg-vk-50"
                  aria-label="Close checkout"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={submitDonation} className="space-y-5 p-5 md:p-6">
                {/* Summary */}
                <div className="grid gap-4 rounded-2xl bg-gradient-to-br from-vk-700 via-vk-600 to-vk-500 px-5 py-4 text-white sm:grid-cols-2">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/70">
                      Seva Name
                    </p>
                    <p className="mt-1 text-lg font-bold text-white">
                      {selected.seva.title}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/70">
                      Seva Amount
                    </p>
                    <p className="mt-1 font-heading text-2xl font-extrabold text-[hsl(var(--gold))]">
                      {selected.option.amount
                        ? `₹${formatAmount(selected.option.amount)}`
                        : "Enter amount below"}
                    </p>
                  </div>
                </div>

                {/* Custom amount */}
                {!selected.option.amount && (
                  <label className="block max-w-sm">
                    <span className="block text-[13px] font-semibold text-ink/80">
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
                      className={inputCls}
                    />
                    <span className="mt-1 block text-xs text-muted-foreground">
                      Amount must be at least Rs.100.
                    </span>
                  </label>
                )}

                {/* Donor fields */}
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className="block text-[13px] font-semibold text-ink/80">
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
                      className={inputCls}
                    />
                  </label>
                  <label className="block">
                    <span className="block text-[13px] font-semibold text-ink/80">
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
                      className={inputCls}
                    />
                  </label>
                  <label className="block md:col-span-2">
                    <span className="block text-[13px] font-semibold text-ink/80">
                      E-Mail ID (optional)
                    </span>
                    <Input
                      type="email"
                      value={form.donorEmail}
                      onChange={(e) =>
                        updateForm({ donorEmail: e.target.value.toLowerCase() })
                      }
                      placeholder="Your Email"
                      className={inputCls}
                    />
                  </label>
                </div>

                {lookupHint}

                <DonorExtrasFields
                  sevakName={form.sevakName}
                  dob={form.dob}
                  onSevakNameChange={(v) => updateForm({ sevakName: v })}
                  onDobChange={(v) => updateForm({ dob: v })}
                  collapsible
                />

                {/* Add-ons */}
                <div className="space-y-3">
                  {showPrasadamField && (
                    <label className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-vk-100 bg-vk-50/60 px-3.5 py-3 text-[13px] font-medium text-ink">
                      <input
                        type="checkbox"
                        checked={form.wantPrasadam}
                        onChange={(e) => {
                          const next = e.target.checked;
                          updateForm({ wantPrasadam: next });
                          handlePrasadamToggle(next);
                        }}
                        className="mt-0.5 h-4 w-4 shrink-0 accent-vk-700"
                      />
                      I would like to receive Maha Prasadam (Only within
                      India)
                    </label>
                  )}
                  {showTaxField && (
                    <label className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-vk-100 bg-vk-50/60 px-3.5 py-3 text-[13px] font-medium text-ink">
                      <input
                        type="checkbox"
                        checked={form.want80G}
                        onChange={(e) => {
                          const next = e.target.checked;
                          updateForm({ want80G: next });
                          handle80GToggle(next);
                        }}
                        className="mt-0.5 h-4 w-4 shrink-0 accent-vk-700"
                      />
                      <span>
                        I wish to receive 80G Tax Exemption
                        <span className="mt-1 block text-xs font-normal text-muted-foreground">
                          PAN and address are mandatory when 80G is selected.
                        </span>
                      </span>
                    </label>
                  )}
                </div>

                {form.want80G && (
                  <label className="block max-w-sm">
                    <span className="block text-[13px] font-semibold text-ink/80">
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
                      className={inputCls}
                    />
                  </label>
                )}

                {needsAddress && (
                  <div className="grid gap-4 rounded-2xl border border-vk-100 bg-vk-50/60 p-4 md:grid-cols-2">
                    <label className="block md:col-span-2">
                      <span className="block text-[13px] font-semibold text-ink/80">
                        Full Address *
                      </span>
                      <Input
                        value={form.address}
                        maxLength={80}
                        onChange={(e) =>
                          updateForm({ address: e.target.value })
                        }
                        placeholder="Door No, Street, Area"
                        className={inputCls}
                      />
                    </label>
                    <label className="block">
                      <span className="block text-[13px] font-semibold text-ink/80">
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
                        className={inputCls}
                      />
                    </label>
                    <label className="block">
                      <span className="block text-[13px] font-semibold text-ink/80">
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
                        className={inputCls}
                      />
                    </label>
                    <label className="block">
                      <span className="block text-[13px] font-semibold text-ink/80">
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
                        className={inputCls}
                      />
                    </label>
                  </div>
                )}

                {status.type === "error" && (
                  <p className="rounded-xl bg-red-50 px-3.5 py-2.5 text-[13px] font-medium text-red-700">
                    {status.message}
                  </p>
                )}

                <div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="vk-btn-gold h-12 w-full text-[15px] font-bold"
                  >
                    <Heart className="h-4 w-4 fill-current" />
                    {submitting
                      ? "Opening Checkout..."
                      : `Donate Rs. ${formatAmount(finalAmount || 0)}`}
                  </button>
                  <div className="mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <ShieldCheck className="h-3.5 w-3.5 text-vk-500" />
                      Secure Razorpay Checkout
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-vk-500" />
                      Instant Confirmation
                    </span>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          STICKY MOBILE DONATE BAR (sits above the site's mobile bottom nav,
          leaving room for the WhatsApp button on the right)
      ═══════════════════════════════════════════════════════════════════ */}
      {!selected && (
        <div className="fixed bottom-[calc(var(--bottom-nav-space)+4px+env(safe-area-inset-bottom))] left-3 right-[76px] z-40 lg:hidden">
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-vk-100 bg-white/95 p-2 pl-4 shadow-lift backdrop-blur">
            <span className="min-w-0 text-[13px] font-semibold leading-tight text-ink">
              Govardhan Puja Sevas
            </span>
            <a href="#offer-seva" className="vk-btn-gold h-11 shrink-0 px-5">
              <Heart className="h-4 w-4 fill-current" />
              Donate Now
            </a>
          </div>
        </div>
      )}
    </main>
    </PageLayout>
  );
}
