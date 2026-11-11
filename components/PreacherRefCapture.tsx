"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { capturePreacherRef } from "@/lib/preacherRef";

/** Remembers a preacher link's code/id (e.g. /anna-daan-seva/ABRD) for the rest of the visit. Renders nothing. */
export default function PreacherRefCapture() {
  const pathname = usePathname();
  useEffect(() => {
    capturePreacherRef();
  }, [pathname]);
  return null;
}
