import axios from "@/lib/axiosInstance";

// GET /ads → fetch all ads
export async function getAllAds() {
    const response = await axios.get("/ads");
    return response.data;
}

// GET /ads/:id → fetch a single ad
export async function getAdById(id: number) {
    const response = await axios.get(`/ads/${id}`);
    return response.data;
}

// POST /ads → create a new ad (with image via FormData)
export async function createAd(formData: FormData) {
    const response = await axios.post("/ads", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
}

// PATCH /ads/:id → update an ad (with image via FormData)
export async function updateAd(id: number, formData: FormData) {
    const response = await axios.patch(`/ads/${id}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
}

// DELETE /ads/:id → delete an ad
export async function deleteAd(id: number) {
    const response = await axios.delete(`/ads/${id}`);
    return response.data;
} 