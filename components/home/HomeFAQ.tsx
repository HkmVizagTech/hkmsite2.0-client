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
        <Reveal>
          <div className="grid gap-8 rounded-3xl bg-gradient-to-br from-vk-100 via-vk-50 to-white p-6 md:p-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12">
            <div>
              <span className="vk-pill mb-4">{t("FAQ")}</span>
              <h2 className="vk-h2">{t("Frequently Asked Questions")}</h2>
              <p className="vk-lead mt-3">
                {t("Quick answers about visiting ISKCON Gambheeram — darshan timings, location, donations and how to get involved.")}
              </p>
              <Link href="/contact" className="vk-btn-primary mt-6">
                <MessageCircle className="h-4 w-4" />
                {t("Get in Touch")}
              </Link>
            </div>
            <div className="space-y-3">
              {items.map((f, i) => {
                const isOpen = open === i;
                return (
                  <div
                    key={f.q}
                    className={`overflow-hidden rounded-2xl border bg-white transition-shadow ${
                      isOpen ? "border-vk-200 shadow-card" : "border-vk-100"
                    }`}
                  >
                    <h3>
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={`faq-${i}`}
                        onClick={() => setOpen(isOpen ? null : i)}
                        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-[15px] font-semibold text-ink"
                      >
                        <span>
                          {i + 1}. {t(f.q)}
                        </span>
                        <span
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all ${
                            isOpen ? "rotate-180 bg-vk-700 text-white" : "bg-vk-100 text-vk-700"
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
                        <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">{t(f.a)}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
              {homeFaq.length > 4 && (
                <button
                  type="button"
                  onClick={() => setShowAll((v) => !v)}
                  className="vk-btn-outline"
                >
                  {showAll ? t("Show less") : t("Show more")}
                </button>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
