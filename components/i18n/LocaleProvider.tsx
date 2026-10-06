"use client";

import { createContext, useCallback, useContext, useMemo } from "react";
import { DEFAULT_LOCALE, LOCALE_COOKIE, type Locale } from "@/lib/i18n/config";
import { makeT, type TFunction } from "@/lib/i18n/translate";

type Ctx = { locale: Locale; t: TFunction; setLocale: (l: Locale) => void };

const LocaleContext = createContext<Ctx>({
  locale: DEFAULT_LOCALE,
  t: makeT(DEFAULT_LOCALE),
  setLocale: () => {},
});

export function LocaleProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  const t = useMemo(() => makeT(locale), [locale]);
  const setLocale = useCallback((next: Locale) => {
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
    // Re-render on the server in the new language (same URL).
    window.location.reload();
  }, []);
  const value = useMemo(() => ({ locale, t, setLocale }), [locale, t, setLocale]);
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

/** Translator for client components: `const t = useT();` */
export const useT = () => useContext(LocaleContext).t;
export const useLocale = () => useContext(LocaleContext);
