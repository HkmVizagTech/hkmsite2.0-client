import axios from "axios";

// Backs the homepage's "Today's Darshan" section. Unlike the general
// /gallery collection (hand-curated by admins, browsable by date), this
// endpoint holds exactly one thing: whatever set of daily darshan photos is
// currently active in the Vaikuntham admin panel. Vaikuntham pushes a full
// replace here on every add/edit/block/delete, so there's no local
// filtering/grouping to do — the list returned IS the current darshan set,
// already ordered newest-first via `position`.
const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "") || "http://localhost:5000/api";

export interface DarshanPhoto {
  vaikunthamId: number;
  imageUrl: string;
  position: number;
  syncedAt: string;
}

export const getDarshanPhotos = async (): Promise<DarshanPhoto[]> => {
  const url = `${API_BASE}/darshan`;
  try {
    const res = await axios.get(url);
    return res?.data?.items ?? [];
  } catch {
    try {
      await new Promise((r) => setTimeout(r, 300));
      const res = await axios.get(url);
      return res?.data?.items ?? [];
    } catch (err2: unknown) {
      const msg = err2 && typeof err2 === "object" && "message" in err2 ? String((err2 as any).message) : String(err2);
      console.warn("getDarshanPhotos: failed to fetch darshan photos", msg);
      return [];
    }
  }
};
