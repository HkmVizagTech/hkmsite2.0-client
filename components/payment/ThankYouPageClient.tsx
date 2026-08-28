"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Share2, Home, Heart, RefreshCw } from "lucide-react";

// Sanskrit verses for different seva types — shown based on what was donated
const VERSES: Record<string, { verse: string; translation: string; attribution: string }> = {
  "Anna Daan Seva": {
    verse: "अन्नदाता सुखी भव",
    translation: "May the one who gives food be blessed with happiness",
    attribution: "Ancient Sanskrit blessing",
  },
  "Gau Seva": {
    verse: "गावो विश्वस्य मातरः",
    translation: "The cow is the mother of the universe",
    attribution: "Vedic tradition",
  },
  default: {
    verse: "यत्करोषि यदश्नासि यज्जुहोषि ददासि यत् । यत्तपस्यसि कौन्तेय तत्कुरुष्व मदर्पणम् ॥",
    translation:
      "Whatever you do, whatever you eat, whatever you offer in sacrifice, whatever you give away, and whatever austerities you perform — do that as an offering unto Me.",
    attribution: "Bhagavad-gītā 9.27",
  },
  "Janmashtami": {
    verse: "जन्म कर्म च मे दिव्यमेवं यो वेत्ति तत्त्वतः",
    translation: "One who knows the transcendental nature of My appearance and activities does not, upon leaving the body, take his birth again in this material world",
    attribution: "Bhagavad-gītā 4.9",
  },
};

function getVerse(sevaName: string) {
  for (const [key, val] of Object.entries(VERSES)) {
    if (key !== "default" && sevaName.toLowerCase().includes(key.toLowerCase())) return val;
  }
  return VERSES.default;
}

function formatAmount(amount: string | null) {
  if (!amount) return null;
  const n = Number(amount);
  if (!Number.isFinite(n)) return null;
  return `₹${n.toLocaleString("en-IN")}`;
}

export default function ThankYouPageClient() {
  const searchParams = useSearchParams();
  const sevaName = searchParams.get("seva") || searchParams.get("title") || "your offering";
  const amount = searchParams.get("amount");
  const source = searchParams.get("source") || "our temple services";
  const recurring = searchParams.get("recurring") === "1";

  const formattedAmount = formatAmount(amount);
  const verse = getVerse(sevaName);

  const [copied, setCopied] = useState(false);
  const [petals, setPetals] = useState<{ id: number; left: number; delay: number; duration: number; size: number }[]>([]);

  // Falling flower petals — gentle, not distracting
  useEffect(() => {
    setPetals(
      Array.from({ length: 12 }, (_, i) => ({
        id: i,
        left: 5 + Math.random() * 90,
        delay: Math.random() * 4,
        duration: 4 + Math.random() * 4,
        size: 8 + Math.random() * 8,
      }))
    );
  }, []);

  const shareMessage = `Hare Krishna! 🙏\n\nI just offered ${formattedAmount ? formattedAmount + " for " : ""}${sevaName} at Hare Krishna Movement Visakhapatnam.\n\nJoin me in this seva:\nhttps://www.harekrishnavizag.org/donate`;

  const shareWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareMessage)}`, "_blank");
  };

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "I offered a seva at HKM Vizag", text: shareMessage });
      } catch {}
    } else {
      await navigator.clipboard.writeText(shareMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#fefaf0] text-slate-900">
      {/* Falling petals */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        {petals.map((p) => (
          <div
            key={p.id}
            className="absolute top-0 animate-fall rounded-full opacity-60"
            style={{
              left: `${p.left}%`,
              width: p.size,
              height: p.size,
              background: "radial-gradient(circle at 40% 35%, #f9c97c, #e07b39)",
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Top lotus motif strip */}
      <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-orange-400 to-amber-500" />

      <div className="relative mx-auto max-w-2xl px-4 py-14 md:py-20">

        {/* Main card */}
        <div className="relative overflow-hidden rounded-3xl border border-amber-200 bg-white shadow-2xl shadow-amber-100">

          {/* Decorative gold arc at top */}
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400" />

          {/* OM symbol watermark */}
          <div className="pointer-events-none absolute right-4 top-4 select-none font-serif text-7xl font-bold leading-none text-amber-100 md:text-9xl" aria-hidden>
            ॐ
          </div>

          <div className="relative px-8 py-10 text-center md:px-12 md:py-14">

            {/* Success icon */}
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-200">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>

            {/* Eyebrow */}
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.35em] text-amber-600">
              Hare Krishna 🙏
            </p>

            {/* Headline */}
            <h1 className="mb-2 font-heading text-3xl font-bold text-slate-900 md:text-4xl">
              Your Seva Is Offered
            </h1>
            <p className="mb-7 text-base text-slate-500 md:text-lg">
              {recurring
                ? "Your monthly seva has been set up. May Krishna bless you every month."
                : "Thank you for your heartfelt offering to Sri Sri Radha Damodar."}
            </p>

            {/* Summary card */}
            {(formattedAmount || sevaName) && (
              <div className="mb-8 rounded-2xl border border-amber-100 bg-amber-50 px-6 py-5 text-left">
                <p className="mb-3 text-xs font-bold uppercase tracking-widest text-amber-700">
                  Offering Summary
                </p>
                <div className="space-y-2">
                  {sevaName && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">Seva</span>
                      <span className="text-sm font-semibold text-slate-800">{sevaName}</span>
                    </div>
                  )}
                  {formattedAmount && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">Amount</span>
                      <span className="text-lg font-bold text-amber-700">{formattedAmount}</span>
                    </div>
                  )}
                  {recurring && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">Frequency</span>
                      <span className="text-sm font-semibold text-green-700">Monthly</span>
                    </div>
                  )}
                </div>
                {/* WhatsApp receipt notice */}
                <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-green-50 border border-green-100 px-3.5 py-3">
                  <svg viewBox="0 0 24 24" fill="#25D366" className="h-5 w-5 shrink-0 mt-0.5">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.978-1.355A9.945 9.945 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.946 7.946 0 01-4.078-1.121l-.29-.173-3.018.82.838-2.954-.19-.303A7.96 7.96 0 014 12c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8z"/>
                  </svg>
                  <p className="text-xs leading-relaxed text-green-800">
                    Your receipt has been sent to your WhatsApp. Check your messages from <span className="font-semibold">HKM Vizag</span> for the 80G certificate and receipt details.
                  </p>
                </div>
              </div>
            )}

            {/* Sanskrit verse */}
            <div className="mb-8 rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 px-6 py-5">
              <p className="mb-2 font-serif text-base italic leading-relaxed text-slate-700 md:text-lg">
                "{verse.verse}"
              </p>
              <p className="mb-1 text-sm text-slate-600">{verse.translation}</p>
              <p className="text-xs font-medium text-amber-600">{verse.attribution}</p>
            </div>

            {/* Share section */}
            <div className="mb-8">
              <p className="mb-3 text-sm font-medium text-slate-600">
                Inspire others to offer seva too
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={shareWhatsApp}
                  className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1da851]"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.978-1.355A9.945 9.945 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.946 7.946 0 01-4.078-1.121l-.29-.173-3.018.82.838-2.954-.19-.303A7.96 7.96 0 014 12c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8z"/>
                  </svg>
                  Share on WhatsApp
                </button>
                <button
                  onClick={shareNative}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  {copied ? (
                    <><RefreshCw className="h-4 w-4 text-green-600" /><span className="text-green-700">Copied!</span></>
                  ) : (
                    <><Share2 className="h-4 w-4" />Share</>
                  )}
                </button>
              </div>
            </div>

            {/* Nav links */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-amber-200 transition hover:opacity-90"
              >
                <Home className="h-4 w-4" />
                Return Home
              </Link>
              <Link
                href="/donate"
                className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white px-6 py-3 text-sm font-semibold text-amber-700 transition hover:bg-amber-50"
              >
                <Heart className="h-4 w-4 fill-amber-500 text-amber-500" />
                Offer Another Seva
              </Link>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <p className="mt-8 text-center text-xs text-slate-400">
          Hare Krishna Movement Visakhapatnam · ISKCON Gambheeram ·{" "}
          <a href="mailto:social@hkmvizag.org" className="underline underline-offset-2">
            social@hkmvizag.org
          </a>
        </p>
      </div>

      <style>{`
        @keyframes fall {
          0%   { transform: translateY(-20px) rotate(0deg);   opacity: 0; }
          10%  { opacity: 0.6; }
          90%  { opacity: 0.4; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
        .animate-fall { animation: fall linear infinite; }
      `}</style>
    </main>
  );
}
