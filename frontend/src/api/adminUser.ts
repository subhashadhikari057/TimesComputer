import axios from "@/lib/axiosInstance";

// GET /admin/users → fetch all admin users
export async function getAllAdmins() {
    const response = await axios.get("/admin/users");
    return response.data;
}

// GET /admin/users/:id → fetch a single admin user
export async function getAdminById(id: number) {
    const response = await axios.get(`/admin/users/${id}`);
    return response.data;
}

// POST /admin/users → create a new admin user
export async function createAdminUser(data: any) {
    const response = await axios.post("/admin/users", data);
    return response.data;
}

// PATCH /admin/users/:id → update an admin user
export async function updateAdminUser(id: number, data: any) {
    const response = await axios.patch(`/admin/users/${id}`, data);
    return response.data;
}

// DELETE /admin/users/:id → delete an admin user
export async function deleteAdminUser(id: number) {
    const response = await axios.delete(`/admin/users/${id}`);
    return response.data;
} 