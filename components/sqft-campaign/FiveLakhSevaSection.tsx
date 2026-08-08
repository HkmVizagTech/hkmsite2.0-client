"use client";

import { motion } from "framer-motion";
import { Award, Building2, IndianRupee, ScrollText } from "lucide-react";
import Ornament from "@/components/Ornament";
import type { CampaignConfig } from "@/lib/campaignConfig";
import { SQFT_CAMPAIGN } from "@/lib/campaignConfig";

const SEVA_AMOUNT = 500000;
const SEVA_SQFT = 238;

interface FiveLakhSevaSectionProps {
  scrollToDonate: () => void;
  config?: CampaignConfig;
}

export default function FiveLakhSevaSection({
  scrollToDonate,
  config = SQFT_CAMPAIGN,
}: FiveLakhSevaSectionProps) {
  const amountLabel = `₹${SEVA_AMOUNT.toLocaleString("en-IN")}`;

  return (
    <section className="bg-[radial-gradient(circle_at_top,_rgba(255,221,91,0.12),_transparent_45%)] bg-white pb-12 pt-1 dark:bg-background md:pb-16 md:pt-2">
      <div className="container mx-auto max-w-5xl px-4">
        <Ornament className="mb-4" />
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-gold">
            Premium Temple Seva
          </p>
          <h2 className="font-heading text-3xl font-bold text-primary md:text-4xl">
            {amountLabel} Seva
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
            Sponsor {SEVA_SQFT.toLocaleString("en-IN")} {config.unitNamePlural} of the temple
            construction with a single offering of {amountLabel}.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="overflow-hidden rounded-[32px] border border-gold/40 bg-[hsl(220,90%,12%)] shadow-elevated"
        >
          <div className="grid gap-8 p-6 sm:p-10 md:grid-cols-5 md:items-center">
            {/* Left: offering + benefits */}
            <div className="md:col-span-3">
              <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-gradient-gold px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[hsl(220,90%,12%)] shadow-gold">
                <Award className="h-3.5 w-3.5" />
                Featured Seva
              </span>

              <h3 className="font-heading text-2xl font-bold text-white md:text-3xl">
                Your name, engraved forever on the Honor Wall
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/80 md:text-base">
                By offering {amountLabel} for the {config.pageTitle}, you will be offering{" "}
                {SEVA_SQFT.toLocaleString("en-IN")} {config.unitNamePlural} of the Hare Krishna
                Vaikuntham Temple&apos;s construction — and your name will be permanently
                imprinted on the temple&apos;s Honor Wall for generations to see.
              </p>

              <ul className="mt-6 space-y-3">
                {[
                  { icon: Building2, text: `${SEVA_SQFT.toLocaleString("en-IN")} ${config.unitNamePlural} of temple construction — a permanent part of the Lord's abode.` },
                  { icon: ScrollText, text: "Your name imprinted on the Honor Wall at the temple." },
                  { icon: Award, text: "Honoured alongside the temple's most respected contributors." },
                ].map((b) => (
                  <li key={b.text} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold">
                      <b.icon className="h-4 w-4" />
                    </span>
                    <p className="text-sm leading-relaxed text-white/85">{b.text}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: amount card */}
            <div className="md:col-span-2">
              <div className="rounded-2xl bg-white/5 p-6 text-center ring-1 ring-gold/30">
                <p className="flex items-center justify-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
                  <IndianRupee className="h-3.5 w-3.5" />
                  Your offering
                </p>
                <p className="mt-2 font-heading text-4xl font-extrabold text-white md:text-5xl">
                  {amountLabel}
                </p>
                <div className="my-5 flex items-center justify-center gap-3">
                  <span className="h-px w-10 bg-gold/40" />
                  <span className="text-gold">✦</span>
                  <span className="h-px w-10 bg-gold/40" />
                </div>
                <p className="font-heading text-2xl font-bold text-gold">
                  {SEVA_SQFT.toLocaleString("en-IN")} {config.unitNamePlural}
                </p>
                <p className="mt-1 text-xs text-white/60">
                  {config.unitNamePlural} of the temple&apos;s construction offered
                </p>
              </div>

              <button
                onClick={scrollToDonate}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-gold px-8 py-4 text-base font-bold text-[hsl(220,90%,12%)] shadow-gold transition-transform hover:scale-105"
              >
                Donate {amountLabel} Now
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
