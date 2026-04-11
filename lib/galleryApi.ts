import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const getGalleryImages = async () => {
  const url = `${API_BASE}/gallery`;
  try {
    const res = await axios.get(url);
    return res?.data?.items ?? [];
  } catch {
   
    try {
      await new Promise((r) => setTimeout(r, 300));
      const res = await axios.get(url);
      return res?.data?.items ?? [];
    } catch (err2: unknown) {
      const msg = err2 && typeof err2 === 'object' && 'message' in err2 ? String((err2 as any).message) : String(err2);
      console.warn('getGalleryImages: failed to fetch gallery images', msg);
      return [];
    }
  }
};

export const createGalleryImage = async (
  data: { title: string; description?: string; images: string[]; date: string; category?: string; type?: string; status?: string }
) => {
  const res = await axios.post(`${API_BASE}/gallery`, data, {
    withCredentials: true,
  });
  return res.data.item;
};

export const updateGalleryImage = async (
  id: string,
  data: { title?: string; description?: string; images?: string[]; date?: string; category?: string; type?: string; status?: string },
  token: string
) => {
  const res = await axios.put(`${API_BASE}/gallery/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true,
  });
  return res.data.item;
};

export const deleteGalleryImage = async (id: string) => {
  await axios.delete(`${API_BASE}/gallery/${id}`, {
    withCredentials: true,
  });
};
