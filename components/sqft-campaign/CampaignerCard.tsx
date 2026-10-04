"use client";

import { Megaphone, Target, Share2, Copy, Check } from "lucide-react";
import type { CampaignerData, CampaignConfig } from "@/lib/campaignConfig";

interface CampaignerCardProps {
  campaigner: CampaignerData;
  price: number;
  campaignerSqftRaised: number;
  scrollToDonate: () => void;
  shareUrl: string;
  copiedShare: boolean;
  handleShareCopy: () => void;
  config: CampaignConfig;
}

const donorLabel = (d: { amount: number }, price: number, config: CampaignConfig) => {
  const sqft = Math.floor(d.amount / price);
  return sqft >= 1
    ? `${sqft} ${sqft === 1 ? config.unitName : config.unitNamePlural}`
    : `₹${d.amount.toLocaleString("en-IN")}`;
};

export default function CampaignerCard({
  campaigner,
  price,
  campaignerSqftRaised,
  scrollToDonate,
  shareUrl,
  copiedShare,
  handleShareCopy,
  config,
}: CampaignerCardProps) {
  return (
    <section className="bg-white pb-6 pt-4 md:pb-10 md:pt-6">
      <div className="vk-container">
        <div className="relative mx-auto max-w-3xl overflow-hidden rounded-3xl bg-gradient-to-br from-vk-700 via-vk-600 to-vk-500 p-6 text-white shadow-[0_24px_50px_-24px_rgba(30,58,138,0.7)] md:p-8">
          <div aria-hidden className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10" />
          <span className="vk-pill-light relative mb-3">
            <Megaphone className="h-3.5 w-3.5" /> Fundraising Campaign
          </span>
          <h2 className="vk-h3 relative mb-2 !text-white md:!text-[1.75rem]">
            Support {campaigner.name}&apos;s {config.pageTitle}
          </h2>
          {campaigner.message && (
            <p className="relative mb-4 font-serif-display text-[15px] italic leading-relaxed text-white/85">
              &ldquo;{campaigner.message}&rdquo;
            </p>
          )}

          <div className="relative mb-4 grid grid-cols-3 gap-2 text-center sm:gap-3">
            <div className="rounded-xl bg-white/10 px-2 py-3">
              <p className="font-heading text-lg font-extrabold text-[hsl(var(--gold))] md:text-xl">
                {campaignerSqftRaised.toLocaleString("en-IN")}
              </p>
              <p className="text-[10px] uppercase tracking-wide text-white/75">{config.unitShort} raised</p>
            </div>
            <div className="rounded-xl bg-white/10 px-2 py-3">
              <p className="break-all font-heading text-lg font-extrabold text-white md:text-xl">
                ₹{campaigner.raisedAmount.toLocaleString("en-IN")}
              </p>
              <p className="text-[10px] uppercase tracking-wide text-white/75">collected</p>
            </div>
            <div className="rounded-xl bg-white/10 px-2 py-3">
              <p className="font-heading text-lg font-extrabold text-white md:text-xl">
                {campaigner.donorCount.toLocaleString("en-IN")}
              </p>
              <p className="text-[10px] uppercase tracking-wide text-white/75">supporters</p>
            </div>
          </div>

          {campaigner.goalSqft > 0 && (
            <div className="relative mb-5">
              <div className="mb-1.5 flex items-center justify-between text-xs text-white/80">
                <span className="flex items-center gap-1">
                  <Target className="h-3.5 w-3.5 text-[hsl(var(--gold))]" /> Personal goal
                </span>
                <span className="font-semibold text-white">
                  {campaignerSqftRaised} / {campaigner.goalSqft} {config.unitShort}
                </span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-white/15">
                <div
                  className="h-full rounded-full bg-gradient-gold transition-all duration-700"
                  style={{
                    width: `${Math.min(100, (campaignerSqftRaised / campaigner.goalSqft) * 100)}%`,
                  }}
                />
              </div>
            </div>
          )}

          <div className="relative flex flex-col gap-2 sm:flex-row">
            <button
              onClick={scrollToDonate}
              className="vk-btn-gold h-12 flex-1 whitespace-normal text-center"
            >
              Donate to {campaigner.name.split(" ")[0]}&apos;s Campaign
            </button>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(
                `Hare Krishna! 🙏 Join me in building the Hare Krishna Vaikuntham Temple — sponsor a ${config.unitName} through my campaign: ${shareUrl}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="vk-btn-ghost-light h-12 flex-1"
            >
              <Share2 className="h-4 w-4" /> Share on WhatsApp
            </a>
            <button
              onClick={handleShareCopy}
              aria-label="Copy campaign link"
              className="vk-btn-ghost-light h-12"
            >
              {copiedShare ? (
                <Check className="h-4 w-4 text-green-300" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              {copiedShare ? "Copied" : "Copy link"}
            </button>
          </div>

          {campaigner.donors.length > 0 && (
            <div className="relative mt-5 rounded-2xl bg-white p-4 text-ink">
              <p className="mb-2 text-[13px] font-bold uppercase tracking-[0.08em] text-vk-700">
                Recent supporters
              </p>
              <ul className="divide-y divide-vk-100">
                {campaigner.donors.slice(0, 6).map((d, i) => (
                  <li key={`${d.name}-${i}`} className="flex items-center justify-between gap-3 py-2 text-sm">
                    <span className="min-w-0 text-ink">
                      {d.name} <span className="text-muted-foreground">offered</span>{" "}
                      <span className="font-semibold text-vk-700">{donorLabel(d, price, config)}</span>
                    </span>
                    <span className="shrink-0 text-xs text-muted-foreground">{d.time}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
