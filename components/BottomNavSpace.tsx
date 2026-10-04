"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { shouldHideBottomNav } from "@/lib/navConfig";

/**
 * Tells the page whether the mobile bottom bar is shown on this route by
 * setting <html data-bottom-nav="on|off">. CSS turns that into
 * --bottom-nav-space, which the body padding, sticky donate bars and the
 * WhatsApp button use, so nothing floats above an empty gap when the bar
 * is hidden (donation pages, shop).
 */
export default function BottomNavSpace() {
  const pathname = usePathname();
  useEffect(() => {
    document.documentElement.dataset.bottomNav = shouldHideBottomNav(pathname) ? "off" : "on";
  }, [pathname]);
  return null;
}
