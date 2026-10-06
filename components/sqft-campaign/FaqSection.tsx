"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useT } from "@/components/i18n/LocaleProvider";

interface FaqItem {
  q: string;
  a: string;
}

interface FaqSectionProps {
  faqs: FaqItem[];
  /**
   * Kept for API compatibility with the festival pages. Any non-default tone
   * now renders on the soft `vk-band` background instead of a bespoke palette.
   */
  tone?: "default" | "mint" | "blue" | "sand";
}

export default function FaqSection({ faqs, tone = "default" }: FaqSectionProps) {
  const t = useT();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const banded = tone !== "default";

  // FAQPage structured data — lets Google show these Q&As directly in
  // search results (the "People also ask"-style rich snippet), which
  // meaningfully improves click-through even without a ranking change.
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <section className={`vk-section ${banded ? "vk-band" : "bg-white"}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="vk-container">
        <div className="grid gap-8 rounded-3xl bg-gradient-to-br from-vk-100 via-vk-50 to-white p-5 md:p-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12">
          <div>
            <span className="vk-pill mb-4">{t("FAQ")}</span>
            <h2 className="vk-h2">{t("Frequently Asked Questions")}</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((f, i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={f.q}
                  className={`overflow-hidden rounded-2xl border bg-white transition-shadow ${
                    isOpen ? "border-vk-200 shadow-card" : "border-vk-100"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    aria-expanded={openFaq === i}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-[15px] font-semibold text-ink"
                  >
                    <span>{f.q}</span>
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all ${
                        isOpen ? "rotate-180 bg-vk-700 text-white" : "bg-vk-100 text-vk-700"
                      }`}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </span>
                  </button>
                  {isOpen && (
                    <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">
                      {f.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
