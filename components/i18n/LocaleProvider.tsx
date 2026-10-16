"use client";

import { createContext, useCallback, useContext, useEffect, useMemo } from "react";
import { DEFAULT_LOCALE, LOCALE_COOKIE, type Locale } from "@/lib/i18n/config";
import { localizedPath } from "@/lib/i18n/routing";
import { makeT, type TFunction } from "@/lib/i18n/translate";

type Ctx = { locale: Locale; t: TFunction; setLocale: (l: Locale) => void };

const LocaleContext = createContext<Ctx>({
  locale: DEFAULT_LOCALE,
  t: makeT(DEFAULT_LOCALE),
  setLocale: () => {},
});

export function LocaleProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  const t = useMemo(() => makeT(locale), [locale]);
  // The shared root layout always renders <html lang="en">; correct it for
  // Telugu pages once hydrated (screen readers, browser translate prompts).
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  const setLocale = useCallback((next: Locale) => {
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
    // Telugu has its own URLs (/te/…), English the plain ones; proxy.ts uses
    // the cookie so links to plain URLs stay in the chosen language.
    const { pathname, search, hash } = window.location;
    window.location.assign(localizedPath(pathname, next) + search + hash);
  }, []);
  const value = useMemo(() => ({ locale, t, setLocale }), [locale, t, setLocale]);
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

/** Translator for client components: `const t = useT();` */
export const useT = () => useContext(LocaleContext).t;
export const useLocale = () => useContext(LocaleContext);
