import axios from "@/lib/axiosInstance";
import { apiRequest } from "@/lib/axiosInstance";

// GET /color → fetch all colors (no auth)
export async function getAllColors() {
  const response = await axios.get("/colors");
  return response.data;
}

// GET /color/:id → fetch a single color (no auth)
export async function getColorById(id: number) {
  const response = await axios.get(`/colors/${id}`);
  return response.data;
}

// GET /color/product/:id → get all products by color (no auth)
export async function getProductByColorId(id: number) {
  const response = await axios.get(`/colors/product/${id}`);
  return response.data;
}

// POST /color → create a new color (auth)
export async function createColor(formData: FormData) {
  return await apiRequest("POST", "/colors", formData);
}

// PATCH /color/:id → update a color (auth)
export async function updateColor(id: number, formData: FormData) {
  return await apiRequest("PATCH", `/colors/${id}`, formData);
}

// DELETE /color/:id → delete a color (auth)
export async function deleteColor(id: number) {
  return await apiRequest("DELETE", `/colors/${id}`);
}
