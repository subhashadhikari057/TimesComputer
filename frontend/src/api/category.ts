import axios from "@/lib/axiosInstance";

// GET /category → fetch all categories
export async function getAllCategories() {
  const response = await axios.get("/category");
  return response.data;
}

// GET /category/:id → fetch a single category
export async function getCategoryById(id: number) {
  const response = await axios.get(`/category/${id}`);
  return response.data;
}

// POST /category → create a new category (with image/icon via FormData)
export async function createCategory(formData: FormData) {
  const response = await axios.post("/category", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

// PATCH /category/:id → update an existing category (with image/icon via FormData)
export async function updateCategory(id: number, formData: FormData) {
  const response = await axios.patch(`/category/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

// DELETE /category/:id → delete a category
export async function deleteCategory(id: number) {
  const response = await axios.delete(`/category/${id}`);
  return response.data;
}