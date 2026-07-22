"use client";

import { Megaphone } from "lucide-react";
import Link from "next/link";
import { getCampaignConfig } from "@/lib/campaignConfig";

export default function FundraisingCtaSection({ campaignType }: { campaignType: "SQFT" | "BRICK" }) {
  const config = getCampaignConfig(campaignType);
  return (
    <section className="bg-[hsl(220,90%,12%)] py-16 md:py-24">
      <div className="container mx-auto max-w-3xl px-4 text-center">
        <Megaphone className="mx-auto mb-4 h-10 w-10 text-gold" />
        <h2 className="mb-3 font-heading text-2xl font-bold text-white md:text-4xl">
          Start Your Own Fundraising Campaign
        </h2>
        <p className="mx-auto mb-8 max-w-xl text-sm leading-relaxed text-white/80 md:text-base">
          Multiply your seva. Create your personal campaign page, share it with friends and family on
          WhatsApp, and inspire them to sponsor {config.unitNamePlural} of the temple through your link.
        </p>
        <div className="mx-auto mb-8 grid max-w-2xl gap-3 text-left sm:grid-cols-3">
          {[
            "Create your campaign page in under a minute",
            "Share your personal link with friends & family",
            "Watch your collective seva grow on your page",
          ].map((step, i) => (
            <div key={step} className="rounded-xl border border-white/15 bg-white/5 p-4">
              <p className="mb-1 font-heading text-lg font-bold text-gold">{i + 1}</p>
              <p className="text-xs leading-relaxed text-white/85">{step}</p>
            </div>
          ))}
        </div>
        <Link
          href="/sqft-seva-campaign/register"
          className="inline-block rounded-full bg-gradient-gold px-10 py-3.5 text-base font-bold text-[hsl(220,90%,12%)] shadow-[var(--shadow-gold)] transition-all hover:scale-105 hover:shadow-[0_12px_32px_hsl(42,92%,46%,0.4)]"
        >
          Create My Fundraising Campaign
        </Link>
      </div>
    </section>
  );
}
