"use client";

/**
 * Festival Donations section — used on the home page and the /donations
 * page. Lists the festival donation campaigns the admin has created
 * (server: festivalDonation records, served by /festival-donations/all)
 * with a Donate button that links to the campaign's own donation page at
 * /festival/<slug>.
 *
 * Renders nothing at all when there are no active campaigns, so the host
 * page never shows an empty section. `variant` picks the two skins:
 *   - "home"      — dark gradient band matching the home page's sections
 *   - "donations" — lighter card look for the standalone donations page
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, CalendarDays, ArrowRight } from "lucide-react";
import Ornament from "@/components/Ornament";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "") || "http://localhost:8080";

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
        setCampaigns(list.filter((c) => c && c.slug && c.title && c.active !== false));
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

  const sevaChips = (c: FestivalDonationCampaign) =>
    (c.donationOptions || [])
      .filter((o) => o?.label)
      .slice(0, 3)
      .map((o) => o.label as string);

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
            Sevas for the Current Festival
          </h2>
          <p className={`mx-auto mt-2.5 max-w-xl text-sm md:text-[15px] ${isHome ? "text-white/70" : "text-muted-foreground"}`}>
            The festival now being celebrated — offer your seva and be part of the celebration.
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
              className={`group flex h-full flex-col overflow-hidden rounded-[20px] border transition-all duration-300 hover:-translate-y-1.5 ${
                isHome
                  ? "border-white/10 bg-white/[0.04] hover:border-gold/40"
                  : "border-border bg-card hover:border-primary/35 hover:shadow-elevated"
              }`}
            >
              <Link href={`/festival/${c.slug}`} className="relative block aspect-[16/9] overflow-hidden bg-primary/5">
                {c.images?.[0] ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={c.images[0]}
                    alt={c.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                  />
                ) : (
                  <div className={`flex h-full w-full items-center justify-center ${isHome ? "bg-white/5" : "bg-muted"}`}>
                    <Sparkles className={`h-10 w-10 ${isHome ? "text-gold/40" : "text-primary/30"}`} />
                  </div>
                )}
              </Link>

              <div className={`flex flex-1 flex-col gap-2 p-5`}>
                <Link href={`/festival/${c.slug}`}>
                  <h3
                    className={`line-clamp-2 min-h-[43px] font-heading text-[16.5px] font-bold leading-snug transition-colors ${
                      isHome ? "text-white hover:text-gold" : "text-foreground hover:text-primary"
                    }`}
                  >
                    {c.title}
                  </h3>
                </Link>
                {c.description && (
                  <p className={`line-clamp-2 text-[12.5px] leading-relaxed ${isHome ? "text-white/65" : "text-muted-foreground"}`}>
                    {c.description}
                  </p>
                )}
                {sevaChips(c).length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {sevaChips(c).map((label) => (
                      <span
                        key={label}
                        className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${
                          isHome ? "bg-white/10 text-gold" : "bg-primary/10 text-primary"
                        }`}
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                )}
                <div className={`mt-auto flex items-center justify-between border-t pt-3.5 ${isHome ? "border-white/10" : "border-border"}`}>
                  <Link
                    href={`/festival/${c.slug}`}
                    className="inline-flex items-center gap-1.5 rounded-full bg-gradient-gold px-4 py-2 text-[12px] font-bold text-[hsl(220,60%,12%)] shadow-gold transition-transform hover:-translate-y-0.5"
                  >
                    Donate Now <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <CalendarDays className={`h-4 w-4 ${isHome ? "text-white/40" : "text-muted-foreground"}`} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
