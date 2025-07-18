import axios from "@/lib/axiosInstance";

// GET /feature-tag → fetch all feature tags
export async function getAllFeatureTags() {
  const response = await axios.get("/feature-tag");
  return response.data;
}

// GET /feature-tag/:id → fetch a single feature tag
export async function getFeatureTagById(id: number) {
  const response = await axios.get(`/feature-tag/${id}`);
  return response.data;
}

// GET /feature-tag/products/:id → get all products by feature tag
export async function getProductsByFeatureTag(id: number) {
  const response = await axios.get(`/feature-tag/products/${id}`);
  return response.data;
}

// POST /feature-tag → create a new feature tag
export async function createFeatureTag(data: { name: string }) {
  const response = await axios.post("/feature-tag", data);
  return response.data;
}

// PATCH /feature-tag/:id → update a feature tag
export async function updateFeatureTag(id: number, data: { name?: string }) {
  const response = await axios.patch(`/feature-tag/${id}`, data);
  return response.data;
}

// DELETE /feature-tag/:id → delete a feature tag
export async function deleteFeatureTag(id: number) {
  const response = await axios.delete(`/feature-tag/${id}`);
  return response.data;
} 