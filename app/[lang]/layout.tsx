import { notFound } from "next/navigation";
import { LocaleProvider } from "@/components/i18n/LocaleProvider";
import LanguageToggle from "@/components/i18n/LanguageToggle";
import { LOCALES, isLocale } from "@/lib/i18n/config";

// Every public page sits under this segment: /en/… (served at /… — see the
// rewrites in next.config.ts) and /te/…. Both languages are prerendered, so pages come from the
// CDN cache instead of being rendered per request. Staff tools (/admin,
// /donations/admin) live outside it and are always English.
export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return (
    <LocaleProvider locale={lang}>
      {/* The root layout is shared and static, so it always says lang="en". */}
      {lang !== "en" && (
        <script dangerouslySetInnerHTML={{ __html: `document.documentElement.lang=${JSON.stringify(lang)}` }} />
      )}
      {children}
      <LanguageToggle />
    </LocaleProvider>
  );
}
