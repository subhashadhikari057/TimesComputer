import axios from "@/lib/axiosInstance";
import { apiRequest } from "@/lib/axiosInstance";

// GET /blog → fetch all blogs (no auth)
export async function getAllBlogs() {
  const response = await axios.get("/blog");
  return response.data;
}

// GET /blog/:id → fetch a single blog (no auth)
export async function getBlogById(id: number) {
  const response = await axios.get(`/blog/${id}`);
  return response.data;
}

// POST /blog → create a new blog (auth)
export async function createBlog(formData: FormData) {
  return await apiRequest("POST", "/blog", formData);
}

// PATCH /blog/:id → update a blog (auth)
export async function updateBlog(id: number, formData: FormData) {
  return await apiRequest("PATCH", `/blog/${id}`, formData);
}

// DELETE /blog/:id → delete a blog (auth)
export async function deleteBlog(id: number) {
  return await apiRequest("DELETE", `/blog/${id}`);
}
