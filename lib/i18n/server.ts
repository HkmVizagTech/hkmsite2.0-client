// Server components only (uses next/headers).
import { cookies } from "next/headers";
import { DEFAULT_LOCALE, LOCALE_COOKIE, isLocale, type Locale } from "./config";
import { makeT, type TFunction } from "./translate";

/** The visitor's chosen language (server components / layouts). */
export async function getLocale(): Promise<Locale> {
  const v = (await cookies()).get(LOCALE_COOKIE)?.value;
  return isLocale(v) ? v : DEFAULT_LOCALE;
}

/** Translator for server components: `const t = await getT();` */
export async function getT(): Promise<TFunction> {
  return makeT(await getLocale());
}
