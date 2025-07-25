import axios from "@/lib/axiosInstance";
import { apiRequest } from "@/lib/axiosInstance";

// GET /marketing-tag → fetch all marketing tags (no auth)
export async function getAllMarketingTags() {
  const response = await axios.get("/marketing-tag");
  return response.data;
}

// GET /marketing-tag/:id → fetch a single marketing tag (no auth)
export async function getMarketingTagById(id: number) {
  const response = await axios.get(`/marketing-tag/${id}`);
  return response.data;
}

// GET /marketing-tag/:id/products → get all products by marketing tag (no auth)
export async function getProductsByMarketingTag(id: number) {
  const response = await axios.get(`/marketing-tag/${id}/products`);
  return response.data;
}

// POST /marketing-tag → create a new marketing tag (auth)
export async function createMarketingTag(data: { name: string }) {
  return await apiRequest("POST", "/marketing-tag", data);
}

// PATCH /marketing-tag/:id → update a marketing tag (auth)
export async function updateMarketingTag(id: number, data: { name?: string }) {
  return await apiRequest("PATCH", `/marketing-tag/${id}`, data);
}

// DELETE /marketing-tag/:id → delete a marketing tag (auth)
export async function deleteMarketingTag(id: number) {
  return await apiRequest("DELETE", `/marketing-tag/${id}`);
}
