import axios from "@/lib/axiosInstance";
import { apiRequest } from "@/lib/axiosInstance";

// GET /ads → fetch all ads (no auth)
export async function getAllAds(placement?: string) {
  const params = placement ? { placement } : {};
  const response = await axios.get("/ads", { params });
  return response.data;
}

// GET /ads/:id → fetch a single ad (no auth)
export async function getAdById(id: number) {
  const response = await axios.get(`/ads/${id}`);
  return response.data;
}

// POST /ads → create a new ad (auth)
export async function createAd(formData: FormData) {
  return await apiRequest("POST", "/ads", formData);
}

// PATCH /ads/:id → update an ad (auth)
export async function updateAd(id: number, formData: FormData) {
  return await apiRequest("PATCH", `/ads/${id}`, formData);
}

// DELETE /ads/:id → delete an ad (auth)
export async function deleteAd(id: number) {
  return await apiRequest("DELETE", `/ads/${id}`);
}
