"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { useT } from "@/components/i18n/LocaleProvider";
import Reveal from "@/components/site/Reveal";

/** FAQ for the Diwali page: a single centred column of numbered cards, the open one lit with a gold edge. Keeps the FAQPage markup. */
export function DiwaliFaq({ faqs }: { faqs: { q: string; a: string }[] }) {
  const t = useT();
  const [open, setOpen] = useState<number | null>(0);
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  return (
    <section className="vk-section">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <div className="vk-container">
        <Reveal className="mx-auto mb-8 max-w-2xl text-center md:mb-10">
          <span className="vk-pill mb-3">{t("FAQ")}</span>
          <h2 className="vk-h2">{t("Frequently Asked Questions")}</h2>
        </Reveal>
        <ul className="mx-auto max-w-3xl space-y-3">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <li
                key={f.q}
                className={`overflow-hidden rounded-2xl border bg-white transition-all duration-300 ${
                  isOpen ? "border-vk-300 shadow-[0_16px_36px_-26px_rgba(30,58,138,0.55)]" : "border-vk-100"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center gap-3.5 px-4 py-4 text-left sm:px-5"
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-heading text-sm font-extrabold transition-colors ${
                      isOpen ? "bg-vk-700 text-white" : "bg-vk-50 text-vk-700"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className="min-w-0 flex-1 text-[15px] font-semibold leading-snug text-vk-800">{f.q}</span>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-vk-200 text-vk-600">
                    {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  </span>
                </button>
                {isOpen && <p className="border-t border-vk-100 px-5 pb-5 pl-[4.4rem] pt-3 text-sm leading-relaxed text-ink/75 sm:pl-[4.6rem]">{f.a}</p>}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
