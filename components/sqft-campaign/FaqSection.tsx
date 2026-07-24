"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Ornament from "@/components/Ornament";

interface FaqItem {
  q: string;
  a: string;
}

interface FaqSectionProps {
  faqs: FaqItem[];
}

export default function FaqSection({ faqs }: FaqSectionProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <section className="bg-white py-12 md:py-16">
      <div className="container mx-auto max-w-3xl px-4">
        <Ornament className="mb-6" />
        <h2 className="mb-8 text-center font-heading text-2xl font-bold text-primary md:text-3xl">
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <div key={f.q} className="overflow-hidden rounded-2xl border border-border bg-card">
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                aria-expanded={openFaq === i}
                className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
              >
                <span className="text-sm font-semibold text-foreground md:text-base">{f.q}</span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-gold transition-transform ${
                    openFaq === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openFaq === i && (
                <p className="border-t border-border px-5 py-4 text-sm leading-relaxed text-muted-foreground">
                  {f.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
