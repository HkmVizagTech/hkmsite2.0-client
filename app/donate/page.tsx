"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Heart, Users, TrendingUp, ShieldCheck, Sparkles,
  Gift, Award, Crown, ArrowRight,
} from "lucide-react";
import PageLayout from "@/components/PageLayout";
import Ornament from "@/components/Ornament";
import { sevas, getSevaHref } from "@/lib/sevaConfig";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "") || "http://localhost:8080";

interface OverviewStats {
  totalAmount: number;
  donorCount: number;
  bySeva: Record<string, { totalAmount: number; donorCount: number }>;
  donors: { name: string; amount: number; seva: string; time: string }[];
}

interface SqftStats {
  pricePerSqft: number;
  goalSqft: number;
  sqftRaised: number;
  totalAmount: number;
  donorCount: number;
  percent: number;
}

const PRIVILEGES = [
  { icon: Gift, title: "Prasadam at Home", desc: "Receive blessed prasadam delivered every month" },
  { icon: Sparkles, title: "Sankalpam Puja", desc: "Your name chanted in the temple's daily worship" },
  { icon: Award, title: "80G Tax Benefit", desc: "Government-recognized exemption certificate" },
  { icon: Crown, title: "Priority Access", desc: "VIP entry to special festivals and donor events" },
];

export default function DonateHubPage() {
  const [overview, setOverview] = useState<OverviewStats | null>(null);
  const [sqft, setSqft] = useState<SqftStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [ovRes, sqftRes] = await Promise.all([
          fetch(`${API_URL}/seva-stats/overview`),
          fetch(`${API_URL}/seva-stats/sqft-campaign`),
        ]);
        if (ovRes.ok) setOverview(await ovRes.json());
        if (sqftRes.ok) setSqft(await sqftRes.json());
      } catch {}
      setLoading(false);
    })();
  }, []);

  const sevaProgress = (seva: (typeof sevas)[number]) => {
    const stat = overview?.bySeva?.[seva.title];
    return stat ? { amount: stat.totalAmount, donors: stat.donorCount } : { amount: 0, donors: 0 };
  };

  return (
    <PageLayout>
      <main className="bg-background">
        {/* ══ HERO — common to all donations, no seva-specific numbers ══ */}
        <section className="relative overflow-hidden pt-20">
          <div className="relative aspect-[16/9] w-full md:aspect-[21/8]">
            <Image
              src="/assets/home-banner-daily-darshan.webp"
              alt="Support Hare Krishna Vaikuntham"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,hsl(220,85%,8%,0.55)_0%,hsl(220,85%,7%,0.92)_100%)]" />
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-end px-4 pb-10 text-center md:pb-14">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-background/25 bg-background/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-background backdrop-blur-md">
              🪔 Seva &amp; Devotion
            </span>
            <h1 className="mb-3 font-heading text-3xl font-bold leading-tight text-background md:text-5xl">
              Support Hare Krishna Vaikuntham
            </h1>
            <p className="mb-7 max-w-xl text-sm text-background/85 md:text-base">
              Every offering — a brick, a plate of prasadam, a Bhagavad Gita placed in someone&apos;s
              hands — is an act of devotion that sustains this mission.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href="#sevas"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-gold px-8 py-3.5 text-sm font-bold text-[hsl(220,60%,12%)] shadow-gold transition-transform hover:-translate-y-0.5 md:text-base"
              >
                🪔 Choose a Seva
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-background/40 bg-background/10 px-8 py-3.5 text-sm font-semibold text-background backdrop-blur-md transition-colors hover:bg-background/20 md:text-base"
              >
                Talk to Us
              </Link>
            </div>
          </div>
        </section>

        {/* ══ OTHER SEVAS GRID ══ */}
        <section id="sevas" className="border-t border-border py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-gold">More Ways to Serve</p>
              <Ornament className="mb-5" />
              <h2 className="mb-4 font-heading text-3xl font-bold text-foreground md:text-5xl">
                Choose Your Seva
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                Beyond temple construction, there are many ways to serve — each one a form of devotion.
              </p>
            </div>

            <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {sevas.map((seva) => {
                const progress = sevaProgress(seva);
                return (
                  <Link
                    key={seva.slug}
                    href={getSevaHref(seva)}
                    className="group overflow-hidden rounded-3xl border border-border bg-card shadow-warm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-elevated"
                  >
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <Image
                        src={seva.image}
                        alt={seva.title}
                        fill
                        sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 92vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[hsl(220,85%,10%,0.78)] via-transparent to-transparent" />
                      <h3 className="absolute bottom-4 left-5 font-heading text-xl font-bold text-background">
                        {seva.icon} {seva.title}
                      </h3>
                    </div>
                    <div className="p-6">
                      {progress.donors > 0 && (
                        <p className="mb-3 text-xs text-muted-foreground">
                          <span className="font-semibold text-gold">₹{progress.amount.toLocaleString("en-IN")}</span> raised
                          from <span className="font-semibold">{progress.donors}</span> devotees
                        </p>
                      )}
                      <p className="mb-5 text-xs text-muted-foreground">{seva.tagline}</p>
                      <span className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-gold py-3.5 text-[15px] font-bold text-[hsl(220,60%,12%)] shadow-gold">
                        🪔 Sponsor {seva.shortTitle} <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* ══ AGGREGATE IMPACT STRIP — site-wide totals, real data ══ */}
        <section className="border-b border-border bg-card">
          <div className="container mx-auto grid grid-cols-2 gap-4 px-4 py-6 sm:grid-cols-4">
            <div className="text-center">
              <p className="flex items-center justify-center gap-1.5 font-heading text-2xl font-bold text-gold md:text-3xl">
                <TrendingUp className="h-5 w-5" />
                {loading ? "…" : `₹${(overview?.totalAmount || 0).toLocaleString("en-IN")}`}
              </p>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Total Raised</p>
            </div>
            <div className="text-center">
              <p className="flex items-center justify-center gap-1.5 font-heading text-2xl font-bold text-primary md:text-3xl">
                <Users className="h-5 w-5" />
                {loading ? "…" : (overview?.donorCount || 0).toLocaleString("en-IN")}
              </p>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Devotees Contributed</p>
            </div>
            <div className="text-center">
              <p className="font-heading text-2xl font-bold text-primary md:text-3xl">{sevas.length + 1}</p>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Active Sevas</p>
            </div>
            <div className="text-center">
              <p className="font-heading text-2xl font-bold text-primary md:text-3xl">80G</p>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Tax Exemption</p>
            </div>
          </div>
        </section>

        {/* ══ MANDIR NIRMAN SEVA — dedicated section, detailed treatment ══ */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto grid max-w-5xl items-center gap-10 lg:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7 }}
                className="relative"
              >
                <div className="absolute -inset-3 -rotate-2 rounded-2xl bg-gradient-gold opacity-15" />
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-elevated">
                  <Image
                    src="https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1783672822355-1783672821116-ChatGPTImageJul92026043238PM.png"
                    alt="Mandir Nirman Seva — temple construction"
                    fill
                    sizes="(min-width: 1024px) 480px, 92vw"
                    className="object-cover"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, delay: 0.1 }}
              >
                <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-gradient-gold px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-[hsl(220,60%,12%)]">
                  🏛️ Flagship Campaign
                </span>
                <Ornament className="mb-4 !justify-start" />
                <h2 className="mb-4 font-heading text-2xl font-bold text-foreground md:text-3xl">
                  Mandir Nirman Seva
                </h2>
                <p className="mb-6 leading-relaxed text-muted-foreground">
                  Be part of building the Hare Krishna Vaikuntham Temple, Visakhapatnam — every square
                  foot you sponsor becomes a permanent, eternal offering laid into the foundation of the
                  Lord&apos;s home.
                </p>

                {sqft && sqft.totalAmount > 0 && (
                  <div className="mb-6">
                    <div className="mb-1.5 flex items-center justify-between text-xs text-muted-foreground">
                      <span>{sqft.sqftRaised.toLocaleString("en-IN")} / {sqft.goalSqft.toLocaleString("en-IN")} sq ft funded</span>
                      <span className="font-bold text-gold">{sqft.percent}%</span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${sqft.percent}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full rounded-full bg-gradient-gold"
                      />
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href="/sqft-seva-campaign"
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-gold px-7 py-3.5 text-sm font-bold text-[hsl(220,60%,12%)] shadow-gold transition-transform hover:-translate-y-0.5"
                  >
                    🪔 Donate Now
                  </Link>
                  <Link
                    href="/sqft-seva-campaign/register"
                    className="inline-flex items-center gap-2 rounded-full border border-border px-7 py-3.5 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
                  >
                    Start Your Own Campaign
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ══ LIVE DONOR WALL — real, cross-seva ══ */}
        {overview && overview.donors.length > 0 && (
          <section className="border-t border-border bg-muted/30 py-16">
            <div className="container mx-auto px-4">
              <div className="mb-10 flex items-center justify-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-green-600">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                  </span>
                  Live
                </span>
                <h2 className="font-heading text-xl font-bold text-foreground">
                  Generous Souls Supporting the Temple
                </h2>
              </div>
              <div className="mx-auto grid max-w-5xl grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {overview.donors.map((d, i) => (
                  <motion.div
                    key={`${d.name}-${i}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[hsl(42,92%,56%,0.15)] text-sm font-bold text-gold">
                      {d.name.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{d.name}</p>
                      <p className="truncate text-[11px] text-muted-foreground">
                        ₹{d.amount.toLocaleString("en-IN")} · {d.seva} · {d.time}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ══ DONOR PRIVILEGES ══ */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="mb-3 font-heading text-2xl font-bold text-foreground md:text-3xl">
                Donor Privileges
              </h2>
              <p className="mx-auto max-w-xl text-muted-foreground">
                Every devotee who contributes receives these blessings
              </p>
            </div>
            <div className="mx-auto grid max-w-4xl grid-cols-2 gap-4 md:grid-cols-4">
              {PRIVILEGES.map((p) => (
                <div key={p.title} className="rounded-2xl border border-border bg-card p-5 text-center transition-all hover:-translate-y-1 hover:shadow-elevated">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[hsl(42,92%,56%,0.12)] text-gold">
                    <p.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-1.5 text-sm font-semibold">{p.title}</h3>
                  <p className="text-xs text-muted-foreground">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ BOTTOM CTA ══ */}
        <section className="relative overflow-hidden bg-gradient-ocean py-16 text-center md:py-20">
          <div className="container mx-auto px-4">
            <h2 className="mb-3 font-heading text-2xl font-bold text-primary-foreground md:text-4xl">
              Be Part of Building Vizag&apos;s Grandest Temple
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-primary-foreground/85">
              Every contribution — big or small — brings us closer to completing this divine vision for Lord Krishna.
            </p>
            <Link
              href="/sqft-seva-campaign"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-gold px-8 py-3.5 text-sm font-bold text-[hsl(220,60%,12%)] shadow-gold transition-transform hover:-translate-y-0.5 md:text-base"
            >
              <Heart className="h-4 w-4 fill-current" /> Donate Now
            </Link>
            <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-primary-foreground/70">
              <ShieldCheck className="h-3.5 w-3.5" /> Secured by Razorpay · 80G Tax Exempt
            </p>
          </div>
        </section>
      </main>
    </PageLayout>
  );
}
