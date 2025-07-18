import axios from "@/lib/axiosInstance";

// GET /blog → fetch all blogs
export async function getAllBlogs() {
    const response = await axios.get("/blog");
    return response.data;
}

// GET /blog/:id → fetch a single blog
export async function getBlogById(id: number) {
    const response = await axios.get(`/blog/${id}`);
    return response.data;
}

// POST /blog → create a new blog (with image via FormData)
export async function createBlog(formData: FormData) {
    const response = await axios.post("/blog", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
}

// PATCH /blog/:id → update a blog (with image via FormData)
export async function updateBlog(id: number, formData: FormData) {
    const response = await axios.patch(`/blog/${id}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
}

// DELETE /blog/:id → delete a blog
export async function deleteBlog(id: number) {
    const response = await axios.delete(`/blog/${id}`);
    return response.data;
} 