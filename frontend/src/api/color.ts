import axios from "@/lib/axiosInstance";

// GET /color → fetch all colors
export async function getAllColors() {
  const response = await axios.get("/colors");
  return response.data;
}

// GET /color/:id → fetch a single color
export async function getColorById(id: number) {
  const response = await axios.get(`/colors/${id}`);
  return response.data;
}

// GET /color/product/:id → get all products using a specific color
export async function getProductByColorId(id: number) {
  const response = await axios.get(`/colors/product/${id}`);
  return response.data;
}

// POST /color → create a new color
export async function createColor(formData: FormData) {
  const response = await axios.post("/colors", formData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
}

// PATCH /color/:id → update a color
export async function updateColor(id: number, formData: FormData) {
  const response = await axios.patch(`/colors/${id}`, formData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
}

// DELETE /color/:id → delete a color
export async function deleteColor(id: number) {
  const response = await axios.delete(`/colors/${id}`);
  return response.data;
}