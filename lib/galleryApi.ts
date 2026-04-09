import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const getGalleryImages = async () => {
  const res = await axios.get(`${API_BASE}/gallery`);
  return res.data.items;
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
