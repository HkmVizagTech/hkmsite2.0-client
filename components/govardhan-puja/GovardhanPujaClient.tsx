"use client";

import { cleanMobile } from "@/lib/phone";
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
import PhonePeUpiCard from "@/components/PhonePeUpiCard";
import {
  newEventId,
  getMetaBrowserData,
  trackInitiateCheckout,
  trackPurchase,
} from "@/lib/metaPixel";
import { useUpiFallback } from "@/components/UpiFallbackDialog";
import { prefillEmail } from "@/lib/razorpayPrefill";

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
  dedicationOccasion: string;
  dedicationNote: string;
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
    image: "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1793711352183-govardhan-seva.webp",
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
    image: "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1790144104776-1790144104666-sadhuBhojan.webp",
    options: [
      { legacySevaId: 3450, label: "Donate Rs. 7,777", amount: 7777 },
      { legacySevaId: 3451, label: "Donate Rs. 5,555", amount: 5555 },
      { legacySevaId: 3452, label: "Donate Rs. 3,100", amount: 3100 },
      { legacySevaId: 3453, label: "Donate Rs. 1,500", amount: 1500 },
      { legacySevaId: 3454, label: "Donate Any Other Amount", amount: null },
    ],
  },
];

const GOVARDHAN_DATE_ISO = "2026-11-10";
const GOVARDHAN_DATE_LABEL = "10 November 2026";
const istDate = (d: Date) => d.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
const dayDiff = (a: string, b: string) => Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / 86_400_000);

const SEVA_TAGLINES: Record<string, string> = {
  govardhan: "Worship the sacred hill",
  "gau-seva": "Serve the cows Krishna loves",
  bhog: "Food offered to the Lord",
  alankar: "Flowers for Their Lordships",
  annakoot: "The mountain of food",
  "vaishnav-bhojan": "Feed every devotee",
};

const STORY = [
  { n: "1", title: "Indra's pride", text: "The people of Vrindavan were preparing a great sacrifice for Indra. Krishna asked them to worship Govardhan Hill instead, which fed their cows and gave them forests, water and grass." },
  { n: "2", title: "The storm", text: "Angered, Indra sent torrential rain over Vraja. The people and their cows ran to Krishna for shelter." },
  { n: "3", title: "Krishna lifts Govardhan", text: "Krishna lifted Govardhan Hill on the little finger of His left hand and held it for seven days, sheltering everyone beneath it." },
  { n: "4", title: "Annakoot", text: "Indra bowed down and the rains stopped. Each year devotees remember this day by offering Annakoot, a mountain of vegetarian dishes, and sharing it as Maha Prasadam." },
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
  dedicationOccasion: "",
  dedicationNote: "",
};

const apiBase = () =>
  (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080").replace(
    /\/+$/,
    ""
  );
const formatAmount = (amount: number) => amount.toLocaleString("en-IN");

// Shared field styling for the checkout modal inputs (merged over ui/Input defaults).
const inputCls =
  "mt-1.5 h-12 rounded-xl border-vk-200 text-base focus-visible:border-vk-500 focus-visible:ring-vk-500/20 focus-visible:ring-offset-0 md:text-[15px]";

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
  // Land on the seva cards. The banner and hero photos load after first paint and push the cards down, so the scroll is repeated
  // as they load, and stops as soon as the visitor scrolls, touches or presses a key. A ?seva= link goes to its own card instead.
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("seva")) return;
    let stopped = false;
    const go = () => {
      if (stopped) return;
      document.getElementById("offer-seva")?.scrollIntoView({ behavior: "auto", block: "start" });
    };
    const stop = () => {
      stopped = true;
    };
    const events = ["wheel", "touchstart", "keydown", "mousedown"] as const;
    events.forEach((e) => window.addEventListener(e, stop, { passive: true, once: true }));
    const timers = [300, 900, 1800].map((ms) => window.setTimeout(go, ms));
    window.addEventListener("load", go, { once: true });
    return () => {
      timers.forEach(window.clearTimeout);
      window.removeEventListener("load", go);
      events.forEach((e) => window.removeEventListener(e, stop));
    };
  }, []);

  const [selected, setSelected] = useState<SelectedOffering | null>(null);
  const [form, setForm] = useState<CheckoutForm>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error" | "idle";
    message: string;
  }>({ type: "idle", message: "" });
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [highlightedSlug, setHighlightedSlug] = useState<string | null>(null);
  const [daysLeft, setDaysLeft] = useState<number | null>(null);
  const [pastHero, setPastHero] = useState(false);
  const [hideBar, setHideBar] = useState(false);

  // Days to Govardhan Puja, worked out after mount so the server and the first client render agree.
  useEffect(() => {
    setDaysLeft(dayDiff(istDate(new Date()), GOVARDHAN_DATE_ISO));
  }, []);

  // The floating "Offer Seva" bar appears after the banner and hides while a donation section is on screen.
  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.7);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const targets = ["offer-seva", "finale"].map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const visible = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? visible.add(e.target.id) : visible.delete(e.target.id)));
        setHideBar(visible.size > 0);
      },
      { threshold: 0.12 }
    );
    targets.forEach((el) => io.observe(el));
    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  const countdown =
    daysLeft === null ? null : daysLeft > 1 ? `${daysLeft} days to go` : daysLeft === 1 ? "Tomorrow" : daysLeft === 0 ? "Today" : null;

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
          // `dob` stays a real date of birth only; the date for any other occasion travels as dedicationDate.
          dob: form.dedicationOccasion === "birthday" ? form.dob || undefined : undefined,
          dedicationOccasion: form.dedicationOccasion || undefined,
          dedicationNote: form.dedicationOccasion === "other" ? form.dedicationNote.trim() || undefined : undefined,
          dedicationDate: form.dedicationOccasion ? form.dob || undefined : undefined,
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
          email: prefillEmail(form.donorEmail),
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
      <main className="min-h-screen overflow-x-clip bg-white pt-[var(--header-h)] text-ink">
        <WhatsAppFloatButton />

      {/* ══ BANNER ═════════════════════════════════════════════════════ */}
      <section className="bg-vk-900">
        <h1 className="sr-only">Sri Govardhan Puja, {GOVARDHAN_DATE_LABEL}</h1>
        <a href="#offer-seva" className="block" aria-label="Offer Your Seva">
          <picture>
            <source media="(max-width: 640px)" srcSet={MOBILE_BANNER} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={DESKTOP_BANNER}
              alt="Sri Govardhan Puja celebrations at Hare Krishna Movement Vizag"
              fetchPriority="high"
              className="block h-auto w-full"
            />
          </picture>
        </a>
      </section>

      {/* ══ THE HILL — text on the left, a photo collage on the right ═══ */}
      <section className="bg-white px-3 pb-2 pt-8 sm:px-5 md:pt-14 xl:px-8">
      <div className="relative isolate mx-auto max-w-[88rem] overflow-hidden rounded-[2rem] bg-[linear-gradient(160deg,#0b1745_0%,#15308a_55%,#2b52c9_100%)] text-white shadow-[0_40px_80px_-40px_rgba(15,31,92,0.85)] md:rounded-[2.75rem]">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 opacity-[0.07] [background-image:radial-gradient(#fff_1.2px,transparent_1.2px)] [background-size:26px_26px]"
        />
        <div aria-hidden className="absolute -left-24 top-10 -z-10 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(120,160,255,0.35),transparent_70%)]" />
        <div aria-hidden className="absolute -right-20 bottom-24 -z-10 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(255,214,120,0.22),transparent_70%)]" />
        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 px-5 pb-20 pt-10 md:px-12 md:pb-32 md:pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div className="text-center lg:text-left">
            <p className="inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#BFD0FF] md:text-xs">
              Annakoot · {GOVARDHAN_DATE_LABEL}
            </p>
            <h2 className="mt-4 font-heading text-[2.4rem] font-bold leading-[1.08] sm:text-5xl xl:text-[3.6rem]">
              The Hill That Krishna <span className="text-[hsl(var(--gold))]">Lifted</span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-white/80 md:text-lg md:leading-8 lg:mx-0">
              On Govardhan Puja we worship the hill that feeds the cows of Vraja, offer Annakoot, a mountain of food, to the Lord, and
              share it as Maha Prasadam. Take part with a seva at Hare Krishna Vaikuntham, Gambheeram.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <a href="#offer-seva" className="vk-btn-gold h-[3.25rem] px-8 text-base font-bold">
                Offer Your Seva <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#story"
                className="inline-flex h-[3.25rem] items-center rounded-full border border-white/30 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Read the pastime
              </a>
            </div>
            <ul className="mt-6 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
              {["Sankalpa in your name", "80G eligible", "Maha Prasadam"].map((x) => (
                <li key={x} className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/90 ring-1 ring-white/20">
                  <Check className="h-3.5 w-3.5 text-[hsl(var(--gold))]" /> {x}
                </li>
              ))}
            </ul>
            {countdown && (
              <div className="mt-6 inline-flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 ring-1 ring-white/20 backdrop-blur">
                <span className="font-heading text-3xl font-extrabold leading-none text-[hsl(var(--gold))]">
                  {daysLeft !== null && daysLeft > 1 ? daysLeft : daysLeft === 1 ? "1" : "0"}
                </span>
                <span className="text-left text-xs font-semibold uppercase leading-tight tracking-[0.14em] text-white/80">
                  {daysLeft !== null && daysLeft > 1 ? "days to" : daysLeft === 1 ? "day to" : "it is"}
                  <br />
                  {daysLeft === 0 ? "today" : "Govardhan Puja"}
                </span>
              </div>
            )}
          </div>

          {/* Photo collage */}
          <div className="relative mx-auto w-full max-w-[34rem] pb-10 sm:pb-12">
            <div className="relative aspect-[5/4] overflow-hidden rounded-[2rem] shadow-[0_40px_70px_-30px_rgba(0,0,0,0.7)] ring-4 ring-white/25">
              <Image src={sevas[0].image} alt="Govardhan Hill worship" fill unoptimized priority sizes="(max-width: 1024px) 90vw, 540px" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b1745]/55 via-transparent to-transparent" />
              <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-vk-800">Govardhan Puja</span>
            </div>
            <div className="absolute -bottom-0 -left-2 w-[40%] rotate-[-4deg] overflow-hidden rounded-2xl shadow-[0_24px_44px_-20px_rgba(0,0,0,0.7)] ring-4 ring-white sm:-left-6">
              <div className="relative aspect-[4/3]">
                <Image src={sevas[4].image} alt="Annakoot, the mountain of food" fill unoptimized sizes="220px" className="object-cover" />
              </div>
              <p className="bg-white px-3 py-1.5 text-center text-[11px] font-bold uppercase tracking-wider text-vk-800">Annakoot</p>
            </div>
            <div className="absolute -bottom-2 -right-2 w-[36%] rotate-[3deg] overflow-hidden rounded-2xl shadow-[0_24px_44px_-20px_rgba(0,0,0,0.7)] ring-4 ring-white sm:-right-5">
              <div className="relative aspect-[4/3]">
                <Image src={sevas[1].image} alt="Cows at the goshala" fill unoptimized sizes="200px" className="object-cover" />
              </div>
              <p className="bg-white px-3 py-1.5 text-center text-[11px] font-bold uppercase tracking-wider text-vk-800">Gau Puja</p>
            </div>
          </div>
        </div>
        <svg aria-hidden viewBox="0 0 1440 160" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-16 w-full md:h-24">
          <path d="M0 110 C 240 40, 420 40, 700 95 S 1200 150, 1440 70 V160 H0Z" fill="#ffffff" fillOpacity="0.18" />
          <path d="M0 135 C 260 80, 520 80, 760 125 S 1220 160, 1440 110 V160 H0Z" fill="#ffffff" fillOpacity="0.35" />
        </svg>
      </div>
      </section>

      {/* ══ SEVAS ══════════════════════════════════════════════════════ */}
      <section id="offer-seva" className="vk-section scroll-mt-16 !pt-4 md:!pt-6">
        <div className="vk-container">
          <Reveal>
            <SectionHeading
              eyebrow="Choose Your Offering"
              title="Govardhan Puja Sevas"
              subtitle="Pick a seva and an amount. Sankalpa is taken in your name and your receipt reaches you as soon as the payment is confirmed."
              align="center"
            />
          </Reveal>

          {/* Featured seva: Govardhan Seva */}
          {(() => {
            const seva = sevas[0];
            const amounts = seva.options.filter((o) => o.amount != null);
            const custom = seva.options.find((o) => !o.amount) || seva.options[seva.options.length - 1];
            return (
              <Reveal>
                <article
                  id={`seva-card-${seva.slug}`}
                  className={`grid scroll-mt-24 overflow-hidden rounded-[2rem] bg-white text-ink shadow-[0_30px_64px_-34px_rgba(30,58,138,0.6)] ring-1 ring-vk-100 lg:grid-cols-[1.05fr_1fr] ${
                    highlightedSlug === seva.slug ? "ring-4 ring-[hsl(var(--gold))]" : ""
                  }`}
                >
                  <div className="relative aspect-[4/3] bg-vk-900 lg:aspect-auto lg:min-h-[26rem]">
                    <Image src={seva.image} alt={seva.title} fill unoptimized sizes="(max-width: 1024px) 100vw, 55vw" className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b1745]/40 via-transparent to-transparent" />
                    <span className="absolute left-4 top-4 rounded-full bg-[hsl(var(--gold))] px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-ink shadow">
                      Most dear to the Lord
                    </span>
                  </div>
                  <div className="flex flex-col justify-center p-6 md:p-10">
                    <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-vk-500">{SEVA_TAGLINES[seva.slug]}</p>
                    <h3 className="mt-2 font-heading text-3xl text-ink font-bold leading-tight md:text-4xl">{seva.title}</h3>
                    <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground md:text-base">{seva.description}</p>
                    <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-vk-600">Choose an amount</p>
                    <div className="mt-3 grid grid-cols-2 gap-3">
                      {amounts.map((o, i) => (
                        <button
                          key={o.legacySevaId}
                          type="button"
                          onClick={() => openCheckout(seva, o)}
                          className={`flex min-h-[3.4rem] items-center justify-between rounded-2xl px-4 text-left font-heading text-xl font-extrabold transition-all hover:-translate-y-0.5 ${
                            i === 0
                              ? "bg-gradient-to-r from-[#F6C752] to-[#E0A92B] text-ink shadow-[0_14px_28px_-14px_rgba(246,199,82,0.9)]"
                              : "bg-vk-50 text-vk-800 ring-1 ring-vk-200 hover:bg-vk-700 hover:text-white hover:ring-vk-700"
                          }`}
                        >
                          ₹{formatAmount(o.amount as number)}
                          <ArrowRight className="h-4 w-4 opacity-70" />
                        </button>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => openCheckout(seva, custom)}
                      className="mt-3 inline-flex min-h-[3rem] items-center justify-center gap-2 rounded-2xl border border-dashed border-vk-300 text-sm font-bold text-vk-700 transition-colors hover:bg-vk-50"
                    >
                      <Plus className="h-4 w-4" /> Donate any other amount
                    </button>
                  </div>
                </article>
              </Reveal>
            );
          })()}

          {/* The other sevas */}
          <p className="mt-8 flex items-center justify-between px-1 text-xs font-bold uppercase tracking-[0.16em] text-vk-600 sm:hidden">
            More sevas <span className="inline-flex items-center gap-1 font-semibold normal-case tracking-normal text-muted-foreground">Swipe <ArrowRight className="h-3.5 w-3.5" /></span>
          </p>
          <div className="-mx-4 mt-3 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 [scrollbar-width:none] sm:mx-0 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3 lg:gap-6 [&::-webkit-scrollbar]:hidden">
            {sevas.slice(1).map((seva, idx) => {
              const amounts = seva.options.filter((o) => o.amount != null).slice(0, 4);
              const custom = seva.options.find((o) => !o.amount) || seva.options[seva.options.length - 1];
              const highlighted = highlightedSlug === seva.slug;
              return (
                <Reveal key={seva.slug} delay={reduce ? 0 : (idx % 3) * 0.06} className="h-auto w-[82%] shrink-0 snap-center sm:h-full sm:w-auto">
                  <article
                    id={`seva-card-${seva.slug}`}
                    className={`group flex h-full scroll-mt-24 flex-col overflow-hidden rounded-3xl bg-white shadow-[0_20px_44px_-28px_rgba(30,58,138,0.55)] ring-1 ring-vk-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_56px_-26px_rgba(30,58,138,0.7)] ${
                      highlighted ? "ring-2 ring-vk-500" : ""
                    }`}
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-vk-900">
                      <Image
                        src={seva.image}
                        alt={seva.title}
                        fill
                        unoptimized
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0b1745]/85 via-[#0b1745]/20 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 flex items-end gap-3 p-4">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/95 text-xl shadow-md" aria-hidden>
                          {seva.icon}
                        </span>
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#BFD0FF]">{SEVA_TAGLINES[seva.slug]}</p>
                          <h3 className="font-heading text-lg font-bold leading-tight text-white md:text-xl">{seva.title}</h3>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <p className="line-clamp-3 text-[13px] leading-relaxed text-muted-foreground md:text-sm">{seva.description}</p>
                      <div className="mt-auto pt-5">
                        <div className="grid grid-cols-2 gap-2">
                          {amounts.map((o, i) => (
                            <button
                              key={o.legacySevaId}
                              type="button"
                              onClick={() => openCheckout(seva, o)}
                              className={`min-h-[44px] rounded-xl px-3 text-[15px] font-extrabold transition-all ${
                                i === 0
                                  ? "bg-gradient-to-r from-[#F6C752] to-[#E0A92B] text-ink shadow-sm hover:shadow-md"
                                  : "bg-vk-50 text-vk-800 ring-1 ring-vk-200 hover:bg-vk-700 hover:text-white hover:ring-vk-700"
                              }`}
                            >
                              ₹{formatAmount(o.amount as number)}
                            </button>
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={() => openCheckout(seva, custom)}
                          className="mt-2 inline-flex min-h-[40px] w-full items-center justify-center gap-1.5 rounded-xl text-sm font-semibold text-vk-700 hover:bg-vk-50"
                        >
                          <Plus className="h-4 w-4" /> Other amount
                        </button>
                      </div>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
          <p className="mt-8 text-center text-xs text-muted-foreground">
            80G Tax Exemption available · Secured by Razorpay · Donations go to Hare Krishna Movement India, Visakhapatnam
          </p>
        </div>
      </section>

      {/* Direct PhonePe / UPI payment, for donors who can't use Razorpay */}
      <PhonePeUpiCard campaign="Govardhan Puja" />

      {/* ══ TRUST ══════════════════════════════════════════════════════ */}
      <section className="vk-section !pb-2 !pt-6">
        <div className="vk-container">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {TRUST_BADGES.map((b, i) => (
              <Reveal key={b.label} delay={reduce ? 0 : i * 0.05} className="h-full">
                <div className="vk-card flex h-full items-center gap-3 p-3.5 md:p-4">
                  <span className="vk-icon-chip h-10 w-10">
                    <b.icon className="h-5 w-5" />
                  </span>
                  <span className="text-[13px] font-semibold leading-snug text-ink md:text-sm">{b.label}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ THE PASTIME — four chapters ════════════════════════════════ */}
      <section id="story" className="vk-section vk-band scroll-mt-20">
        <div className="vk-container">
          <Reveal>
            <SectionHeading eyebrow="The divine pastime" title="Why We Worship Govardhan" align="center" />
          </Reveal>
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            {STORY.map((s, i) => (
              <Reveal as="li" key={s.n} delay={reduce ? 0 : i * 0.06} className="h-full">
                <div className="relative h-full overflow-hidden rounded-3xl bg-white p-6 ring-1 ring-vk-100">
                  <span aria-hidden className="absolute -right-2 -top-4 font-heading text-[5.5rem] font-extrabold leading-none text-vk-100">
                    {s.n}
                  </span>
                  <h3 className="relative font-heading text-lg font-bold text-vk-800">{s.title}</h3>
                  <p className="relative mt-2 text-[14px] leading-relaxed text-muted-foreground">{s.text}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ══ FINAL CALL + BANK ══════════════════════════════════════════ */}
      <section id="finale" className="vk-section scroll-mt-16">
        <div className="vk-container">
          <Reveal>
            <div className="relative overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,#0f1f5c_0%,#1c3a9e_60%,#2f5bd3_100%)] px-6 py-10 text-center text-white md:px-12 md:py-14">
              <div aria-hidden className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10" />
              <div aria-hidden className="absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-white/5" />
              <h2 className="relative mx-auto max-w-2xl font-heading text-[1.9rem] font-bold leading-tight md:text-4xl">
                Offer a seva, and take shelter of <span className="text-[hsl(var(--gold))]">Govardhan</span>
              </h2>
              <p className="relative mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-white/80 md:text-base">
                Every offering, whatever the amount, is received with love, with sankalpa in your name.
              </p>
              <a href="#offer-seva" className="vk-btn-gold relative mt-7 h-[3.25rem] px-8 text-base font-bold">
                <Heart className="h-4 w-4" /> Offer Your Seva
              </a>
            </div>
          </Reveal>

          <div className="mx-auto mt-10 grid max-w-6xl gap-5 lg:grid-cols-2 lg:items-start">
            <div className="rounded-2xl border border-vk-100 bg-vk-50 px-5 py-4 text-sm leading-7 text-ink/80 md:text-base">
              While making UPI/Bank payments, please send a screenshot with your name, mobile, address and PAN details to our WhatsApp{" "}
              <a className="font-bold text-vk-700 hover:text-vk-500" href="tel:+918977761187">
                +91 89777 61187
              </a>{" "}
              or email{" "}
              <a className="break-all font-bold text-vk-700 hover:text-vk-500" href="mailto:social@hkmvizag.org">
                social@hkmvizag.org
              </a>
              , so your receipt is issued against the right donor.
            </div>
            <div className="vk-card p-5 md:p-7">
              <div className="flex items-center gap-3">
                <span className="vk-icon-chip">
                  <Landmark className="h-5 w-5" />
                </span>
                <h2 className="vk-h3">Donation Through Bank (NEFT / RTGS)</h2>
              </div>
              <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                {[
                  { label: "Beneficiary Name", value: "HARE KRISHNA MOVEMENT INDIA" },
                  { label: "Bank Name", value: "IDFC FIRST BANK LTD" },
                  { label: "A/c No", value: "10091415313" },
                  { label: "IFSC Code", value: "IDFB0080412" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between gap-3 rounded-xl bg-vk-50 p-4 text-sm">
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
                      {copiedField === label ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4 text-vk-400" />}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
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
          <div className="govardhan-form-scroll relative max-h-[94dvh] w-full max-w-2xl overflow-x-hidden overflow-y-auto overscroll-contain rounded-t-[1.75rem] bg-white shadow-[0_24px_60px_-28px_rgba(10,18,51,0.6)] sm:rounded-3xl">
            <style>{`
              .govardhan-form-scroll::-webkit-scrollbar { width: 6px; }
              .govardhan-form-scroll::-webkit-scrollbar-track { background: transparent; }
              .govardhan-form-scroll::-webkit-scrollbar-thumb { background: ${C.teal}; border-radius: 9999px; }
              .govardhan-form-scroll::-webkit-scrollbar-thumb:hover { background: ${C.deepGreen}; }
              .govardhan-form-scroll { scrollbar-width: thin; scrollbar-color: ${C.teal} transparent; }
            `}</style>

            <div className="relative z-10">
              {/* Floating close button (stays in view while the form scrolls) */}
              <div className="sticky top-0 z-20 h-0">
                <button
                  type="button"
                  onClick={closeCheckout}
                  className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-vk-800 shadow-md ring-1 ring-black/5 transition hover:bg-white"
                  aria-label="Close checkout"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Photo: clear and uncovered, so the seva can be seen */}
              <div className="relative h-44 overflow-hidden bg-vk-900 sm:h-56 [@media(max-height:700px)]:h-28">
                <span aria-hidden className="absolute left-1/2 top-2 z-10 h-1.5 w-10 -translate-x-1/2 rounded-full bg-white/80 shadow sm:hidden" />
                <Image src={selected.seva.image} alt={selected.seva.title} fill unoptimized sizes="672px" className="object-cover object-center" />
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/30 to-transparent" />
              </div>

              {/* Seva name and the amount chosen */}
              <div className="relative z-10 -mt-8 flex items-start justify-between gap-3 px-5 pb-1 md:px-6">
                <div className="flex min-w-0 items-start gap-3">
                  <span className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-3xl shadow-lg ring-4 ring-white" aria-hidden>
                    {selected.seva.icon}
                  </span>
                  <div className="min-w-0 pt-10">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-vk-500">Govardhan Puja Seva</p>
                    <h2 className="font-heading text-xl font-bold leading-tight text-ink md:text-2xl">{selected.seva.title}</h2>
                  </div>
                </div>
                <div className="shrink-0 rounded-2xl bg-gradient-to-r from-[#F6C752] to-[#E0A92B] px-3.5 py-2 text-right shadow-lg ring-4 ring-white">
                  <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-ink/70">Your seva</p>
                  <p className="font-heading text-lg font-extrabold leading-tight text-ink">{finalAmount ? `₹${formatAmount(finalAmount)}` : "₹ —"}</p>
                </div>
              </div>

              <form onSubmit={submitDonation} className="space-y-5 p-5 md:p-6">
                {/* Amount: switch between the seva's amounts, or type your own */}
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-vk-600">Choose an amount</p>
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {selected.seva.options.map((o) => {
                      const active = o.legacySevaId === selected.option.legacySevaId;
                      return (
                        <button
                          key={o.legacySevaId}
                          type="button"
                          onClick={() => {
                            setSelected({ seva: selected.seva, option: o });
                            updateForm({ customAmount: "", want80G: false, wantPrasadam: false });
                          }}
                          className={`min-h-[44px] rounded-full px-4 text-sm font-bold transition-all ${
                            active
                              ? "bg-vk-700 text-white shadow-md ring-1 ring-vk-700"
                              : "bg-vk-50 text-vk-800 ring-1 ring-vk-200 hover:bg-vk-100"
                          }`}
                        >
                          {o.amount ? `₹${formatAmount(o.amount)}` : "Other"}
                        </button>
                      );
                    })}
                  </div>
                  {!selected.option.amount && (
                    <label className="mt-3 block">
                      <span className="relative block">
                        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-heading text-lg font-bold text-vk-700">₹</span>
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
                          placeholder="Enter your amount"
                          className={`${inputCls} !h-14 pl-9 text-lg font-semibold`}
                          autoFocus
                        />
                      </span>
                      <span className="mt-1 block text-xs text-muted-foreground">Amount must be at least Rs.100.</span>
                    </label>
                  )}
                </div>

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
                          donorMobile: cleanMobile(e.target.value),
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
                  occasion={form.dedicationOccasion}
                  occasionNote={form.dedicationNote}
                  onOccasionChange={(v) => updateForm({ dedicationOccasion: v })}
                  onOccasionNoteChange={(v) => updateForm({ dedicationNote: v })}
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

                <div className="sticky bottom-0 z-10 -mx-5 -mb-5 border-t border-vk-100 bg-white/95 px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur md:-mx-6 md:-mb-6 md:px-6">
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
      {!selected && pastHero && !hideBar && (
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
