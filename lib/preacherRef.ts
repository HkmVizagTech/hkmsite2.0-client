// Preacher links: a seva page followed by a devotee's code or DCC id, e.g. /anna-daan-seva/ABRD or /gau-seva/1.
// next.config.ts rewrites these to the plain seva page; this module reads the ref from the URL the visitor opened
// and keeps it for the visit, so any seva donation in that visit is credited to that devotee (the server checks the
// ref against the devotee list; an unknown ref simply falls back to the temple's default receipt ID).

const KEY = "hkm_preacher_ref";
// Keep in sync with next.config.ts (PREACHER_REF / SEVA_PAGE).
const REF = /^(\d{1,4}|[A-Za-z]{2,5}|[A-Za-z]-[A-Za-z])$/;
const NOT_SEVA = /^(admin|api|blogs|bhajans|centers|donate|donations|donor|events|festivals|festival|shop|track|volunteer|web-stories|payment|preacher)$/;

/** The ref in a path like "/anna-daan-seva/ABRD" or "/te/gau-seva/1", else null. */
export function refFromPath(pathname: string): string | null {
  const parts = pathname.replace(/\/+$/, "").split("/").filter(Boolean);
  if (parts[0] === "te" || parts[0] === "en") parts.shift();
  if (parts.length !== 2) return null;
  const [page, ref] = parts;
  if (NOT_SEVA.test(page) || !/^[a-z0-9-]+$/.test(page) || !REF.test(ref)) return null;
  return ref.toUpperCase();
}

/** Remember the ref from the current URL (if any) for this browser visit. */
export function capturePreacherRef(): void {
  if (typeof window === "undefined") return;
  const ref = refFromPath(window.location.pathname);
  if (!ref) return;
  try {
    sessionStorage.setItem(KEY, ref);
  } catch {}
}

/** The preacher ref remembered for this visit, or "". */
export function getPreacherRef(): string {
  if (typeof window === "undefined") return "";
  try {
    return sessionStorage.getItem(KEY) || "";
  } catch {
    return "";
  }
}
