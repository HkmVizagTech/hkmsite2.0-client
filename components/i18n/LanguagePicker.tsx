"use client";

// The language switch: a small globe button in the header (and a row in the menu sheet / footer) that opens a
// "Choose your language" panel listing every site language in its own script. Replaces the old floating pill.

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, Globe, X } from "lucide-react";
import { LANGUAGES, SHORT_LABEL, languageOf, type Locale } from "@/lib/i18n/config";
import { useLocale, useT } from "./LocaleProvider";

function Panel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { locale, setLocale } = useLocale();
  const t = useT();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    const o = document.body.style.overflow; document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", k); document.body.style.overflow = o; };
  }, [open, onClose]);
  const pick = (code: Locale) => { if (code === locale) return onClose(); setLocale(code); };
  if (!mounted) return null;
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[140] flex items-end justify-center sm:items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <button type="button" aria-label={t("Close")} onClick={onClose} className="absolute inset-0 bg-[#0A1233]/55 backdrop-blur-sm" />
          <motion.div role="dialog" aria-modal="true" aria-labelledby="lang-title"
            initial={{ y: 40, opacity: 0, scale: 0.98 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 40, opacity: 0 }} transition={{ duration: 0.3, ease: [0.22, 0.8, 0.3, 1] }}
            className="relative w-full max-w-xl overflow-hidden rounded-t-[1.8rem] bg-white shadow-[0_40px_100px_-30px_rgba(10,18,51,.6)] sm:rounded-[1.8rem]">
            <div className="relative bg-[#0A1233] px-6 pb-6 pt-6 text-white">
              <span aria-hidden className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[radial-gradient(closest-side,rgba(246,199,82,.3),transparent)]" />
              <span aria-hidden className="mx-auto mb-4 block h-1.5 w-10 rounded-full bg-white/25 sm:hidden" />
              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.24em] text-[#F6C752]"><Globe className="h-4 w-4" />{t("Language")}</p>
                  <h2 id="lang-title" className="mt-2 font-heading text-[1.5rem] font-bold leading-tight">{t("Choose your language")}</h2>
                  <p className="mt-1 text-[13px] text-white/60">Choose your language · अपनी भाषा चुनें · మీ భాషను ఎంచుకోండి</p>
                </div>
                <button type="button" onClick={onClose} aria-label={t("Close")} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20 hover:bg-white/20"><X className="h-5 w-5" /></button>
              </div>
            </div>
            <ul className="grid max-h-[60vh] grid-cols-2 gap-2.5 overflow-y-auto p-4 sm:grid-cols-3 sm:p-5">
              {LANGUAGES.map((l) => {
                const on = l.code === locale;
                return (
                  <li key={l.code}>
                    <button type="button" lang={l.code} onClick={() => pick(l.code)} aria-current={on ? "true" : undefined}
                      className={`group relative flex w-full flex-col items-start rounded-2xl px-4 py-3.5 text-left transition ${on ? "bg-[#0A1233] text-white shadow-[0_14px_30px_-16px_rgba(10,18,51,.9)]" : "bg-[#F4F7FF] text-[#0A1233] ring-1 ring-[#E3E9F7] hover:-translate-y-0.5 hover:bg-white hover:ring-[#1E3A8A]/40"}`}>
                      <span className="font-heading text-[1.15rem] font-bold leading-tight">{l.native}</span>
                      <span className={`mt-0.5 text-[12px] font-medium ${on ? "text-white/60" : "text-[#0A1233]/50"}`}>{l.english}</span>
                      {on && <span className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-[#F6C752] text-[#0A1233]"><Check className="h-3.5 w-3.5" /></span>}
                    </button>
                  </li>
                );
              })}
            </ul>
            <p className="px-6 pb-5 text-center text-[11.5px] text-[#0A1233]/45">{t("Some pages are still being translated and may show English.")}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

/** Header button: globe + current language. `compact` shows only the short label (phones). */
export default function LanguagePicker({ variant = "header" }: { variant?: "header" | "compact" | "row" }) {
  const { locale } = useLocale();
  const t = useT();
  const [open, setOpen] = useState(false);
  const cur = languageOf(locale);
  return (
    <>
      {variant === "row" ? (
        <button type="button" onClick={() => setOpen(true)} className="flex w-full items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3 text-left ring-1 ring-vk-100 transition hover:ring-vk-300">
          <span className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-vk-50 text-vk-700"><Globe className="h-4.5 w-4.5" /></span>
            <span><span className="block text-[11px] font-bold uppercase tracking-[0.16em] text-vk-700/60">{t("Language")}</span><span className="block text-[15px] font-semibold text-vk-900">{cur.native}</span></span>
          </span>
          <span className="text-[13px] font-semibold text-vk-700">{t("Change")}</span>
        </button>
      ) : (
        <button type="button" onClick={() => setOpen(true)} aria-haspopup="dialog" aria-label={`${t("Language")}: ${cur.native}. ${t("Change language")}`}
          className={variant === "compact"
            ? "inline-flex h-10 items-center gap-1 rounded-xl border border-vk-200 bg-white px-2 text-[13px] font-bold text-vk-800 transition hover:bg-vk-50"
            : "inline-flex h-10 items-center gap-2 rounded-xl border border-vk-200 bg-white px-3 text-[13.5px] font-semibold text-vk-800 transition hover:border-vk-300 hover:bg-vk-50"}>
          <Globe className="h-4 w-4 text-vk-700" />
          {variant === "compact" ? <span lang={locale}>{SHORT_LABEL[locale]}</span> : <span lang={locale}>{cur.native}</span>}
          <ChevronDown className="h-3.5 w-3.5 text-vk-700/60" />
        </button>
      )}
      <Panel open={open} onClose={() => setOpen(false)} />
    </>
  );
}
