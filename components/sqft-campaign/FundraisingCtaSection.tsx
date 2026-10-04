"use client";

import { Megaphone } from "lucide-react";
import Link from "next/link";
import { getCampaignConfig } from "@/lib/campaignConfig";

export default function FundraisingCtaSection({ campaignType }: { campaignType: "SQFT" | "BRICK" }) {
  const config = getCampaignConfig(campaignType);
  return (
    <section className="vk-section vk-band">
      <div className="vk-container">
        <div className="vk-card mx-auto max-w-4xl !rounded-3xl p-6 text-center md:p-10">
          <span className="vk-icon-chip mx-auto mb-4">
            <Megaphone className="h-5 w-5" />
          </span>
          <h2 className="vk-h2">Start Your Own Fundraising Campaign</h2>
          <p className="vk-lead mx-auto mt-3 max-w-xl">
            Multiply your seva. Create your personal campaign page, share it with friends and family on
            WhatsApp, and inspire them to sponsor {config.unitNamePlural} of the temple through your link.
          </p>
          <div className="mx-auto my-8 grid max-w-3xl gap-3 text-left sm:grid-cols-3">
            {[
              "Create your campaign page in under a minute",
              "Share your personal link with friends & family",
              "Watch your collective seva grow on your page",
            ].map((step, i) => (
              <div key={step} className="flex items-start gap-3 rounded-2xl bg-vk-50 p-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-vk-700 font-heading text-sm font-bold text-white">
                  {i + 1}
                </span>
                <p className="text-[13px] leading-relaxed text-ink/80">{step}</p>
              </div>
            ))}
          </div>
          <Link href="/sqft-seva-campaign/register" className="vk-btn-primary h-12 px-8 text-base">
            Create My Fundraising Campaign
          </Link>
        </div>
      </div>
    </section>
  );
}
