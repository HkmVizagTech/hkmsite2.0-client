"use client";

import { useState, useRef, useEffect } from "react";
import { useAttribution } from "@/lib/useAttribution";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Loader2, ShieldCheck, User, Phone, Mail, Check, Copy, CheckCircle2,
  UtensilsCrossed, Sparkles, FileCheck2, Landmark,
  ChevronDown, ChevronLeft, ChevronRight, Heart,
} from "lucide-react";
import PageLayout from "@/components/PageLayout";
import SectionHeading from "@/components/site/SectionHeading";
import DonorPrivilegesSection from "@/components/sqft-campaign/DonorPrivilegesSection";
import ImportanceSection from "@/components/sqft-campaign/ImportanceSection";
import FaqSection from "@/components/sqft-campaign/FaqSection";
import FounderSection from "@/components/sqft-campaign/FounderSection";
import AddressForm from "@/components/AddressForm";
import type { PrasadamAddress } from "@/components/AddressForm";
import DonorExtrasFields from "@/components/DonorExtrasFields";
import { useDonorPrefill } from "@/lib/donorPrefill";
import WhatsAppFloatButton from "@/components/WhatsAppFloatButton";
import { useRazorpayPreload } from "@/lib/useRazorpayPreload";
import { useScrollToDonate } from "@/lib/useScrollToDonate";
import { newEventId, getMetaBrowserData, trackPurchase } from "@/lib/metaPixel";
import { type CampaignConfig } from "@/lib/campaignConfig";

type RazorpayConstructor = new (options: Record<string, unknown>) => { open: () => void };

const apiBase = () =>
  (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080").replace(/\/+$/, "");

/* ------------------------------------------------------------------ */
/* Config                                                              */
/* ------------------------------------------------------------------ */

const VASTRA_CONFIG: CampaignConfig = {
  type: "SQFT",
  pageTitle: "Vastra & Alankara Seva",
  metaTitle: "Vastra & Alankara Seva | Hare Krishna Vaikuntham Temple, Visakhapatnam",
  metaDesc:
    "Offer beautiful garments and ornaments to Sri Sri Radha Madan Mohan. Sponsor daily vastra, festival alankara sets, and more — every offering adorns the Lord with love.",
  ogTitle: "Vastra & Alankara Seva — Hare Krishna Vaikuntham Temple",
  ogDesc:
    "Dress the Lord in splendour. Sponsor vastra and alankara seva for Sri Sri Radha Madan Mohan at the Hare Krishna Vaikuntham Temple.",
  ogImage: "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1783677419371-1783677418690-DietyPhotos.jpeg",
  pricePerUnit: 501,
  unitName: "vastra offering",
  unitNamePlural: "vastra offerings",
  unitShort: "offering",
  minCustomAmount: 101,
  phone: "+91 89777 61187",
  phoneHref: "tel:+918977761187",
  email: "social@hkmvizag.org",
  heroImage: "https://res.cloudinary.com/ddmzeqpkc/image/upload/v1784790674/vastra_bg.webp",
  bannerImage: "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1785573838202-1785573837372-ChatGPTImageAug12026021301PM.webp",
  bannerImageMobile: "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1785580143643-1785580142535-vastraheromob.webp",
  aboutImage: "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1783677419371-1783677418690-DietyPhotos.jpeg",
  heroTagline: "A seva initiative of Hare Krishna Movement Visakhapatnam",
  heroHeading1: "Vastra & Alankara",
  heroHeading2: "Seva",
  heroDesc:
    "Sri Sri Radha Madan Mohan are dressed and decorated fresh each day with exquisite garments and ornaments. Your offering sustains this beautiful daily service to Their Lordships.",
  formHeading: "Offer Your Seva",
  formSubheading:
    "Every garment and ornament you sponsor is offered directly to Their Lordships with love and devotion.",
  privileges: [
    { icon: UtensilsCrossed, title: "Sanctified Prasadam", text: "Receive the Lord's prasadam from the temple as a blessing for your seva (within India)." },
    { icon: Sparkles, title: "Sankalpa & Aarti", text: "Your name is included in the sankalpa and offered during aarti to Their Lordships." },
    { icon: FileCheck2, title: "Contribution Certificate", text: "A digital certificate honouring your valued offering to the temple." },
    { icon: Landmark, title: "80G Tax Exemption", text: "Donations qualify for tax exemption under Section 80G of the Income Tax Act." },
  ],
  higherPrivileges: [],
  statsApiEndpoint: "",
  orderType: "GDGD",
};

const TIERS = [
  { label: "Daily Vastra", amount: 501, description: "Sponsor the daily garment offering to Their Lordships" },
  { label: "Festival Vastra", amount: 2100, description: "Special garments for festival days and celebrations" },
  { label: "Alankara Set", amount: 5100, description: "Complete ornament set for a special occasion" },
  { label: "Full Month", amount: 11000, description: "Sponsor vastra and alankara for an entire month" },
];

const FAQS = [
  {
    q: "What is Vastra & Alankara Seva?",
    a: "Vastra & Alankara Seva is an opportunity to offer beautiful garments (vastra) and ornaments (alankara) to Sri Sri Radha Madan Mohan at the Hare Krishna Vaikuntham Temple. The Deities are dressed and decorated fresh each day, and your offering sustains this loving daily service.",
  },
  {
    q: "How is my offering used?",
    a: "Your donation directly funds the purchase of silk and cotton garments, flower garlands, jewellery, crowns, and other decorative items used to adorn the Deities each day. Every piece is selected with care and devotion.",
  },
  {
    q: "Can I sponsor vastra for a specific occasion?",
    a: "Yes! You can sponsor vastra and alankara for birthdays, anniversaries, festivals, or any auspicious day of your choice. Simply mention your preferred date in the notes during checkout and our team will ensure your offering is presented on that day.",
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
  {
    q: "Who are Sri Sri Radha Madan Mohan?",
    a: "Sri Sri Radha Madan Mohan are the presiding Deities of the Hare Krishna Vaikuntham Temple — Sri Krishna as Madan Mohan (the enchanter of Cupid) accompanied by Srimati Radharani, the embodiment of devotional love.",
  },
];

/* ------------------------------------------------------------------ */
/* Deity Photos — placeholder grid (replace src with actual images)    */
/* ------------------------------------------------------------------ */

const CLOUDINARY_BASE = "https://res.cloudinary.com/ddmzeqpkc/image/upload";

const DEITY_PHOTOS = [
  { src: `${CLOUDINARY_BASE}/v1784789161/754143185_18106079012124140_9218277978867266627_n_lud7kh.jpg`, caption: "Sri Sri Radha Madan Mohan — Morning Alankara" },
  { src: `${CLOUDINARY_BASE}/v1784789161/753540731_18106079036124140_6341094363808357522_n_jur5s8.jpg`, caption: "Divine Decorations" },
  { src: `${CLOUDINARY_BASE}/v1784789161/754143185_18105975167124140_1533039680985463931_n_lxlknf.jpg`, caption: "Festival Alankara" },
  { src: `${CLOUDINARY_BASE}/v1784789161/752242324_18105867767124140_2506812192966184656_n_r9bky2.jpg`, caption: "Ornamented with Devotion" },
  { src: `${CLOUDINARY_BASE}/v1784789160/714829441_18101119055124140_1555886520572389363_n_el0ck2.jpg`, caption: "Vastra Offering" },
  { src: `${CLOUDINARY_BASE}/v1784789160/730941493_18103255847124140_3537967313260341021_n_nqj31m.jpg`, caption: "Floral Garlands & Jewellery" },
  { src: `${CLOUDINARY_BASE}/v1784789160/733280264_18103358009124140_8149390804036801858_n_njmi0a.jpg`, caption: "Crown & Finery" },
  { src: `${CLOUDINARY_BASE}/v1784789160/729540128_18103255874124140_3446801748311052528_n_zdptak.jpg`, caption: "Special Occasion Dressing" },
  { src: `${CLOUDINARY_BASE}/v1784789160/731735720_18103469900124140_6488157149745670270_n_kecbun.jpg`, caption: "Deity Alankara — Detail" },
  { src: `${CLOUDINARY_BASE}/v1784789160/728861533_18103358021124140_6191753973788301200_n_tgmjxv.jpg`, caption: "Daily Seva — Full View" },
];

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

const inputWrapClass = "relative";
const inputIconClass =
  "pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-vk-400";
const inputClass = "vk-input pl-10";
const labelClass = "mb-1.5 block text-[13px] font-semibold text-ink/80";
const stepLabelClass = "text-[13px] font-bold uppercase tracking-[0.08em] text-vk-700";
const addonBoxClass = "rounded-xl border border-vk-100 bg-vk-50/60 px-3.5 py-3";
const checkboxLabelClass = "flex cursor-pointer items-start gap-2.5 text-[13px] font-medium text-ink";
const checkboxClass = "mt-0.5 h-4 w-4 shrink-0 accent-vk-700";

export default function AlankaraVastraClient() {
  const attribution = useAttribution("/alankara-vastra-seva");
  const razorpayReady = useRazorpayPreload();
  useScrollToDonate();
  const [tierIndex, setTierIndex] = useState(0);
  const [customAmount, setCustomAmount] = useState("");
  const [useCustom, setUseCustom] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", mobile: "", panNumber: "", sevakName: "", dob: "" });
  const [want80G, setWant80G] = useState(false);
  const [monthly, setMonthly] = useState(false);
  const [wantsMahaPrasadam, setWantsMahaPrasadam] = useState(false);
  const [address, setAddress] = useState<PrasadamAddress>({ street: "", city: "", state: "", pincode: "", country: "India" });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showSticky, setShowSticky] = useState(false);

  // Donor pre-fill: logged-in profile auto-fills name/email/mobile; a
  // returning donor's phone lookup fills the same fields after they type
  // their 10-digit number. PAN/address are filled only when 80G/prasadam
  // are selected.
  const { lookupHint, handle80GToggle, handlePrasadamToggle } = useDonorPrefill({
    form,
    setForm,
    onMahaPrasadamSelect: (saved) => {
      setAddress((a) => {
        const blank = !a.street && !a.city && !a.state && !a.pincode;
        return blank ? ({ ...saved } as PrasadamAddress) : a;
      });
    },
  });

  const formRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const form = formRef.current;
    if (!form) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowSticky(!entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(form);
    return () => observer.disconnect();
  }, []);

  const finalAmount = useCustom ? Number(customAmount) || 0 : TIERS[tierIndex]?.amount || 0;
  const config = VASTRA_CONFIG;
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (finalAmount <= 999) {
      if (want80G) setWant80G(false);
      if (wantsMahaPrasadam) {
        setWantsMahaPrasadam(false);
        setAddress({ street: "", city: "", state: "", pincode: "", country: "India" });
      }
    }
  }, [finalAmount, want80G, wantsMahaPrasadam]);

  // Split 10 images into pages of 6 (2 rows × 3 cols)
  const galleryPages = DEITY_PHOTOS.reduce< typeof DEITY_PHOTOS[]>((pages, photo, i) => {
    const pageIndex = Math.floor(i / 6);
    if (!pages[pageIndex]) pages[pageIndex] = [];
    pages[pageIndex].push(photo);
    return pages;
  }, []);

  const BANK_DETAILS = {
    beneficiaryName: "HARE KRISHNA MOVEMENT INDIA",
    bankName: "IDFC FIRST BANK LTD",
    accountNumber: "10091415313",
    ifsc: "IDFB0080412",
  };

  const scrollToDonate = () => {
    document.getElementById("donate")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleCopy = (field: string, value: string) => {
    navigator.clipboard.writeText(value).then(() => {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    if (finalAmount < 1) {
      setStatus({ type: "error", message: "Please select a valid amount." });
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
    if (want80G && !form.panNumber.trim()) {
      setStatus({ type: "error", message: "PAN number is required for an 80G receipt." });
      return;
    }
    if (wantsMahaPrasadam && (!address.street.trim() || !address.city.trim() || !address.state.trim() || !/^\d{6}$/.test(address.pincode.trim()))) {
      setStatus({ type: "error", message: "Please complete the delivery address (door no./area, city, state and a valid 6-digit PIN code) for Maha Prasadam." });
      return;
    }

    setSubmitting(true);
    try {
      const metaEventId = newEventId();
      const metaBrowser = getMetaBrowserData();
      const baseBody = {
        account: "default",
        sourcePage: "/alankara-vastra-seva",
        utm: attribution.payload().utm,
        type: config.orderType,
        sevaName: config.pageTitle,
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        mobile: form.mobile.trim(),
        amount: finalAmount,
        sevakName: form.sevakName.trim() || undefined,
        dob: form.dob || undefined,
        certificate: want80G,
        panNumber: want80G ? form.panNumber.trim() : undefined,
        metaEventId,
        metaFbp: metaBrowser.fbp,
        metaFbc: metaBrowser.fbc,
      };

      // Monthly autopay → Razorpay Subscription; one-time → Razorpay Order.
      const endpoint = monthly ? "/payments/subscription" : "/payments/order";
      const createRes = await fetch(`${apiBase()}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          monthly
            ? baseBody
            : {
                ...baseBody,
                mahaprasadam: wantsMahaPrasadam,
                prasadamAddress: wantsMahaPrasadam
                  ? { street: address.street.trim(), city: address.city.trim(), state: address.state.trim(), pincode: address.pincode.trim(), country: "India" }
                  : undefined,
              }
        ),
      });

      if (!createRes.ok) {
        throw new Error(
          monthly
            ? "Unable to start the monthly donation. Please try again."
            : "Unable to create payment order. Please try again."
        );
      }
      const created = await createRes.json();

      await razorpayReady();
      const win = window as unknown as { Razorpay?: RazorpayConstructor };
      if (!win.Razorpay) throw new Error("Razorpay checkout is unavailable.");

      const checkoutOptions: Record<string, unknown> = {
        key: created.key,
        name: "Hare Krishna Movement Vizag",
        description: `${config.pageTitle}${monthly ? " — Monthly" : ""} — Hare Krishna Vaikuntham Temple`,
        prefill: { name: form.name, email: form.email, contact: form.mobile },
        notes: { sourcePage: "/alankara-vastra-seva", sevaName: config.pageTitle, sevaType: config.orderType },
        handler: async (response: Record<string, string>) => {
          try {
            const verifyRes = await fetch(`${apiBase()}/payments/verify`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                donationId: created.donationId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                razorpay_subscription_id: response.razorpay_subscription_id,
              }),
            });
            if (!verifyRes.ok) throw new Error("Payment verification failed.");
            trackPurchase({ value: finalAmount, eventId: metaEventId, content_name: config.pageTitle });
            window.location.assign(`/payment/thank-you?type=seva&seva=${encodeURIComponent(config.pageTitle)}&amount=${finalAmount}&source=${encodeURIComponent("the vastra and alankara seva programme")}${monthly ? "&recurring=1" : ""}`);
          } catch (err) {
            setStatus({
              type: "error",
              message: err instanceof Error ? err.message : "Payment verification failed.",
            });
          } finally {
            setSubmitting(false);
          }
        },
        modal: { ondismiss: () => setSubmitting(false) },
        theme: { color: "#D69E2E" },
      };
      // Subscriptions authorise via subscription_id (no amount/order_id);
      // one-time payments pass the order and amount.
      if (monthly) {
        checkoutOptions.subscription_id = created.subscriptionId;
      } else {
        checkoutOptions.amount = Math.round(finalAmount * 100);
        checkoutOptions.currency = "INR";
        checkoutOptions.order_id = created.orderId;
      }

      new win.Razorpay(checkoutOptions).open();
    } catch (err) {
      setStatus({ type: "error", message: err instanceof Error ? err.message : "Something went wrong." });
      setSubmitting(false);
    }
  };

  return (
    <PageLayout>
      <WhatsAppFloatButton />
      <main className="bg-white dark:bg-background">
        {/* ── Hero Banner ── */}
        {config.bannerImage ? (
          <section className="bg-gradient-to-b from-vk-50 to-white pt-[var(--header-h)] dark:from-background dark:to-background">
            <div className="vk-container pt-4 md:pt-6">
            <button
              type="button"
              onClick={scrollToDonate}
              aria-label="Donate — go to the donation form"
              className="block w-full cursor-pointer overflow-hidden rounded-3xl bg-vk-900 shadow-[0_24px_60px_-28px_rgba(10,18,51,0.6)]"
            >
              <Image
                src={config.bannerImageMobile || config.bannerImage}
                alt={`${config.pageTitle} — ${config.heroHeading1} ${config.heroHeading2}`}
                width={960}
                height={1639}
                priority
                sizes="100vw"
                className="block h-auto w-full md:hidden"
              />
              <Image
                src={config.bannerImage}
                alt={`${config.pageTitle} — ${config.heroHeading1} ${config.heroHeading2}`}
                width={1920}
                height={730}
                priority
                sizes="(min-width: 1280px) 1248px, 100vw"
                className="hidden h-auto w-full md:block"
              />
            </button>
            </div>
          </section>
        ) : (
          <section className="relative min-h-[85vh] overflow-hidden bg-[hsl(220,90%,12%)]">
            <div className="absolute inset-0">
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${config.heroImage})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[hsl(220,90%,12%)]/95 via-[hsl(220,90%,12%)]/80 to-[hsl(220,90%,12%)]/50" />
              <div className="absolute inset-0 bg-gradient-to-t from-[hsl(220,90%,12%)] via-transparent to-transparent" />
            </div>
            <div className="pointer-events-none absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-gold/10 blur-[120px]" />
            <div className="relative z-10 mx-auto flex min-h-[85vh] max-w-6xl items-center px-4 pt-28 pb-16 md:pt-32">
              <div className="w-full max-w-2xl">
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                  <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-gold md:text-sm">
                    {config.heroTagline}
                  </p>
                  <h1 className="mb-4 font-heading text-4xl font-bold leading-tight text-white md:text-6xl">
                    {config.heroHeading1}
                    <br />
                    <span className="text-gold">{config.heroHeading2}</span>
                  </h1>
                  <p className="mb-8 text-base leading-relaxed text-white/75 md:text-lg">
                    {config.heroDesc}
                  </p>
                  <div className="mb-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                    <button
                      onClick={scrollToDonate}
                      className="rounded-full bg-gradient-gold px-10 py-4 text-base font-bold text-[hsl(220,90%,12%)] shadow-[var(--shadow-gold)] transition-all hover:scale-105 hover:shadow-[0_12px_32px_hsl(42,92%,46%,0.45)] md:text-lg"
                    >
                      Donate Now
                    </button>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/60">
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-gold" /> Prasadam from the temple
                    </span>
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-gold" /> Sankalpa & Aarti
                    </span>
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-gold" /> 80G tax exemption
                    </span>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>
        )}

        {/* ── Donation Form ── */}
        <section id="donate" ref={formRef} className="vk-section scroll-mt-24 bg-white dark:bg-background">
          <div className="vk-container">
           <div className="mx-auto max-w-4xl">
            <SectionHeading
              as="h1"
              eyebrow="Temple Service Campaign"
              title={config.formHeading}
              subtitle={config.formSubheading}
              align="center"
            />

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="vk-card overflow-hidden !rounded-3xl"
            >
              {/* Amount summary strip */}
              <div className="flex items-center justify-between gap-3 bg-gradient-to-br from-vk-700 via-vk-600 to-vk-500 px-5 py-4 text-white sm:px-7">
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/70">
                    You&apos;re offering
                  </p>
                  <p className="text-lg font-bold text-white">
                    {useCustom ? "Custom offering" : TIERS[tierIndex]?.label || "Select a tier"}
                  </p>
                </div>
                <p className="shrink-0 font-heading text-2xl font-extrabold text-[hsl(var(--gold))] sm:text-3xl">
                  ₹{finalAmount > 0 ? finalAmount.toLocaleString("en-IN") : "0"}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="grid gap-6 p-4 sm:p-6 lg:grid-cols-2 lg:gap-8">
                {/* Left: amount selection */}
                <div className="min-w-0 space-y-3">
                  <p className={stepLabelClass}>
                    Choose Your Offering
                  </p>
                  <div className="grid grid-cols-2 gap-2.5">
                    {TIERS.map((tier, i) => (
                      <button
                        key={tier.amount}
                        type="button"
                        onClick={() => { setUseCustom(false); setTierIndex(i); }}
                        className={`min-h-[52px] rounded-xl border px-3 py-2.5 text-left transition-all ${
                          !useCustom && tierIndex === i
                            ? "border-vk-500 bg-vk-50 ring-2 ring-vk-500/20"
                            : "border-vk-200 bg-white hover:border-vk-400"
                        }`}
                      >
                        <span className="mb-1 block text-[13px] font-semibold text-ink">{tier.label}</span>
                        <span className="mb-1 block text-[11px] leading-snug text-muted-foreground">
                          {tier.description}
                        </span>
                        <span className="block text-base font-extrabold text-vk-700">
                          ₹{tier.amount.toLocaleString("en-IN")}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Custom amount */}
                  <div
                    className={`flex h-11 items-center gap-2 rounded-xl border px-3.5 transition-all ${
                      useCustom
                        ? "border-vk-500 bg-vk-50 ring-2 ring-vk-500/20"
                        : "border-dashed border-vk-200 bg-white focus-within:border-vk-500"
                    }`}
                  >
                    <label htmlFor="custom-amount" className="shrink-0 text-[13px] font-medium text-muted-foreground">
                      Other amount
                    </label>
                    <span className="text-sm font-semibold text-vk-700">₹</span>
                    <input
                      id="custom-amount"
                      type="number"
                      min={config.minCustomAmount}
                      placeholder={`Min ${config.minCustomAmount}`}
                      value={customAmount}
                      onFocus={() => setUseCustom(true)}
                      onChange={(e) => {
                        setUseCustom(true);
                        setCustomAmount(e.target.value);
                      }}
                      className="h-full w-full min-w-0 bg-transparent text-[15px] font-semibold text-ink outline-none placeholder:font-normal placeholder:text-muted-foreground"
                    />
                  </div>

                  {/* Bank transfer */}
                  <details className="group rounded-xl border border-vk-100 bg-white px-3.5 py-1">
                    <summary className="flex min-h-[40px] cursor-pointer list-none items-center justify-between gap-2 text-[13px] font-semibold text-ink">
                      <span className="flex items-center gap-2">
                        <Landmark className="h-4 w-4 shrink-0 text-vk-500" />
                        Prefer a direct bank transfer?
                      </span>
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-vk-100 text-vk-700 transition-transform group-open:rotate-180">
                        <ChevronDown className="h-3.5 w-3.5" />
                      </span>
                    </summary>
                    <div className="mb-2.5 mt-1.5 space-y-2 rounded-xl bg-vk-50 p-4 text-sm">
                      {(
                        [
                          ["Beneficiary", BANK_DETAILS.beneficiaryName],
                          ["Bank", BANK_DETAILS.bankName],
                          ["Account No.", BANK_DETAILS.accountNumber],
                          ["IFSC", BANK_DETAILS.ifsc],
                        ] as const
                      ).map(([label, value]) => (
                        <div key={label} className="flex items-center justify-between gap-3 text-xs">
                          <span className="shrink-0 text-muted-foreground">{label}</span>
                          <button
                            type="button"
                            onClick={() => handleCopy(label, value)}
                            className="flex min-w-0 items-center gap-1.5 text-right font-semibold text-ink hover:text-vk-700"
                          >
                            <span className="min-w-0 break-all">{value}</span>
                            {copiedField === label ? (
                              <Check className="h-3.5 w-3.5 shrink-0 text-green-600" />
                            ) : (
                              <Copy className="h-3.5 w-3.5 shrink-0 text-vk-400" />
                            )}
                          </button>
                        </div>
                      ))}
                      <p className="border-t border-vk-100 pt-2 text-[11px] leading-relaxed text-muted-foreground">
                        Email your transaction reference and PAN (for 80G) to{" "}
                        <a href={`mailto:${config.email}`} className="break-all font-semibold text-vk-700 hover:underline">
                          {config.email}
                        </a>
                        .
                      </p>
                    </div>
                  </details>
                </div>

                {/* Right: details, add-ons, submit */}
                <div className="flex min-w-0 flex-col space-y-3">
                  <p className={stepLabelClass}>Your Details</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label htmlFor="donor-name" className={labelClass}>Full name</label>
                      <div className={inputWrapClass}>
                        <User className={inputIconClass} />
                        <input
                          id="donor-name"
                          type="text"
                          required
                          placeholder="Your name"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className={inputClass}
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="donor-mobile" className={labelClass}>Mobile number</label>
                      <div className={inputWrapClass}>
                        <Phone className={inputIconClass} />
                        <input
                          id="donor-mobile"
                          type="tel"
                          required
                          maxLength={10}
                          inputMode="numeric"
                          placeholder="10-digit mobile"
                          value={form.mobile}
                          onChange={(e) => setForm({ ...form, mobile: e.target.value.replace(/[^\d]/g, "").slice(0, 10) })}
                          className={inputClass}
                        />
                      </div>
                    </div>
                  </div>

                  {lookupHint}

                  <div>
                    <label htmlFor="donor-email" className={labelClass}>Email address (optional)</label>
                    <div className={inputWrapClass}>
                      <Mail className={inputIconClass} />
                      <input
                        id="donor-email"
                        type="email"
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <DonorExtrasFields
                    sevakName={form.sevakName}
                    dob={form.dob}
                    onSevakNameChange={(v) => setForm({ ...form, sevakName: v })}
                    onDobChange={(v) => setForm({ ...form, dob: v })}
                    collapsible
                  />

                  {/* 80G */}
                  {finalAmount > 999 && (
                  <div className={addonBoxClass}>
                    <label className={checkboxLabelClass}>
                      <input
                        type="checkbox"
                        checked={want80G}
                        onChange={(e) => {
                          setWant80G(e.target.checked);
                          handle80GToggle(e.target.checked);
                        }}
                        className={checkboxClass}
                      />
                      I need an 80G tax exemption receipt
                    </label>
                    {want80G && (
                      <input
                        id="donor-pan"
                        type="text"
                        placeholder="PAN number *"
                        value={form.panNumber}
                        onChange={(e) => setForm({ ...form, panNumber: e.target.value.toUpperCase() })}
                        className="vk-input mt-2.5 uppercase"
                      />
                    )}
                  </div>
                  )}

                  {/* Maha Prasadam (one-time donations only) */}
                  {finalAmount > 999 && !monthly && (
                    <div className={addonBoxClass}>
                      <label className={checkboxLabelClass}>
                        <input
                          type="checkbox"
                          checked={wantsMahaPrasadam}
                          onChange={(e) => {
                            setWantsMahaPrasadam(e.target.checked);
                            handlePrasadamToggle(e.target.checked);
                          }}
                          className={checkboxClass}
                        />
                        🙏 I&apos;d like Maha Prasadam delivered
                      </label>
                      {wantsMahaPrasadam && <AddressForm address={address} setAddress={setAddress} />}
                    </div>
                  )}

                  {/* Monthly autopay toggle */}
                  <button
                    type="button"
                    onClick={() => {
                      setMonthly((m) => {
                        const next = !m;
                        if (next) setWantsMahaPrasadam(false);
                        return next;
                      });
                    }}
                    className={`flex min-h-[52px] w-full items-center gap-3 rounded-xl border px-3.5 py-2.5 text-left transition-all ${
                      monthly
                        ? "border-vk-500 bg-vk-50 ring-2 ring-vk-500/20"
                        : "border-vk-200 bg-white hover:border-vk-400"
                    }`}
                  >
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                        monthly ? "border-vk-700 bg-vk-700 text-white" : "border-vk-300 bg-white"
                      }`}
                    >
                      {monthly && <Check className="h-3.5 w-3.5" />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[13px] font-semibold text-ink">🔁 Make it a monthly seva</span>
                      <span className="block text-[11px] leading-snug text-muted-foreground">
                        {monthly && finalAmount > 0
                          ? `Auto-pay ₹${finalAmount.toLocaleString("en-IN")} every month. Cancel anytime.`
                          : "Give this offering automatically every month."}
                      </span>
                    </span>
                  </button>

                  {status && (
                    <p
                      className={`rounded-xl px-3.5 py-2.5 text-[13px] font-medium ${
                        status.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-700"
                      }`}
                    >
                      {status.message}
                    </p>
                  )}

                  <div className="flex-1" />

                  <button
                    type="submit"
                    disabled={submitting}
                    className="vk-btn-gold h-12 w-full text-[15px] font-bold"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Processing…
                      </>
                    ) : monthly ? (
                      <>🔁 Donate ₹{finalAmount > 0 ? finalAmount.toLocaleString("en-IN") : "—"} / month</>
                    ) : (
                      <>Donate ₹{finalAmount > 0 ? finalAmount.toLocaleString("en-IN") : "—"}</>
                    )}
                  </button>
                  <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center text-[11px] text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-vk-500" />
                      Secure payment via Razorpay · UPI, cards &amp; netbanking accepted
                    </span>
                  </p>
                </div>
              </form>
            </motion.div>
           </div>
          </div>
        </section>

        {/* ── Donor Privileges ── */}
        <DonorPrivilegesSection scrollToDonate={scrollToDonate} config={config} />

        {/* ── Deity Alankara Photos ── */}
        <section className="vk-section vk-band">
          <div className="vk-container">
            <div className="mb-8 flex items-end justify-between gap-4 md:mb-10">
              <SectionHeading
                eyebrow="Divine beauty in every detail"
                title="Deity Alankara Gallery"
                subtitle="Witness the exquisite daily dressing and ornamentation of Sri Sri Radha Madan Mohan — each alankara a labour of love offered with devotion."
                className="!mb-0"
              />
              <div className="hidden shrink-0 gap-2 sm:flex">
                <button
                  type="button"
                  aria-label="Scroll left"
                  onClick={() => galleryRef.current?.scrollBy({ left: -galleryRef.current.offsetWidth, behavior: "smooth" })}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-vk-200 bg-white text-vk-700 transition hover:border-vk-500 hover:bg-vk-50"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  aria-label="Scroll right"
                  onClick={() => galleryRef.current?.scrollBy({ left: galleryRef.current.offsetWidth, behavior: "smooth" })}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-vk-200 bg-white text-vk-700 transition hover:border-vk-500 hover:bg-vk-50"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div
              ref={galleryRef}
              className="vk-scroller [scroll-padding-inline:0px]"
            >
              {galleryPages.map((page, pageIndex) => (
                <div
                  key={pageIndex}
                  className="w-full min-w-0 shrink-0 snap-start"
                >
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
                    {page.map((photo, i) => (
                      <motion.div
                          key={photo.src}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.06, duration: 0.5 }}
                          className="vk-tile aspect-[4/5]"
                        >
                          <Image
                            src={photo.src}
                            alt={photo.caption}
                            fill
                            sizes="(max-width: 768px) 50vw, 33vw"
                            className="object-cover"
                          />
                          <div className="vk-tile-caption !p-3 md:!p-4">
                            <p className="text-xs font-semibold leading-snug text-white md:text-sm">{photo.caption}</p>
                          </div>
                        </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile scroll hint */}
            <div className="mt-3 flex justify-center gap-1.5 sm:hidden">
              {galleryPages.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Go to page ${i + 1}`}
                  onClick={() => {
                    const container = galleryRef.current;
                    if (container) {
                      container.scrollTo({ left: i * container.offsetWidth, behavior: "smooth" });
                    }
                  }}
                  className="group flex h-8 items-center"
                  style={{ width: 24 }}
                >
                  <span className="block h-1.5 w-full rounded-full bg-vk-200 transition-colors group-hover:bg-vk-400" />
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ── Power of Giving ── */}
        <ImportanceSection />

        {/* ── FAQs ── */}
        <FaqSection faqs={FAQS} />

        {/* ── Founder's words ── */}
        <FounderSection />

        {/* ── Sticky mobile donate bar ── */}
        {showSticky && (
        <div className="fixed left-3 right-[76px] bottom-[calc(var(--bottom-nav-space)+4px+env(safe-area-inset-bottom))] z-40 lg:hidden">
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-vk-100 bg-white/95 p-2 pl-4 shadow-lift backdrop-blur">
            <div className="min-w-0">
              <p className="truncate text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                You&apos;re offering
              </p>
              <p className="truncate font-heading text-base font-extrabold text-vk-700">
                ₹{finalAmount > 0 ? finalAmount.toLocaleString("en-IN") : "0"}
              </p>
            </div>
            <button
              type="button"
              onClick={scrollToDonate}
              className="vk-btn-gold h-11 shrink-0 px-5"
            >
              <Heart className="h-4 w-4 fill-current" /> Donate Now
            </button>
          </div>
        </div>
        )}
      </main>
    </PageLayout>
  );
}
