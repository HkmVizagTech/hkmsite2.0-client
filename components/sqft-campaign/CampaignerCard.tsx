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
    <section className="bg-white py-10 md:py-14">
      <div className="container mx-auto max-w-3xl px-4">
        <div className="overflow-hidden rounded-2xl border-2 border-gold/40 bg-card p-6 shadow-sm md:p-8">
          <p className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-gold">
            <Megaphone className="h-4 w-4" /> Fundraising Campaign
          </p>
          <h2 className="mb-2 font-heading text-xl font-bold text-primary md:text-2xl">
            Support {campaigner.name}&apos;s {config.pageTitle}
          </h2>
          {campaigner.message && (
            <p className="mb-4 text-sm italic leading-relaxed text-muted-foreground">
              &ldquo;{campaigner.message}&rdquo;
            </p>
          )}

          <div className="mb-4 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-xl bg-background p-3">
              <p className="font-heading text-lg font-bold text-gold md:text-xl">
                {campaignerSqftRaised.toLocaleString("en-IN")}
              </p>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{config.unitShort} raised</p>
            </div>
            <div className="rounded-xl bg-background p-3">
              <p className="font-heading text-lg font-bold text-primary md:text-xl">
                ₹{campaigner.raisedAmount.toLocaleString("en-IN")}
              </p>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">collected</p>
            </div>
            <div className="rounded-xl bg-background p-3">
              <p className="font-heading text-lg font-bold text-primary md:text-xl">
                {campaigner.donorCount.toLocaleString("en-IN")}
              </p>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">supporters</p>
            </div>
          </div>

          {campaigner.goalSqft > 0 && (
            <div className="mb-4">
              <div className="mb-1.5 flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Target className="h-3.5 w-3.5 text-gold" /> Personal goal
                </span>
                <span className="font-semibold text-foreground">
                  {campaignerSqftRaised} / {campaigner.goalSqft} {config.unitShort}
                </span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-background">
                <div
                  className="h-full rounded-full bg-gradient-gold transition-all duration-700"
                  style={{
                    width: `${Math.min(100, (campaignerSqftRaised / campaigner.goalSqft) * 100)}%`,
                  }}
                />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              onClick={scrollToDonate}
              className="flex-1 rounded-full bg-gradient-gold py-3 text-sm font-bold text-[hsl(220,90%,12%)] shadow-[var(--shadow-gold)] transition-transform hover:scale-[1.02]"
            >
              Donate to {campaigner.name.split(" ")[0]}&apos;s Campaign
            </button>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(
                `Hare Krishna! 🙏 Join me in building the Hare Krishna Vaikuntham Temple — sponsor a ${config.unitName} through my campaign: ${shareUrl}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center gap-2 rounded-full border-2 border-gold py-3 text-sm font-bold text-gold transition-colors hover:bg-gold/10"
            >
              <Share2 className="h-4 w-4" /> Share on WhatsApp
            </a>
            <button
              onClick={handleShareCopy}
              aria-label="Copy campaign link"
              className="flex items-center justify-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-semibold text-muted-foreground hover:border-gold hover:text-gold"
            >
              {copiedShare ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              {copiedShare ? "Copied" : "Copy link"}
            </button>
          </div>

          {campaigner.donors.length > 0 && (
            <div className="mt-5 border-t border-border pt-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Recent supporters
              </p>
              <ul className="space-y-1.5">
                {campaigner.donors.slice(0, 6).map((d, i) => (
                  <li key={`${d.name}-${i}`} className="flex items-center justify-between text-sm">
                    <span className="text-foreground">
                      {d.name} <span className="text-muted-foreground">offered</span>{" "}
                      <span className="font-semibold text-gold">{donorLabel(d, price, config)}</span>
                    </span>
                    <span className="text-xs text-muted-foreground">{d.time}</span>
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
