import axios from "@/lib/axiosInstance";
import { apiRequest } from "@/lib/axiosInstance";

// GET /category → fetch all categories (no auth)
export async function getAllCategories() {
  const response = await axios.get("/category");
  return response.data;
}

// GET /category/:id → fetch a single category (no auth)
export async function getCategoryById(id: number) {
  const response = await axios.get(`/category/${id}`);
  return response.data;
}

// POST /category → create a new category (auth)
export async function createCategory(formData: FormData) {
  return await apiRequest("POST", "/category", formData);
}

// PATCH /category/:id → update an existing category (auth)
export async function updateCategory(id: number, formData: FormData) {
  return await apiRequest("PATCH", `/category/${id}`, formData);
}

// DELETE /category/:id → delete a category (auth)
export async function deleteCategory(id: number) {
  return await apiRequest("DELETE", `/category/${id}`);
}
