import axios from "@/lib/axiosInstance";
import { apiRequest } from "@/lib/axiosInstance";

// POST /auth/refresh/login → login (no auth)
export async function login(data: { email: string; password: string }) {
  const response = await axios.post("/auth/refresh/login", data);
  return response.data;
}

// POST /auth/refresh/logout → logout (no auth)
export async function logout() {
  const response = await axios.post("/auth/refresh/logout");
  return response.data;
}

// POST /auth/refresh/renewtoken → refresh token (no auth)
export async function refreshToken() {
  const response = await axios.post("/auth/refresh/renewtoken");
  return response.data;
}

// PATCH /auth/change-password → change password (requires auth)
export async function changePassword(data: { oldPassword: string; newPassword: string; confirmPassword: string }) {
  return await apiRequest("PATCH", "/auth/change-password", data);
}
