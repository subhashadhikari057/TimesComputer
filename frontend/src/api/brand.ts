import axios from "@/lib/axiosInstance";

// GET /brand → fetch all brands
export async function getAllBrands() {
    const response = await axios.get("/brand");
    return response.data;
}

// GET /brand/:id → fetch a single brand
export async function getBrandById(id: number) {
    const response = await axios.get(`/brand/${id}`);
    return response.data;
}

// POST /brand → create a new brand (with image/icon via FormData)
export async function createBrand(formData: FormData) {
    const response = await axios.post("/brand", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
}

// PATCH /brand/:id → update an existing brand (with image/icon via FormData)
export async function updateBrand(id: number, formData: FormData) {
    const response = await axios.patch(`/brand/${id}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
}

// DELETE /brand/:id → delete a brand
export async function deleteBrand(id: number) {
    const response = await axios.delete(`/brand/${id}`);
    return response.data;
}