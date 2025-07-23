import axios from "@/lib/axiosInstance";
import { apiRequest } from "@/lib/axiosInstance";

// GET /brand → fetch all brands (no auth)
export async function getAllBrands() {
  const response = await axios.get("/brand");
  return response.data;
}

// GET /brand/:id → fetch a single brand (no auth)
export async function getBrandById(id: number) {
  const response = await axios.get(`/brand/${id}`);
  return response.data;
}

// POST /brand → create a new brand (auth)
export async function createBrand(formData: FormData) {
  return await apiRequest("POST", "/brand", formData);
}

// PATCH /brand/:id → update an existing brand (auth)
export async function updateBrand(id: number, formData: FormData) {
  return await apiRequest("PATCH", `/brand/${id}`, formData);
}

// DELETE /brand/:id → delete a brand (auth)
export async function deleteBrand(id: number) {
  return await apiRequest("DELETE", `/brand/${id}`);
}
