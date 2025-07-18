import axios from "@/lib/axiosInstance";

// POST /auth/refresh/login → login
export async function login(data: { email: string; password: string }) {
    const response = await axios.post("/auth/refresh/login", data);
    return response.data;
}

// POST /auth/refresh/logout → logout
export async function logout() {
    const response = await axios.post("/auth/refresh/logout");
    return response.data;
}

// POST /auth/refresh/renewtoken → refresh token
export async function refreshToken() {
    const response = await axios.post("/auth/refresh/renewtoken");
    return response.data;
}

// PATCH /auth/change-password → change password
export async function changePassword(data: { oldPassword: string; newPassword: string }) {
    const response = await axios.patch("/auth/change-password", data);
    return response.data;
} 