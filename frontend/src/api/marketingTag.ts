import axios from "@/lib/axiosInstance";

// GET /marketing-tag → fetch all marketing tags
export async function getAllMarketingTags() {
    const response = await axios.get("/marketing-tag");
    return response.data;
}

// GET /marketing-tag/:id → fetch a single marketing tag
export async function getMarketingTagById(id: number) {
    const response = await axios.get(`/marketing-tag/${id}`);
    return response.data;
}

// GET /marketing-tag/:id/products → get all products by marketing tag
export async function getProductsByMarketingTag(id: number) {
    const response = await axios.get(`/marketing-tag/${id}/products`);
    return response.data;
}

// POST /marketing-tag → create a new marketing tag
export async function createMarketingTag(data: { name: string }) {
    const response = await axios.post("/marketing-tag", data);
    return response.data;
}

// PATCH /marketing-tag/:id → update a marketing tag
export async function updateMarketingTag(id: number, data: { name?: string }) {
    const response = await axios.patch(`/marketing-tag/${id}`, data);
    return response.data;
}

// DELETE /marketing-tag/:id → delete a marketing tag
export async function deleteMarketingTag(id: number) {
    const response = await axios.delete(`/marketing-tag/${id}`);
    return response.data;
} 