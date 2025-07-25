import axios from "@/lib/axiosInstance";
import { apiRequest } from "@/lib/axiosInstance";

// GET /product → fetch all products (no auth)
export async function getAllProducts() {
    const response = await axios.get("/product");
    return response.data;
}

// GET /product/:id → fetch a single product (no auth)
export async function getProductById(id: number) {
  const response = await axios.get(`/product/${id}`);
  return response.data;
}

// GET /product/slug/:slug → fetch product by slug (no auth)
export async function getProductBySlug(slug: string) {
  const response = await axios.get(`/product/slug/${slug}`);
  return response.data;
}

// POST /product/view/:slug → increment product view count (no auth, catch errors)
export async function incrementProductView(slug: string) {

    try {
        const response = await axios.post(`/product/view/${slug}`);
        return response.data;
    } catch {
        // Don't throw error to avoid breaking the page if view tracking fails
        return null;
    }

}

// POST /product → create a new product (auth)
export async function createProduct(formData: FormData) {
  return await apiRequest("POST", "/product", formData);
}

// PATCH /product/:id → update a product (auth)
export async function updateProduct(id: number, formData: FormData) {
  return await apiRequest("PATCH", `/product/${id}`, formData);
}

// DELETE /product/:id → delete a product (auth)
export async function deleteProduct(id: number) {
  return await apiRequest("DELETE", `/product/${id}`);
}
