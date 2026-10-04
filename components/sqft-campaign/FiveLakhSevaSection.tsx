"use client";

import { motion } from "framer-motion";
import { Award, Building2, IndianRupee, ScrollText } from "lucide-react";
import SectionHeading from "@/components/site/SectionHeading";
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
    <section className="vk-section bg-white">
      <div className="vk-container">
        <SectionHeading
          align="center"
          eyebrow="Premium Temple Seva"
          title={`${amountLabel} Seva`}
          subtitle={
            <>
              Sponsor {SEVA_SQFT.toLocaleString("en-IN")} {config.unitNamePlural} of the temple
              construction with a single offering of {amountLabel}.
            </>
          }
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-gradient-to-br from-vk-900 via-vk-800 to-vk-700 shadow-[0_24px_60px_-28px_rgba(10,18,51,0.6)]"
        >
          <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/5" />
          <div className="relative grid gap-8 p-6 sm:p-10 md:grid-cols-5 md:items-center">
            {/* Left: offering + benefits */}
            <div className="md:col-span-3">
              <span className="vk-pill-light mb-4">
                <Award className="h-3.5 w-3.5 text-[hsl(var(--gold))]" />
                Featured Seva
              </span>

              <h3 className="vk-h3 !text-white md:!text-3xl">
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
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[hsl(var(--gold))]">
                      <b.icon className="h-4 w-4" />
                    </span>
                    <p className="text-sm leading-relaxed text-white/85">{b.text}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: amount card */}
            <div className="md:col-span-2">
              <div className="rounded-2xl border border-white/10 bg-white/10 p-6 text-center">
                <p className="flex items-center justify-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/75">
                  <IndianRupee className="h-3.5 w-3.5" />
                  Your offering
                </p>
                <p className="mt-2 font-heading text-4xl font-extrabold text-white md:text-5xl">
                  {amountLabel}
                </p>
                <div aria-hidden className="mx-auto my-5 h-px w-24 bg-white/15" />
                <p className="font-heading text-2xl font-bold text-[hsl(var(--gold))]">
                  {SEVA_SQFT.toLocaleString("en-IN")} {config.unitNamePlural}
                </p>
                <p className="mt-1 text-xs text-white/60">
                  {config.unitNamePlural} of the temple&apos;s construction offered
                </p>
              </div>

              <button
                onClick={scrollToDonate}
                className="vk-btn-gold mt-6 h-12 w-full text-base"
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
