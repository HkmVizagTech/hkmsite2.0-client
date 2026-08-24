"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ReactNode } from "react";

// Theme handling for the whole app:
//  - attribute="class" toggles the `dark` class on <html> (tailwind darkMode: ["class"])
//  - storageKey keeps the existing "hkm-theme" localStorage key so previously
//    saved preferences still work.
// next-themes injects a small inline script before first paint, which prevents
// the light-mode "flash" that the old manual toggle produced on every page load.
// Dark mode has been removed sitewide. forcedTheme="light" is next-themes'
// documented way to permanently lock the theme: the `dark` class is never
// applied to <html>, useTheme() always resolves "light" everywhere it's
// used (including sonner.tsx's toasts), and any leftover setTheme() calls
// become no-ops. This is intentionally kept simple rather than removing
// next-themes outright or stripping the many scattered `dark:` Tailwind
// utility classes across the codebase — those become permanently inert
// dead code instead, which is safe and avoids a large, risky sweep.
const ThemeProvider = ({ children }: { children: ReactNode }) => (
  <NextThemesProvider attribute="class" forcedTheme="light">
    {children}
  </NextThemesProvider>
);

export default ThemeProvider;
