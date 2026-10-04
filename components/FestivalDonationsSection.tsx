"use client";

/**
 * Festival Donations section — used on the home page, the /donations page and
 * the /donate page. Lists active festival donation campaigns (server:
 * festivalDonation records, served by /festival-donations/all) as poster cards
 * matching the /donate seva card style, each linking straight to its real
 * festival donation page (e.g. /radhashtami, /govardhan-puja, /ekadashi).
 *
 * Only campaigns with a known real page are rendered — anything else is
 * skipped so we never link to the removed generic /festival/<slug> route.
 * When there are no matching campaigns the whole section renders nothing.
 *
 * `variant` picks the two skins:
 *   - "home"      — dark gradient band matching the home page's sections
 *   - "donations" — lighter band for the standalone donations / donate pages
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import SectionHeading from "@/components/site/SectionHeading";
import { Sparkles, CalendarDays, ArrowRight } from "lucide-react";
import Reveal from "@/components/site/Reveal";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "") || "http://localhost:8080";

/**
 * Real festival donation pages on the site. The generic /festival/<slug>
 * route was removed to keep the bundle lean, so each campaign slug must map
 * to an actual page here — add a new entry when a campaign is added.
 */
export const FESTIVAL_PAGE: Record<string, string> = {
  radhashtami: "/radhashtami",
  "govardhan-puja": "/govardhan-puja",
  ekadashi: "/ekadashi",
};

interface FestivalDonationCampaign {
  _id?: string;
  slug: string;
  title: string;
  description?: string;
  images?: string[];
  active?: boolean;
  donationOptions?: { label?: string; amount?: number }[];
  meta?: Record<string, unknown>;
}

function formatEventDate(value: unknown): { day: number; month: string; year: number } | null {
  if (typeof value !== "string" || !value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return {
    day: d.getDate(),
    month: d.toLocaleString("en-US", { month: "short" }),
    year: d.getFullYear(),
  };
}

export default function FestivalDonationsSection({
  variant = "home",
  limit = 6,
}: {
  variant?: "home" | "donations";
  limit?: number;
}) {
  const [campaigns, setCampaigns] = useState<FestivalDonationCampaign[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_URL}/festival-donations/all`, { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (cancelled) return;
        // The public endpoint returns a bare array; a stray
        // { message: "Currently there are no festivals" } object when empty.
        const list: FestivalDonationCampaign[] = Array.isArray(data) ? data : [];
        setCampaigns(
          list.filter(
            (c) =>
              c &&
              c.slug &&
              c.title &&
              c.active !== false &&
              !!FESTIVAL_PAGE[c.slug]
          )
        );
      })
      .catch(() => {
        if (!cancelled) setCampaigns([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Still loading → show nothing rather than a spinner flash; the section is
  // a promotional extra, not critical content.
  if (!campaigns || campaigns.length === 0) return null;

  const visible = campaigns.slice(0, limit);
  const isHome = variant === "home";

  const sevas = (c: FestivalDonationCampaign) =>
    (c.donationOptions || [])
      .filter((o) => o?.label)
      .slice(0, 3)
      .map((o) => ({ label: o.label as string, amount: o.amount }));

  return (
    <section className={`vk-section ${isHome ? "bg-gradient-navy" : "vk-band"}`}>
      <div className="vk-container">
        <SectionHeading
          align="center"
          light={isHome}
          eyebrow="Festival Donations"
          title="Festival Sevas"
          subtitle="Offer your seva during the festivals being celebrated and become part of the divine pastime."
        />

        <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-3">
          {visible.map((c, i) => (
            <Reveal key={c.slug} delay={Math.min(i, 5) * 0.06}>
              <Link
                href={FESTIVAL_PAGE[c.slug]}
                className="vk-card vk-card-hover group block h-full overflow-hidden"
              >
                {/* Banner — the photo sits on top, uncluttered by text. */}
                <div className="relative aspect-[3/2] overflow-hidden bg-vk-100">
                  {c.images?.[0] ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={c.images[0]}
                      alt={c.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-vk-50">
                      <Sparkles className="h-10 w-10 text-vk-300" />
                    </div>
                  )}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-vk-900/45 via-transparent to-transparent" />

                  {/* Top chips */}
                  <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-vk-800 shadow">
                      <CalendarDays className="h-3 w-3" />
                      {(() => {
                        const d = formatEventDate(c.meta?.eventDate);
                        return d ? `${d.day} ${d.month} ${d.year}` : "Save the date";
                      })()}
                    </span>
                    <span className="vk-pill !px-2.5 !py-1 !text-[10px]">
                      <Sparkles className="h-3 w-3" /> Festival Seva
                    </span>
                  </div>
                </div>

                {/* Content below the banner. */}
                <div className="flex flex-col p-4 md:p-5">
                  <h3 className="line-clamp-2 text-lg font-bold leading-snug text-ink md:text-xl">{c.title}</h3>
                  {c.description && (
                    <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-muted-foreground">
                      {c.description}
                    </p>
                  )}
                  {sevas(c).length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {sevas(c).map((s) => (
                        <span
                          key={s.label}
                          className="rounded-full bg-vk-100 px-2.5 py-1 text-[11px] font-semibold text-vk-700"
                        >
                          {s.amount ? `${s.label} · ₹${s.amount.toLocaleString("en-IN")}` : s.label}
                        </span>
                      ))}
                    </div>
                  )}
                  <span className="vk-btn-gold mt-4 w-full">
                    Donate Now <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
