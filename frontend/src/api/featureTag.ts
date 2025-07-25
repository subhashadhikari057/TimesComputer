import axios from "@/lib/axiosInstance";
import { apiRequest } from "@/lib/axiosInstance";

// GET /feature-tag → fetch all feature tags (no auth)
export async function getAllFeatureTags() {
  const response = await axios.get("/feature-tag");
  return response.data;
}

// GET /feature-tag/:id → fetch a single feature tag (no auth)
export async function getFeatureTagById(id: number) {
  const response = await axios.get(`/feature-tag/${id}`);
  return response.data;
}

// GET /feature-tag/products/:id → get all products by feature tag (no auth)
export async function getProductsByFeatureTag(id: number) {
  const response = await axios.get(`/feature-tag/products/${id}`);
  return response.data;
}

// POST /feature-tag → create a new feature tag (auth)
export async function createFeatureTag(data: { name: string }) {
  return await apiRequest("POST", "/feature-tag", data);
}

// PATCH /feature-tag/:id → update a feature tag (auth)
export async function updateFeatureTag(id: number, data: { name?: string }) {
  return await apiRequest("PATCH", `/feature-tag/${id}`, data);
}

// DELETE /feature-tag/:id → delete a feature tag (auth)
export async function deleteFeatureTag(id: number) {
  return await apiRequest("DELETE", `/feature-tag/${id}`);
}
