"use client";

import { useEffect, useState } from "react";
import { getPreacherRef } from "./preacherRef";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "") || "http://localhost:8080";

/**
 * True when this visit came through a preacher's seva link (a seva page followed by a code, e.g.
 * /anna-daan-seva/ABRD) AND that code credits a preacher (DCC id other than 36). Those donations get no Maha
 * Prasadam. A code the temple doesn't recognise falls back to the default ID 36, so it stays false.
 */
export function usePreacherLink(): boolean {
  const [credited, setCredited] = useState(false);
  useEffect(() => {
    const ref = getPreacherRef();
    if (!ref) return;
    let alive = true;
    fetch(`${API_URL}/temple-devotees/ref-check/${encodeURIComponent(ref)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => { if (alive && j && j.credited) setCredited(true); })
      .catch(() => {});
    return () => { alive = false; };
  }, []);
  return credited;
}
