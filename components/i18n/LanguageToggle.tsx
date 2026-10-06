"use client";

// Floating "తెలుగు / English" switch (like GVD's हिंदी pill), stacked just
// above the WhatsApp button on every page.

import { Languages } from "lucide-react";
import { SWITCH_LABEL } from "@/lib/i18n/config";
import { useLocale } from "./LocaleProvider";

export default function LanguageToggle() {
  const { locale, setLocale } = useLocale();
  const next = locale === "te" ? "en" : "te";
  return (
    <button
      type="button"
      onClick={() => setLocale(next)}
      lang={next}
      aria-label={next === "te" ? "Switch to Telugu — తెలుగులో చూడండి" : "Switch to English"}
      className="fixed bottom-[calc(var(--bottom-nav-space)+80px)] right-4 z-50 inline-flex h-11 items-center gap-2 rounded-full bg-white py-1 pl-1 pr-4 text-sm font-semibold text-vk-800 shadow-[0_10px_24px_-8px_rgba(10,18,51,0.45)] ring-1 ring-vk-100 transition-transform hover:scale-[1.03] active:scale-95 md:bottom-[88px] md:right-6"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-vk-700 text-white">
        <Languages className="h-4 w-4" />
      </span>
      {SWITCH_LABEL[locale]}
    </button>
  );
}
