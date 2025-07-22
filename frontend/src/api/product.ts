import axios from "@/lib/axiosInstance";

// GET /product → fetch all products
export async function getAllProducts() {
    const response = await axios.get("/product");
    return response.data;
}

// GET /product/:id → fetch a single product
export async function getProductById(id: number) {
    const response = await axios.get(`/product/${id}`);
    return response.data;
}

// GET /product/slug/:slug → fetch product by slug
export async function getProductBySlug(slug: string) {
    const response = await axios.get(`/product/slug/${slug}`);
    return response.data;
}

// POST /product/view/:slug → increment product view count
export async function incrementProductView(slug: string) {
    try {
        const response = await axios.post(`/product/view/${slug}`);
        return response.data;
    } catch (error) {
        console.error('Failed to increment view count:', error);
        // Don't throw error to avoid breaking the page if view tracking fails
        return null;
    }
}

// POST /product → create a new product (with images via FormData)
export async function createProduct(formData: FormData) {
    const response = await axios.post("/product", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
}

// PATCH /product/:id → update a product (with images via FormData)
export async function updateProduct(id: number, formData: FormData) {
    const response = await axios.patch(`/product/${id}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
}

// DELETE /product/:id → delete a product
export async function deleteProduct(id: number) {
    const response = await axios.delete(`/product/${id}`);
    return response.data;
} 