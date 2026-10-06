"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Check, Clock, Copy, Facebook, FileCheck2, Heart, Instagram, Mail, MapPin, MessageCircle, Phone, ShieldCheck, Youtube, UtensilsCrossed, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import DonorExtrasFields from "@/components/DonorExtrasFields";
import { useDonorPrefill } from "@/lib/donorPrefill";
import WhatsAppFloatButton from "@/components/WhatsAppFloatButton";
import JanmashtamiGallery from "@/components/JanmashtamiGallery";
import SectionHeading from "@/components/site/SectionHeading";
import Reveal from "@/components/site/Reveal";
import JanmashtamiImportanceSection from "@/components/janmashtami/JanmashtamiImportanceSection";
import { useRazorpayPreload } from "@/lib/useRazorpayPreload";
import { useAttribution } from "@/lib/useAttribution";
import { prefillEmail } from "@/lib/razorpayPrefill";

type SevaOption = {
  legacySevaId: number;
  label: string;
  amount: number | null;
  subtitle?: string;
};

type Seva = {
  slug: string;
  title: string;
  description: string;
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
  doorNo: string;
  building: string;
  street: string;
  area: string;
  pincode: string;
  city: string;
  state: string;
  sevakName: string;
  dob: string;
};

type SelectedOffering = {
  seva: Seva;
  option: SevaOption;
};

type RazorpayConstructor = new (options: Record<string, unknown>) => { open: () => void };

const banners = [
  {
    desktop: "/assets/janmashtami-skj26_1.webp",
    mobile: "/assets/janmashtami-skj26_m1.webp",
    alt: "Sri Krishna Janmashtami celebrations at ISKCON Gambheeram Visakhapatnam",
  },
  {
    desktop: "/assets/janmashtami-skj26_2.webp",
    mobile: "/assets/janmashtami-skj26_m2.webp",
    alt: "Offer sevas for Sri Krishna Janmashtami at ISKCON Gambheeram Visakhapatnam",
  },
];

const sevas: Seva[] = [
  // ── Row 1 ──
  {
    slug: "annadana",
    title: "Annadana Seva",
    description: "Sponsor Anna-Daan to all the temple visitors in the name of your family or loved ones.",
    image: "/assets/janmashtami-sk1.webp",
    options: [
      { legacySevaId: 186, label: "Donate Rs. 15,001", amount: 15001 },
      { legacySevaId: 187, label: "Donate Rs. 9,001", amount: 9001 },
      { legacySevaId: 188, label: "Donate Rs. 6,001", amount: 6001 },
      { legacySevaId: 300, label: "Donate Rs. 4,501", amount: 4501 },
      { legacySevaId: 189, label: "Donate Rs. 3,001", amount: 3001 },
      { legacySevaId: 190, label: "Donate Rs. 1,501", amount: 1501 },
      { legacySevaId: 191, label: "Donate Any Other Amount", amount: null },
    ],
  },
  {
    slug: "gau-seva",
    title: "Gau Seva",
    description: "Offer Gau Poshana Seva to protect and nourish the cows residing at our goshala.",
    image: "/assets/janmashtami-sk4.webp",
    options: [
      { legacySevaId: 198, label: "Donate Rs. 9,001", amount: 9001 },
      { legacySevaId: 199, label: "Donate Rs. 5,001", amount: 5001 },
      { legacySevaId: 200, label: "Donate Rs. 3,501", amount: 3501 },
      { legacySevaId: 301, label: "Donate Rs. 3,001", amount: 3001 },
      { legacySevaId: 201, label: "Donate Rs. 2,501", amount: 2501 },
      { legacySevaId: 202, label: "Donate Rs. 1,501", amount: 1501 },
      { legacySevaId: 203, label: "Donate Any Other Amount", amount: null },
    ],
  },
  {
    slug: "pushpalankara",
    title: "Pushpalankara Seva",
    description: "Sponsor a grand Garland for Radha Krishna on this auspicious day to welcome the Supreme Lord.",
    image: "/assets/janmashtami-sk2.webp",
    options: [
      { legacySevaId: 216, label: "Donate Rs. 10,008", amount: 10008 },
      { legacySevaId: 217, label: "Donate Rs. 7,501", amount: 7501 },
      { legacySevaId: 218, label: "Donate Rs. 5,001", amount: 5001 },
      { legacySevaId: 302, label: "Donate Rs. 3,501", amount: 3501 },
      { legacySevaId: 219, label: "Donate Rs. 2,501", amount: 2501 },
      { legacySevaId: 220, label: "Donate Rs. 1,008", amount: 1008 },
      { legacySevaId: 221, label: "Donate Any Other Amount", amount: null },
    ],
  },
  // ── Row 2 — Abhisheka & Naivedhya moved up ──
  {
    slug: "abhisheka",
    title: "Abhisheka Seva",
    description: "Sponsor the sacred Abhishekam of Sri Sri Radha Madan Mohan — morning and Kalash bathing ceremonies on Janmashtami.",
    image: "/assets/janmashtami-sk3.webp",
    options: [
      { legacySevaId: 234, label: "Donate Rs. 25,555", amount: 25555, subtitle: "Pratah Abhishekam" },
      { legacySevaId: 240, label: "Donate Rs. 15,555", amount: 15555, subtitle: "Kalash Abhishekam" },
      { legacySevaId: 236, label: "Donate Rs. 10,008", amount: 10008 },
      { legacySevaId: 303, label: "Donate Rs. 7,501", amount: 7501 },
      { legacySevaId: 237, label: "Donate Rs. 5,001", amount: 5001 },
      { legacySevaId: 238, label: "Donate Rs. 2,501", amount: 2501 },
      { legacySevaId: 239, label: "Donate Any Other Amount", amount: null },
    ],
  },
  {
    slug: "naivedhya",
    title: "Naivedhya Seva",
    description: "Sponsor the sacred food offering to Lord Krishna — Naivedhya is the devotional offering of prepared dishes to the Lord.",
    image: "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1785833545819-1785833545717-naivedya.jpeg",
    options: [
      { legacySevaId: 246, label: "Donate Rs. 11,111", amount: 11111 },
      { legacySevaId: 247, label: "Donate Rs. 7,501", amount: 7501 },
      { legacySevaId: 248, label: "Donate Rs. 5,001", amount: 5001 },
      { legacySevaId: 304, label: "Donate Rs. 4,001", amount: 4001 },
      { legacySevaId: 249, label: "Donate Rs. 3,001", amount: 3001 },
      { legacySevaId: 250, label: "Donate Rs. 1,501", amount: 1501 },
      { legacySevaId: 251, label: "Donate Any Other Amount", amount: null },
    ],
  },
  {
    slug: "tulasi-archana",
    title: "Tulasi Archana Seva",
    description: "Sponsor a grand Archana for Radha Krishna on this auspicious day to welcome the Supreme Lord.",
    image: "/assets/janmashtami-sk6.webp",
    options: [
      { legacySevaId: 210, label: "Donate Rs. 10,008", amount: 10008 },
      { legacySevaId: 211, label: "Donate Rs. 7,501", amount: 7501 },
      { legacySevaId: 212, label: "Donate Rs. 5,001", amount: 5001 },
      { legacySevaId: 305, label: "Donate Rs. 3,501", amount: 3501 },
      { legacySevaId: 213, label: "Donate Rs. 2,501", amount: 2501 },
      { legacySevaId: 214, label: "Donate Rs. 1,008", amount: 1008 },
      { legacySevaId: 215, label: "Donate Any Other Amount", amount: null },
    ],
  },
  // ── Remaining sevas ──
  {
    slug: "makhan-mishri",
    title: "Makhan Mishri Seva",
    description: "Receive the special blessings of Makhan Lal by sponsoring His very favourite Makhan Mishri.",
    image: "/assets/janmashtami-sk5.webp",
    options: [
      { legacySevaId: 192, label: "Donate Rs. 10,008", amount: 10008 },
      { legacySevaId: 193, label: "Donate Rs. 5,001", amount: 5001 },
      { legacySevaId: 306, label: "Donate Rs. 3,501", amount: 3501 },
      { legacySevaId: 194, label: "Donate Rs. 2,501", amount: 2501 },
      { legacySevaId: 195, label: "Donate Rs. 1,008", amount: 1008 },
      { legacySevaId: 196, label: "Donate Rs. 501", amount: 501 },
      { legacySevaId: 197, label: "Donate Any Other Amount", amount: null },
    ],
  },
  {
    slug: "vastrabharana",
    title: "Vastrabharana Seva",
    description: "Sponsor exquisite garments and divine ornaments for Sri Sri Radha Madan Mohan on Janmashtami.",
    image: "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1783677419371-1783677418690-DietyPhotos.jpeg",
    options: [
      { legacySevaId: 258, label: "Donate Rs. 1,50,000", amount: 150000 },
      { legacySevaId: 259, label: "Donate Rs. 1,00,008", amount: 100008 },
      { legacySevaId: 260, label: "Donate Rs. 75,001", amount: 75001 },
      { legacySevaId: 307, label: "Donate Rs. 60,001", amount: 60001 },
      { legacySevaId: 261, label: "Donate Rs. 51,001", amount: 51001 },
      { legacySevaId: 262, label: "Donate Rs. 25,001", amount: 25001 },
      { legacySevaId: 263, label: "Donate Any Other Amount", amount: null },
    ],
  },
  {
    slug: "chappan-bhog",
    title: "Chappan Bhog Seva",
    description: "Sponsor the grand offering of 56 dishes to Lord Krishna — a magnificent feast of devotion on His appearance day.",
    image: "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1785833232608-1785833231421-chapan-bhog.webp",
    options: [
      { legacySevaId: 222, label: "Donate Rs. 75,555", amount: 75555 },
      { legacySevaId: 223, label: "Donate Rs. 51,001", amount: 51001 },
      { legacySevaId: 224, label: "Donate Rs. 35,001", amount: 35001 },
      { legacySevaId: 308, label: "Donate Rs. 25,001", amount: 25001 },
      { legacySevaId: 225, label: "Donate Rs. 21,001", amount: 21001 },
      { legacySevaId: 226, label: "Donate Rs. 11,001", amount: 11001 },
      { legacySevaId: 227, label: "Donate Any Other Amount", amount: null },
    ],
  },
  {
    slug: "mandapa",
    title: "Mandapa Seva",
    description: "Sponsor the sacred Mandapa decoration for the grand Janmashtami celebrations at ISKCON Gambheeram Visakhapatnam.",
    image: "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1785833231776-1785833231103-ChatGPTImageAug42026021053PM.webp",
    options: [
      { legacySevaId: 228, label: "Donate Rs. 55,555", amount: 55555 },
      { legacySevaId: 229, label: "Donate Rs. 35,001", amount: 35001 },
      { legacySevaId: 230, label: "Donate Rs. 25,001", amount: 25001 },
      { legacySevaId: 309, label: "Donate Rs. 21,001", amount: 21001 },
      { legacySevaId: 231, label: "Donate Rs. 15,001", amount: 15001 },
      { legacySevaId: 232, label: "Donate Rs. 7,501", amount: 7501 },
      { legacySevaId: 233, label: "Donate Any Other Amount", amount: null },
    ],
  },
  {
    slug: "japa-yagna",
    title: "Japa Yagna Seva",
    description: "Sponsor the Japa Yagna — a collective chanting of the holy names of Lord Krishna on His divine appearance day.",
    image: "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1785833232341-1785833231402-ChatGPTImageAug42026020855PM.webp",
    options: [
      { legacySevaId: 252, label: "Donate Rs. 7,777", amount: 7777 },
      { legacySevaId: 253, label: "Donate Rs. 5,001", amount: 5001 },
      { legacySevaId: 254, label: "Donate Rs. 3,001", amount: 3001 },
      { legacySevaId: 310, label: "Donate Rs. 2,501", amount: 2501 },
      { legacySevaId: 255, label: "Donate Rs. 2,001", amount: 2001 },
      { legacySevaId: 256, label: "Donate Rs. 1,008", amount: 1008 },
      { legacySevaId: 257, label: "Donate Any Other Amount", amount: null },
    ],
  },
];

const galleryImages = [
  "/assets/janmashtami-a75.webp",
  "/assets/janmashtami-a2.webp",
  "/assets/janmashtami-a3.webp",
  "/assets/janmashtami-a4.webp",
];

const TRUST_BADGES = [
  { icon: FileCheck2, label: "80G Tax Exemption" },
  { icon: UtensilsCrossed, label: "Mahaprasadam Sent" },
  { icon: Clock, label: "Instant Confirmation" },
  { icon: ShieldCheck, label: "Secure Razorpay Checkout" },
];

const initialForm: CheckoutForm = {
  donorName: "",
  donorMobile: "",
  donorEmail: "",
  customAmount: "",
  wantPrasadam: false,
  want80G: false,
  panNumber: "",
  doorNo: "",
  building: "",
  street: "",
  area: "",
  pincode: "",
  city: "",
  state: "",
  sevakName: "",
  dob: "",
};

const apiBase = () => (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080").replace(/\/+$/, "");
const formatAmount = (amount: number) => amount.toLocaleString("en-IN");

// Shared field styling for the checkout modal (Vaikuntham Blue).
const labelCls = "mb-1.5 block text-[13px] font-semibold text-ink/80";
const fieldCls = "h-11 rounded-xl border-vk-200 bg-white text-[15px] focus-visible:ring-vk-500/40 md:text-[15px]";

export interface JanmashtamiCampaigner {
  name: string;
  slug: string;
  message?: string;
  raisedAmount?: number;
  donorCount?: number;
}

export default function JanmashtamiClient({ campaigner }: { campaigner?: JanmashtamiCampaigner } = {}) {
  const reduce = useReducedMotion();
  const attribution = useAttribution(campaigner ? `/janmashtami3/c/${campaigner.slug}` : "janmashtami3");
  const razorpayReady = useRazorpayPreload();
  const searchParams = useSearchParams();
  const [activeSlide, setActiveSlide] = useState(0);
  const [selected, setSelected] = useState<SelectedOffering | null>(null);
  const [form, setForm] = useState<CheckoutForm>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error" | "idle"; message: string }>({ type: "idle", message: "" });
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const finalAmount = selected?.option.amount ?? Number(form.customAmount || 0);
  const showTaxField = finalAmount >= 500;
  const showPrasadamField = finalAmount >= 1000;
  const needsAddress = form.want80G || form.wantPrasadam;

  const selectedSummary = useMemo(() => {
    if (!selected) return "";
    return `${selected.seva.title} - ${selected.option.label}`;
  }, [selected]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % banners.length);
    }, 5500);
    return () => window.clearInterval(timer);
  }, []);

  const updateForm = (patch: Partial<CheckoutForm>) => {
    setForm((current) => ({ ...current, ...patch }));
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
      setForm((current) =>
        !current.street && !current.area && !current.city && !current.state && !current.pincode
          ? {
              ...current,
              street: (saved.street || "").trim(),
              city: saved.city,
              state: saved.state,
              pincode: saved.pincode,
            }
          : current
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
  };

  const closeCheckout = () => {
    if (!submitting) setSelected(null);
  };

  // Deep-linking into the checkout modal — same contract as /janmashtami:
  //   ads      ?seva=abhisheka
  //   reminder ?seva=abhisheka&amount=2100
  //
  // This page opens a modal per seva *tier* rather than an inline form, so the
  // amount picks the matching tier when there is one; otherwise the seva's
  // open-amount option is opened with the value pre-filled. An unknown slug is
  // ignored, so a stale ad link still shows a working page.
  useEffect(() => {
    const sevaParam = searchParams.get("seva");
    if (!sevaParam) return;

    const seva = sevas.find((s) => s.slug === sevaParam);
    if (!seva) return;

    const amount = Number(searchParams.get("amount") || 0);
    const hasAmount = Number.isFinite(amount) && amount >= 100;

    const tier = hasAmount ? seva.options.find((o) => o.amount === amount) : undefined;
    const openOption = seva.options.find((o) => o.amount == null);
    const option = tier || openOption || seva.options[0];
    if (!option) return;

    openCheckout(seva, option);
    if (!tier && hasAmount && option.amount == null) {
      // No tier matches — an old price, or an amount the donor typed. Restore
      // it into the custom-amount box. openCheckout resets the form first, so
      // this merge lands on top of a clean initialForm.
      updateForm({ customAmount: String(amount) });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const validate = () => {
    if (!selected) return "Please select a seva.";
    if (!finalAmount || finalAmount < 100) return "Amount must be at least Rs.100.";
    if (!form.donorName.trim()) return "Donor name is required.";
    if (!/^[6-9]\d{9}$/.test(form.donorMobile)) return "Please enter a valid 10 digit mobile number.";
    if (form.donorEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.donorEmail.trim())) return "Please enter a valid email address, or leave it blank.";
    if (form.want80G && !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(form.panNumber)) return "Please enter a valid PAN number.";
    if (needsAddress) {
      if (!form.area.trim() || !form.pincode.trim() || !form.city.trim() || !form.state.trim()) {
        return "Please fill address, pincode, city and state.";
      }
      if (!/^\d{6}$/.test(form.pincode)) return "Please enter a valid 6 digit pincode.";
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
      const orderResponse = await fetch(`${apiBase()}/payments/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourcePage: campaigner ? `/janmashtami3/c/${campaigner.slug}` : "janmashtami3",
          // Page hero banner — used as the header image of the pending-payment WhatsApp reminder.
          bannerImage: banners[0]?.desktop,
          campaignerSlug: campaigner?.slug || undefined,
          utm: attribution.payload().utm,
          festivalSlug: "janmashtami",
          type: "Sri Krishna Janmashtami",
          sevaName: selected.seva.title,
          // Stored on the donation so the pending-payment reminder can link
          // straight back to this seva (?seva=<slug>) if the donor drops off.
          sevaSlug: selected.seva.slug,
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
                doorNo: form.doorNo,
                house: form.building,
                street: form.street,
                area: form.area,
                country: "India",
                state: form.state,
                city: form.city,
                pincode: form.pincode,
              }
            : null,
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
        description: selectedSummary,
        order_id: order.orderId,
        prefill: {
          name: form.donorName,
          email: prefillEmail(form.donorEmail),
          contact: form.donorMobile,
        },
        notes: {
          sourcePage: "janmashtami3",
          festivalSlug: "janmashtami",
          legacySevaId: selected.option.legacySevaId,
          sevaName: selected.seva.title,
          sevaOption: selected.option.label,
        },
        handler: async (response: Record<string, string>) => {
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

            if (!verifyResponse.ok) throw new Error("Payment verification failed.");
            window.location.assign(`/payment/thank-you?type=seva&seva=${encodeURIComponent(selected?.seva.title || "Janmashtami seva")}&amount=${finalAmount}&source=${encodeURIComponent("the Janmashtami seva programme")}`);
            setSelected(null);
          } catch (verifyError) {
            setStatus({
              type: "error",
              message: verifyError instanceof Error ? verifyError.message : "Payment verification failed.",
            });
          } finally {
            setSubmitting(false);
          }
        },
        modal: {
          ondismiss: () => setSubmitting(false),
        },
        theme: {
          color: "#772036",
        },
      }).open();
    } catch (err) {
      setStatus({
        type: "error",
        message: err instanceof Error ? err.message : "Donation could not be completed. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const moveSlide = (direction: number) => {
    setActiveSlide((current) => (current + direction + banners.length) % banners.length);
  };

  return (
    <main className="min-h-screen bg-white text-ink">
      <WhatsAppFloatButton />
      {campaigner && (
        <div className="bg-gradient-to-r from-vk-800 via-vk-700 to-vk-600 px-4 py-3 text-center text-white">
          <p className="text-sm md:text-base">
            🙏 You are supporting <span className="font-bold">{campaigner.name}</span>&apos;s Janmashtami seva campaign
            {typeof campaigner.donorCount === "number" && campaigner.donorCount > 0 && (
              <span className="text-white/85"> · {campaigner.donorCount} devotee{campaigner.donorCount === 1 ? "" : "s"} joined · ₹{(campaigner.raisedAmount || 0).toLocaleString("en-IN")} raised</span>
            )}
          </p>
          {campaigner.message && (
            <p className="mt-0.5 font-serif-display text-xs italic text-vk-100 md:text-sm">&ldquo;{campaigner.message}&rdquo;</p>
          )}
        </div>
      )}

      {/* ---------- Hero: campaign banners in an inset rounded card ---------- */}
      <section className="bg-gradient-to-b from-vk-50 to-white pb-4 pt-4 md:pb-6 md:pt-6">
        <div className="vk-container">
          <div className="relative overflow-hidden rounded-3xl bg-vk-900 shadow-[0_24px_60px_-28px_rgba(10,18,51,0.6)]">
            {banners.map((banner, index) => (
              <a
                key={banner.desktop}
                href="#offer-seva"
                className={`block transition-opacity duration-700 ${index === activeSlide ? "relative opacity-100" : "absolute inset-0 opacity-0"}`}
                aria-hidden={index !== activeSlide}
              >
                <picture>
                  <source media="(max-width: 640px)" srcSet={banner.mobile} />
                  <img src={banner.desktop} alt={banner.alt} className="h-auto w-full" />
                </picture>
              </a>
            ))}
            <button
              type="button"
              onClick={() => moveSlide(-1)}
              className="absolute left-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-vk-800 shadow-card backdrop-blur transition hover:bg-white md:flex"
              aria-label="Previous banner"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => moveSlide(1)}
              className="absolute right-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-vk-800 shadow-card backdrop-blur transition hover:bg-white md:flex"
              aria-label="Next banner"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* ---------- Intro + offer card ---------- */}
      <section className="pb-10 pt-6 md:pb-16 md:pt-10">
        <div className="vk-container">
          <Reveal>
            <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr] lg:items-center lg:gap-10">
              <div>
                <span className="vk-pill mb-4">ISKCON Gambheeram Visakhapatnam</span>
                <h1 className="vk-h1">Sri Krishna Janmashtami</h1>
                <p className="vk-lead mt-4 max-w-3xl md:text-lg">
                  This Janmashtami, on the 4th & 5th of September, join the grand celebrations at ISKCON Gambheeram Visakhapatnam.
                  Donate towards any of the sevas listed and receive special prasadam and the unlimited blessings of Lord Krishna.
                </p>
                <p className="mt-5 max-w-3xl border-l-4 border-vk-500 pl-4 font-serif-display text-[15px] italic leading-7 text-vk-700 md:text-base">
                  "Whatever you do, whatever you eat, whatever you offer or give away... do that as an offering to Me." - Bhagavad-gita 9.27
                </p>
              </div>
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-vk-700 via-vk-600 to-vk-500 p-6 text-white shadow-[0_24px_50px_-24px_rgba(30,58,138,0.7)]">
                <div aria-hidden className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10" />
                <div className="relative flex items-start gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15">
                    <ShieldCheck className="h-5 w-5 text-[hsl(var(--gold))]" />
                  </span>
                  <div>
                    <h2 className="font-heading text-lg font-bold text-white">Offer Seva This Janmashtami</h2>
                    <p className="mt-2 text-sm leading-6 text-white/80">
                      Your offering sustains the midnight Abhisheka, the grand Nandotsava feast, and every sacred ritual performed at ISKCON Gambheeram Visakhapatnam on Lord Krishna&apos;s appearance day.
                    </p>
                  </div>
                </div>
                <a href="#offer-seva" className="vk-btn-gold relative mt-5 h-12 w-full text-[15px] font-bold">
                  Offer Seva
                </a>
              </div>
            </div>
          </Reveal>

          {/* ---------- Trust strip ---------- */}
          <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
            {TRUST_BADGES.map((b) => (
              <div key={b.label} className="vk-card flex min-w-0 items-center gap-2.5 p-3 md:gap-3 md:p-4">
                <span className="vk-icon-chip !h-9 !w-9 md:!h-10 md:!w-10">
                  <b.icon className="h-[18px] w-[18px]" />
                </span>
                <span className="min-w-0 break-words text-[12.5px] font-semibold leading-snug text-ink md:text-sm">{b.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .form-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .form-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .form-scroll::-webkit-scrollbar-thumb {
          background: #B9C8FB;
          border-radius: 9999px;
        }
        .form-scroll::-webkit-scrollbar-thumb:hover {
          background: #2F5BD3;
        }
        .form-scroll {
          scrollbar-width: thin;
          scrollbar-color: #B9C8FB transparent;
        }
      `}</style>

      <section id="offer-seva" className="vk-section vk-band">
        <div className="vk-container">
          <Reveal>
            <SectionHeading
              eyebrow="Choose Your Offering"
              title="Janmashtami Sevas"
              subtitle="Select a sacred seva and receive the divine blessings of Lord Krishna"
              align="center"
            />
          </Reveal>

          {/* Seva cards */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {sevas.map((seva, idx) => (
              <motion.article
                key={seva.slug}
                initial={reduce ? undefined : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: reduce ? 0 : (idx % 3) * 0.08 }}
                className="vk-card group flex flex-col overflow-hidden transition-shadow duration-300 hover:shadow-lift"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-vk-100 md:h-52">
                  <Image
                    src={seva.image}
                    alt={seva.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-vk-900/30 to-transparent" />
                </div>

                {/* Card body */}
                <div className="flex flex-1 flex-col p-4 md:p-5">
                  <h3 className="font-heading text-lg font-bold leading-snug text-ink md:text-xl">{seva.title}</h3>
                  <p className="mt-1.5 min-h-[52px] text-[13px] leading-relaxed text-muted-foreground md:text-sm">{seva.description}</p>

                  {/* Elegant price buttons */}
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {seva.options.map((option, optIdx) => {
                      const isCustom = !option.amount;
                      const isTopTier = optIdx === 0;
                      const hasSubtitle = !!option.subtitle;
                      return (
                        <button
                          key={`${seva.slug}-${optIdx}`}
                          type="button"
                          onClick={() => openCheckout(seva, option)}
                          className={`
                            relative min-h-[48px] overflow-hidden rounded-xl border text-center transition-all duration-200
                            ${hasSubtitle ? 'flex flex-col items-center justify-center gap-1 px-3 pb-2 pt-2.5' : 'px-3 py-3'}
                            ${isCustom
                              ? 'col-span-2 border-dashed border-vk-300 bg-white text-[13px] font-semibold text-vk-700 hover:border-vk-500 hover:bg-vk-50'
                              : isTopTier
                                ? 'border-vk-500 bg-vk-50 font-extrabold text-vk-700 ring-2 ring-vk-500/20 hover:bg-vk-100'
                                : 'border-vk-200 bg-white font-extrabold text-vk-700 hover:border-vk-500 hover:bg-vk-50'
                            }
                          `}
                        >
                          {isTopTier && !hasSubtitle && (
                            <span className="absolute left-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[hsl(var(--gold))]">
                              <svg className="h-2.5 w-2.5 text-ink" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.4H22l-6 4.6 2.3 7L12 16.4 5.7 21l2.3-7L2 9.4h7.6z"/></svg>
                            </span>
                          )}
                          <span className={`block ${isTopTier && !hasSubtitle ? 'mt-1' : ''}`}>
                            {option.amount ? (
                              <span className="block leading-tight">
                                <span className="text-[11px] font-semibold text-muted-foreground">₹</span>{' '}
                                <span className="text-[15px] md:text-base">{formatAmount(option.amount)}</span>
                              </span>
                            ) : (
                              <span className="flex items-center justify-center gap-1.5">
                                <svg className="h-3 w-3 text-vk-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                                <span className="text-[13px]">Donate Other Amount</span>
                              </span>
                            )}
                          </span>
                          {hasSubtitle && (
                            <span className="inline-block rounded-full bg-vk-700 px-3 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
                              {option.subtitle}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 md:py-14">
        <div className="vk-container">
          <div className="flex items-start gap-3 rounded-2xl border border-vk-100 bg-vk-50 p-4 text-sm leading-7 text-ink/80 md:p-5 md:text-base">
            <span className="vk-icon-chip hidden !bg-white sm:inline-flex">
              <MessageCircle className="h-5 w-5" />
            </span>
            <p className="min-w-0">
              Gentle Request! While doing Paytm/UPI App Payments or Bank (NEFT/ RTGS), please send us a screenshot along with complete address and PAN details on our Whatsapp Number{" "}
              <a className="font-semibold text-vk-700 underline decoration-vk-300 underline-offset-4 hover:decoration-vk-500" href="tel:+918977761187">+91 89777 61187</a> or to our mail ID{" "}
              <a className="break-all font-semibold text-vk-700 underline decoration-vk-300 underline-offset-4 hover:decoration-vk-500" href="mailto:social@hkmvizag.org">social@hkmvizag.org</a>. You may also call on this number for other queries.
            </p>
          </div>
        </div>
      </section>

      <JanmashtamiImportanceSection />

      <section className="vk-section">
        <div className="vk-container">
          <div className="vk-card p-5 md:p-6">
            <h2 className="vk-h3">Donation Through Bank (NEFT/ RTGS)</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                { label: "Beneficiary Name", value: "HARE KRISHNA MOVEMENT INDIA" },
                { label: "Bank Name", value: "IDFC FIRST BANK LTD" },
                { label: "A/c No", value: "10091415313" },
                { label: "IFSC Code", value: "IDFB0080412" },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center gap-3 rounded-xl bg-vk-50 p-4 text-sm">
                  <div className="min-w-0 flex-1">
                    <span className="block text-xs font-medium text-muted-foreground">{label}:</span>
                    <span className="mt-0.5 block select-all break-words font-semibold text-ink">{value}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(value);
                      setCopiedField(label);
                      setTimeout(() => setCopiedField(null), 1500);
                    }}
                    className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-vk-700 transition-colors hover:bg-vk-100"
                    title={`Copy ${label}`}
                  >
                    {copiedField === label ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <JanmashtamiGallery />

      <section className="vk-section">
        <div className="vk-container grid gap-4 md:grid-cols-2">
          {galleryImages.map((src, index) => (
            <img
              key={src}
              src={src}
              alt={`Sri Krishna Janmashtami seva activity ${index + 1}`}
              className="h-full min-h-[220px] w-full rounded-2xl object-cover shadow-card"
              loading="lazy"
              decoding="async"
            />
          ))}
        </div>
      </section>

      <footer className="relative overflow-hidden bg-gradient-to-b from-vk-800 to-vk-900 text-white">
        <div className="vk-container relative pb-8 pt-14 md:pt-16">
          {/* Top devotional strip */}
          <div className="mb-12 text-center">
            <p className="font-serif-display text-lg italic leading-relaxed text-white/90 md:text-xl">
              &ldquo;Hare Krishna Hare Krishna, Krishna Krishna Hare Hare&rdquo;
            </p>
            <p className="font-serif-display text-lg italic leading-relaxed text-white/90 md:text-xl">&ldquo;Hare Rama Hare Rama, Rama Rama Hare Hare&rdquo;</p>
          </div>

          {/* Main grid */}
          <div className="grid gap-10 md:grid-cols-12">
            {/* Brand column */}
            <div className="md:col-span-4">
              <div>
                <p className="font-heading text-xl font-bold text-white">Hare Krishna Movement</p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.24em] text-white/50">Visakhapatnam</p>
              </div>
              <p className="mt-6 text-sm leading-7 text-white/70">
                Giving human society an opportunity for a life of happiness, good health, peace of mind, and all good qualities through God Consciousness.
              </p>

              {/* Social icons */}
              <div className="mt-6 flex items-center gap-3">
                {[
                  { icon: Facebook, href: "https://www.facebook.com/hkm.vizag", label: "Facebook" },
                  { icon: Youtube, href: "https://www.youtube.com/user/harekrishnavizag", label: "YouTube" },
                  { icon: Instagram, href: "https://www.instagram.com/hare_krishna_vizag/", label: "Instagram" },
                  { icon: MessageCircle, href: "https://wa.me/918977761187", label: "WhatsApp" },
                ].map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 transition-all hover:-translate-y-0.5 hover:bg-white/15 hover:text-white"
                  >
                    <s.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="md:col-span-3">
              <h3 className="mb-5 text-[11px] font-bold uppercase tracking-[0.2em] text-vk-300">
                Explore
              </h3>
              <ul className="space-y-3 text-sm text-white/70">
                {[
                  { label: "Hare Krishna Movement", href: "/about" },
                  { label: "Contact Us", href: "/contact" },
                  { label: "Subhojanam", href: "/subhojanam" },
                  { label: "Terms & Conditions", href: "/terms-and-conditions" },
                  { label: "Refund Policy", href: "/refund-policy" },
                  { label: "Privacy Policy", href: "/privacy-policy" },
                ].map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="group inline-flex items-center gap-2 transition-colors hover:text-white">
                      <span className="h-1 w-1 rounded-full bg-vk-400 transition-all group-hover:w-3 group-hover:bg-white" />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div className="md:col-span-5">
              <h3 className="mb-5 text-[11px] font-bold uppercase tracking-[0.2em] text-vk-300">
                Visit &amp; Reach Us
              </h3>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-vk-300" />
                  <div className="text-sm leading-6 text-white/75">
                    <p className="font-semibold text-white">Hare Krishna Movement</p>
                    <p className="mt-1 text-white/65">
                      Chaitanya Bhavan, Hare Krishna Vaikuntam Cultural Centre,<br />
                      SIIM Rd, opp. Akshaya Patra Foundation, Gambhiram,<br />
                      Visakhapatnam, Andhra Pradesh 531163
                    </p>
                  </div>
                </div>

                <div className="my-4 h-px bg-white/10" />

                <div className="grid gap-3 sm:grid-cols-2">
                  <a href="tel:+918977761187" className="group flex items-center gap-2.5 text-sm text-white/75 transition-colors hover:text-white">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 transition-colors group-hover:bg-white/20">
                      <Phone className="h-3.5 w-3.5 text-vk-200" />
                    </span>
                    <span className="font-medium">+91 89777 61187</span>
                  </a>
                  <a href="mailto:social@hkmvizag.org" className="group flex items-center gap-2.5 text-sm text-white/75 transition-colors hover:text-white">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 transition-colors group-hover:bg-white/20">
                      <Mail className="h-3.5 w-3.5 text-vk-200" />
                    </span>
                    <span className="font-medium">social@hkmvizag.org</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 border-t border-white/10 pt-6">
            <div className="flex flex-col items-center justify-between gap-3 text-center text-xs text-white/50 md:flex-row md:text-left">
              <p>&copy; 2026 Hare Krishna Movement Visakhapatnam. All rights reserved.</p>
              <p className="flex items-center gap-1.5">
                Crafted with <Heart className="h-3 w-3 fill-[hsl(var(--gold))] text-[hsl(var(--gold))]" /> for Sri Krishna Janmashtami
              </p>
            </div>
          </div>
        </div>
      </footer>

      {status.message && !selected && (
        <div className={`fixed bottom-6 left-1/2 z-[120] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-xl px-5 py-3 text-center text-sm font-semibold shadow-lift ${
          status.type === "success" ? "bg-green-700 text-white" : "bg-red-700 text-white"
        }`}>
          {status.message}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-vk-900/70 backdrop-blur-sm sm:items-center sm:p-4">
          <div className="form-scroll relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl">
            {/* Form content */}
            <div className="relative z-10">
              <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-vk-100 bg-white/95 px-5 py-4 backdrop-blur md:px-6">
                <div className="min-w-0">
                  <span className="vk-pill-soft mb-1.5">Janmashtami Checkout</span>
                  <h2 className="vk-h3">{selected.seva.title}</h2>
                </div>
                <button type="button" onClick={closeCheckout} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-vk-50 text-vk-700 transition hover:bg-vk-100" aria-label="Close checkout">
                  <X className="h-5 w-5" />
                </button>
              </div>

            <form onSubmit={submitDonation} className="space-y-5 p-5 md:p-6">
              <div className="grid gap-4 rounded-2xl bg-vk-50 p-4 md:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">Seva Name</p>
                  <p className="mt-1 font-heading font-bold text-ink">{selected.seva.title}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">Seva Amount</p>
                  <p className="mt-1 font-heading text-lg font-extrabold text-vk-700">
                    {selected.option.amount ? `₹${formatAmount(selected.option.amount)}` : "Enter amount below"}
                  </p>
                </div>
              </div>

              {!selected.option.amount && (
                <label className="block">
                  <span className={labelCls}>Enter Seva Amount *</span>
                  <Input
                    type="number"
                    min={100}
                    value={form.customAmount}
                    onChange={(event) => updateForm({ customAmount: event.target.value, want80G: false, wantPrasadam: false })}
                    placeholder="Enter amount"
                    className={fieldCls}
                  />
                  <span className="mt-1 block text-xs text-muted-foreground">Amount must be at least Rs.100.</span>
                </label>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className={labelCls}>Donor Name *</span>
                  <Input value={form.donorName} maxLength={39} onChange={(event) => updateForm({ donorName: event.target.value.replace(/[^a-zA-Z ]/g, "") })} placeholder="Your Name" className={fieldCls} />
                </label>
                <label className="block">
                  <span className={labelCls}>Mobile Number *</span>
                  <Input value={form.donorMobile} maxLength={10} onChange={(event) => updateForm({ donorMobile: event.target.value.replace(/\D/g, "") })} placeholder="Your Mobile Number" className={fieldCls} />
                </label>
                <label className="block md:col-span-2">
                  <span className={labelCls}>E-Mail ID (optional)</span>
                  <Input type="email" value={form.donorEmail} onChange={(event) => updateForm({ donorEmail: event.target.value.toLowerCase() })} placeholder="Your Email" className={fieldCls} />
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

              <div className="space-y-3">
                {showPrasadamField && (
                  <label className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-vk-100 bg-vk-50/60 px-3.5 py-3 text-[13px] font-medium text-ink">
                    <input type="checkbox" checked={form.wantPrasadam} onChange={(event) => {
                    const next = event.target.checked;
                    updateForm({ wantPrasadam: next });
                    handlePrasadamToggle(next);
                  }} className="mt-0.5 h-4 w-4 shrink-0 accent-vk-700" />
                    I would like to receive Maha Prasadam (Only within India)
                  </label>
                )}
                {showTaxField && (
                  <label className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-vk-100 bg-vk-50/60 px-3.5 py-3 text-[13px] font-medium text-ink">
                    <input type="checkbox" checked={form.want80G} onChange={(event) => {
                    const next = event.target.checked;
                    updateForm({ want80G: next });
                    handle80GToggle(next);
                  }} className="mt-0.5 h-4 w-4 shrink-0 accent-vk-700" />
                    <span>
                      I wish to receive 80G Tax Exemption
                      <span className="mt-1 block text-xs font-normal text-muted-foreground">PAN and address are mandatory when 80G is selected.</span>
                    </span>
                  </label>
                )}
              </div>

              {form.want80G && (
                <label className="block">
                  <span className={labelCls}>PAN Number *</span>
                  <Input value={form.panNumber} maxLength={10} onChange={(event) => updateForm({ panNumber: event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "") })} placeholder="Eg: ABCDE1234F" className={fieldCls} />
                </label>
              )}

              {needsAddress && (
                <div className="grid gap-4 rounded-2xl border border-vk-100 bg-vk-50/60 p-4 md:grid-cols-2">
                  <label className="block">
                    <span className={labelCls}>House No/Door No</span>
                    <Input value={form.doorNo} maxLength={39} onChange={(event) => updateForm({ doorNo: event.target.value })} className={fieldCls} />
                  </label>
                  <label className="block">
                    <span className={labelCls}>House/Apartment/Building Name</span>
                    <Input value={form.building} maxLength={39} onChange={(event) => updateForm({ building: event.target.value })} className={fieldCls} />
                  </label>
                  <label className="block">
                    <span className={labelCls}>Street Name</span>
                    <Input value={form.street} maxLength={39} onChange={(event) => updateForm({ street: event.target.value })} className={fieldCls} />
                  </label>
                  <label className="block">
                    <span className={labelCls}>Location/Area *</span>
                    <Input value={form.area} maxLength={39} onChange={(event) => updateForm({ area: event.target.value })} className={fieldCls} />
                  </label>
                  <label className="block">
                    <span className={labelCls}>PIN Code *</span>
                    <Input value={form.pincode} maxLength={6} onChange={(event) => updateForm({ pincode: event.target.value.replace(/\D/g, "") })} className={fieldCls} />
                  </label>
                  <label className="block">
                    <span className={labelCls}>City *</span>
                    <Input value={form.city} maxLength={30} onChange={(event) => updateForm({ city: event.target.value.toUpperCase().replace(/[^A-Z ]/g, "") })} className={fieldCls} />
                  </label>
                  <label className="block md:col-span-2">
                    <span className={labelCls}>State *</span>
                    <Input value={form.state} maxLength={30} onChange={(event) => updateForm({ state: event.target.value.toUpperCase().replace(/[^A-Z ]/g, "") })} className={fieldCls} />
                  </label>
                </div>
              )}

              {status.type === "error" && <p className="rounded-xl bg-red-50 px-3.5 py-2.5 text-[13px] font-medium text-red-700">{status.message}</p>}

              <button type="submit" disabled={submitting} className="vk-btn-gold h-12 w-full text-[15px] font-bold">
                <Heart className="h-4 w-4 fill-current" />
                {submitting ? "Opening Checkout..." : `Donate Rs. ${formatAmount(finalAmount || 0)}`}
              </button>
            </form>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
