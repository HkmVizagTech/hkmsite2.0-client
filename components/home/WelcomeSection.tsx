"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Play, X } from "lucide-react";
import Reveal from "@/components/site/Reveal";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "") || "http://localhost:8080";

const DEFAULT_BODY =
  "Following in the footsteps of our revered Founder-Acharya Srila Prabhupada, ISKCON Visakhapatnam — Hare Krishna Movement India (HKMI) — has been conducting spiritual, educational and cultural activities in Gambheeram since 2008, bringing about physical, emotional and spiritual well-being.";

// Monthly temple update video already featured on the construction section.
const FEATURE_VIDEO_ID = "mPAt0gb__Hw";

const stats = [
  { value: "2008", label: "Serving since" },
  { value: "2 Lakh+", label: "Meals daily" },
  { value: "21+", label: "Festivals a year" },
];

/** GVD "Hidden Treasure" split: copy on the left, circular deity photo with a blob ring and a play button on the right. */
export default function WelcomeSection() {
  const [heading, setHeading] = useState("");
  const [body, setBody] = useState("");
  const [videoOpen, setVideoOpen] = useState(false);
  const [videoId, setVideoId] = useState(FEATURE_VIDEO_ID);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_URL}/site-content`);
        if (res.ok) {
          const data = await res.json();
          setHeading(data.content?.about?.heading || "");
          setBody(data.content?.about?.body || "");
          const vid = data.content?.construction?.videoId;
          if (typeof vid === "string" && vid) setVideoId(vid);
        }
      } catch {}
    })();
  }, []);

  return (
    <section id="about" className="vk-section overflow-hidden">
      <div className="vk-container grid items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <Reveal>
          <span className="vk-pill mb-4">Welcome to Hare Krishna Vaikuntham</span>
          <h1 className="vk-h1 !text-[2rem] md:!text-[2.9rem]">
            {heading || (
              <>
                ISKCON Gambheeram — <span className="text-vk-600">Visakhapatnam&apos;s home</span> of Krishna bhakti
              </>
            )}
          </h1>
          <p className="vk-lead mt-5">{body || DEFAULT_BODY}</p>
          <p className="vk-lead mt-3">
            HKMI draws on the timeless wisdom of the Vedic scriptures to answer life&apos;s deepest questions —
            offering kirtan, prasadam, Bhagavad-gita classes and seva so that every visitor can experience the joy
            of devotion.
          </p>
          <blockquote className="mt-6 border-l-4 border-vk-500 pl-4">
            <p className="font-serif-display text-lg italic text-ink">
              &ldquo;If you want peace, then you must develop Krishna consciousness. This is the only way.&rdquo;
            </p>
            <cite className="mt-1 block text-xs font-semibold not-italic uppercase tracking-[0.14em] text-vk-600">
              — Srila Prabhupada
            </cite>
          </blockquote>

          <div className="mt-7 grid max-w-md grid-cols-3 gap-3">
            {stats.map((s) => (
              <div key={s.label} className="rounded-2xl border border-vk-100 bg-vk-50 px-3 py-3 text-center">
                <p className="text-xl font-extrabold text-vk-700 md:text-2xl" style={{ fontFamily: "var(--font-heading)" }}>
                  {s.value}
                </p>
                <p className="text-[11px] font-medium text-ink/60">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/about" className="vk-btn-primary">
              Discover More <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/daily-schedule" className="vk-btn-outline">
              Plan your visit
            </Link>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="relative mx-auto w-full max-w-[460px]">
          {/* Blob rings */}
          <div aria-hidden className="absolute -inset-6 animate-blob bg-gradient-to-br from-vk-300/60 via-vk-200/50 to-vk-100/30" />
          <div aria-hidden className="absolute -inset-2 animate-blob bg-vk-500/25 [animation-delay:-4s]" />
          <div className="relative aspect-square overflow-hidden rounded-full border-[6px] border-white shadow-[0_30px_60px_-24px_rgba(30,58,138,0.55)]">
            <Image
              src="/assets/home-gallery-radha-krishna.webp"
              alt="Sri Sri Radha Madan Mohan at Hare Krishna Vaikuntham, Visakhapatnam"
              fill
              sizes="(min-width: 1024px) 460px, 90vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-vk-900/30 to-transparent" />
          </div>
          <button
            type="button"
            onClick={() => setVideoOpen(true)}
            aria-label="Play temple video"
            className="absolute bottom-[12%] left-[6%] flex h-16 w-16 items-center justify-center rounded-full bg-white text-vk-700 shadow-xl ring-8 ring-white/40 transition-transform hover:scale-105"
          >
            <Play className="ml-1 h-6 w-6 fill-current" />
          </button>
          <div className="absolute -right-1 top-[10%] rounded-2xl bg-white px-4 py-3 text-center shadow-xl">
            <p className="text-2xl font-extrabold leading-none text-vk-700" style={{ fontFamily: "var(--font-heading)" }}>
              18+
            </p>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-ink/55">Years of seva</p>
          </div>
        </Reveal>
      </div>

      {videoOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Temple video"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-vk-900/90 p-4"
          onClick={() => setVideoOpen(false)}
        >
          <button type="button" aria-label="Close video" className="absolute right-5 top-5 text-white/80 hover:text-white">
            <X className="h-8 w-8" />
          </button>
          <div className="aspect-video w-full max-w-4xl overflow-hidden rounded-2xl bg-black" onClick={(e) => e.stopPropagation()}>
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
              title="Hare Krishna Vaikuntham temple video"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              className="h-full w-full"
            />
          </div>
        </div>
      )}
    </section>
  );
}
