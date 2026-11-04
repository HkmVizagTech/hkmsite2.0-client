"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, MessageCircle } from "lucide-react";
import { homeFaq } from "@/lib/faq";
import Reveal from "@/components/site/Reveal";
import { useT } from "@/components/i18n/LocaleProvider";

/** GVD FAQ block — intro card on the left, accordion on the right. */
export default function HomeFAQ() {
  const t = useT();
  const [open, setOpen] = useState<number | null>(0);
  const [showAll, setShowAll] = useState(false);
  const items = showAll ? homeFaq : homeFaq.slice(0, 4);

  return (
    <section className="vk-section">
      <div className="vk-container">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <Reveal>
            <div className="lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]">
              <span className="vk-pill">{t("FAQ")}</span>
              <h2 className="vk-h2 mt-3">{t("Frequently Asked Questions")}</h2>
              <p className="vk-lead mt-4">
                {t("Quick answers about visiting ISKCON Gambheeram — darshan timings, location, donations and how to get involved.")}
              </p>
              <Link href="/contact" className="vk-btn mt-6 border border-vk-700/30 bg-white/80 text-vk-800 hover:bg-white">
                <MessageCircle className="h-4 w-4" />
                {t("Get in Touch")}
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="divide-y divide-[#E4E9F7] overflow-hidden rounded-[1.75rem] border border-[#E4E9F7] bg-white/75 shadow-[0_24px_50px_-38px_rgba(30,58,138,0.55)]">
              {items.map((f, i) => {
                const isOpen = open === i;
                return (
                  <div key={f.q} className={isOpen ? "bg-[#F5F7FF]" : ""}>
                    <h3>
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={`faq-${i}`}
                        onClick={() => setOpen(isOpen ? null : i)}
                        className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left md:px-7"
                      >
                        <span className="flex items-baseline gap-4">
                          <span className="font-serif-display text-lg font-semibold text-vk-300">{String(i + 1).padStart(2, "0")}</span>
                          <span className="font-serif-display text-[1.05rem] font-semibold leading-snug text-ink md:text-[1.15rem]">{t(f.q)}</span>
                        </span>
                        <span
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all ${
                            isOpen ? "rotate-180 bg-vk-700 text-white" : "bg-[#EEF2FF] text-vk-600"
                          }`}
                        >
                          <ChevronDown className="h-4 w-4" />
                        </span>
                      </button>
                    </h3>
                    <div
                      id={`faq-${i}`}
                      role="region"
                      className={`grid transition-[grid-template-rows] duration-300 ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                    >
                      <div className="overflow-hidden">
                        <p className="px-5 pb-6 pl-[4.5rem] pr-6 text-[15px] leading-[1.8] text-ink/70 md:pr-10">{t(f.a)}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
              {homeFaq.length > 4 && (
                <div className="px-5 py-4 md:px-7">
                  <button
                    type="button"
                    onClick={() => setShowAll((v) => !v)}
                    className="text-sm font-semibold text-vk-700 hover:text-vk-900"
                  >
                    {showAll ? t("Show less") : t("Show more")}
                  </button>
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
