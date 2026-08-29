"use client";

import { Smartphone } from "lucide-react";

/**
 * Vaikuntham — the temple's official app.
 *
 * Volunteer registration happens entirely inside it (the VCC volunteer system
 * does not accept sign-ups made from this website), so these links are the
 * single source of truth for every "download the app" call to action on the
 * site. Import them; don't re-type the URLs.
 */
export const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=in.harekrishnavizag";
export const APP_STORE_URL =
  "https://apps.apple.com/in/app/vaikuntham/id6774589633";

export function GooglePlayIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M3.609 1.814L13.792 12 3.61 22.186a1.51 1.51 0 01-.61-1.21V3.024c0-.474.24-.898.61-1.21zm10.89 10.89l2.302 2.302-10.937 6.22 8.635-8.522zm3.7-3.65l2.74 1.559c.83.472.83 1.303 0 1.775l-2.74 1.558-2.58-2.446 2.58-2.446zM4.864 1.15l10.937 6.22-2.302 2.302L4.864 1.15z" />
    </svg>
  );
}

export function AppleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M17.05 12.536c-.026-2.657 2.17-3.93 2.27-3.993-1.236-1.807-3.16-2.055-3.844-2.083-1.636-.165-3.194.962-4.025.962-.83 0-2.11-.938-3.468-.912-1.785.026-3.43 1.038-4.35 2.636-1.853 3.213-.474 7.968 1.331 10.573.882 1.276 1.934 2.71 3.317 2.658 1.331-.053 1.834-.861 3.443-.861 1.61 0 2.062.861 3.47.835 1.432-.026 2.339-1.301 3.216-2.582 1.014-1.48 1.43-2.914 1.456-2.988-.032-.014-2.792-1.072-2.818-4.245zM14.47 4.5c.735-.89 1.231-2.129 1.096-3.363-1.06.043-2.343.706-3.103 1.596-.681.789-1.278 2.05-1.117 3.26 1.183.092 2.39-.601 3.124-1.493z" />
    </svg>
  );
}

/**
 * The two store buttons. `size="sm"` is the compact footer variant; the
 * default is the larger pair used on the volunteer page.
 */
export function AppStoreButtons({
  size = "md",
  className = "",
}: {
  size?: "sm" | "md";
  className?: string;
}) {
  const sm = size === "sm";
  // grow on narrow screens so the pair splits the row evenly (or each takes a
  // full row when they can't fit); fixed width once there's space for both.
  const base =
    "inline-flex grow items-center justify-center gap-2.5 rounded-xl bg-white text-left text-[hsl(220,60%,12%)] transition-transform hover:-translate-y-0.5 sm:grow-0 sm:justify-start";
  const pad = sm ? "px-4 py-2.5" : "px-6 py-3.5 rounded-2xl";
  const icon = sm ? "h-5 w-5 shrink-0" : "h-7 w-7 shrink-0";
  const cap = sm ? "text-[9px]" : "text-[10px]";
  const name = sm ? "text-[13px]" : "text-base";

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <a
        href={PLAY_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={`${base} ${pad}`}
      >
        <GooglePlayIcon className={icon} />
        <span className="leading-tight">
          <span className={`block ${cap} uppercase tracking-wide opacity-70`}>Get it on</span>
          <span className={`block ${name} font-bold`}>Google Play</span>
        </span>
      </a>

      <a
        href={APP_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={`${base} ${pad}`}
      >
        <AppleIcon className={icon} />
        <span className="leading-tight">
          <span className={`block ${cap} uppercase tracking-wide opacity-70`}>
            Download on the
          </span>
          <span className={`block ${name} font-bold`}>App Store</span>
        </span>
      </a>
    </div>
  );
}

/**
 * Footer promo band. Sits in the empty space under the link columns on
 * desktop, and above everything else on mobile — see Footer.tsx.
 */
export default function VaikunthamAppPromo({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex flex-col gap-5 rounded-2xl border border-white/10 bg-white/[0.06] p-5 md:flex-row md:items-center md:justify-between md:gap-6 md:px-6 ${className}`}
    >
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-gold text-[hsl(220,60%,12%)] shadow-gold">
          <Smartphone className="h-6 w-6" />
        </div>
        <div>
          <p className="text-base font-bold leading-tight text-[hsl(210,30%,97%)]">
            Get the Vaikuntham App
          </p>
          <p className="mt-1 max-w-md text-sm leading-relaxed text-[hsl(210,30%,97%)]/55">
            Register for volunteer seva, follow festival updates and stay connected with
            the temple — all in one place.
          </p>
        </div>
      </div>

      <AppStoreButtons size="sm" className="shrink-0" />
    </div>
  );
}
