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
import { motion } from "framer-motion";
import { Sparkles, CalendarDays, ArrowRight } from "lucide-react";
import Ornament from "@/components/Ornament";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "") || "http://localhost:8080";

/**
 * Real festival donation pages on the site. The generic /festival/<slug>
 * route was removed to keep the bundle lean, so each campaign slug must map
 * to an actual page here — add a new entry when a campaign is added.
 */
const FESTIVAL_PAGE: Record<string, string> = {
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
    <section
      className={`${isHome ? "bg-gradient-navy" : "bg-white dark:bg-background"} py-12 md:py-16`}
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center"
        >
          <p className={`mb-2.5 text-xs font-semibold uppercase tracking-[0.2em] ${isHome ? "text-gold" : "text-primary"}`}>
            Festival Donations
          </p>
          <Ornament className="mb-4" />
          <h2
            className={`font-heading text-[27px] font-extrabold tracking-tight md:text-[34px] ${
              isHome ? "text-white" : "text-foreground"
            }`}
          >
            Festival Sevas
          </h2>
          <p className={`mx-auto mt-2.5 max-w-xl text-sm md:text-[15px] ${isHome ? "text-white/70" : "text-muted-foreground"}`}>
            Offer your seva during the festivals being celebrated and become part of the divine pastime.
          </p>
        </motion.div>

        <div className="mx-auto grid max-w-6xl gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {visible.map((c, i) => (
            <motion.div
              key={c.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: Math.min(i, 5) * 0.06, duration: 0.45 }}
            >
              <Link
                href={FESTIVAL_PAGE[c.slug]}
                className={`group relative block aspect-[3/2] overflow-hidden rounded-3xl border shadow-warm transition-all duration-300 hover:-translate-y-2 hover:shadow-elevated ${
                  isHome ? "border-white/15" : "border-border"
                }`}
              >
                {c.images?.[0] ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={c.images[0]}
                    alt={c.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-muted">
                    <Sparkles className="h-10 w-10 text-primary/30" />
                  </div>
                )}

                {/* Scrim so the bottom text always stays readable. */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                {/* Top chips */}
                <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3 md:p-4">
                  <span className="inline-flex items-center gap-1 rounded-full bg-black/45 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white/90 backdrop-blur-sm">
                    <CalendarDays className="h-3 w-3" />
                    {(() => {
                      const d = formatEventDate(c.meta?.eventDate);
                      return d ? `${d.day} ${d.month} ${d.year}` : "Save the date";
                    })()}
                  </span>
                  <span className="rounded-full bg-gold px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[hsl(220,60%,12%)]">
                    Festival Seva
                  </span>
                </div>

                {/* Bottom content */}
                <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
                  <h3 className="line-clamp-2 font-heading text-lg font-bold leading-snug text-white md:text-xl">
                    {c.title}
                  </h3>
                  {c.description && (
                    <p className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-white/75">
                      {c.description}
                    </p>
                  )}
                  {sevas(c).length > 0 && (
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {sevas(c).map((s) => (
                        <span
                          key={s.label}
                          className="rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-semibold text-gold backdrop-blur-sm"
                        >
                          {s.amount
                            ? `${s.label} · ₹${s.amount.toLocaleString("en-IN")}`
                            : s.label}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Hover donate pill */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-gold px-5 py-2.5 text-[13px] font-bold text-[hsl(220,60%,12%)] shadow-gold">
                    Donate Now <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}