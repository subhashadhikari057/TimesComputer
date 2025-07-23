import axios from "axios";
import { apiRequest } from "@/lib/axiosInstance";
import type { AdminUserInput, AdminPasswordReset } from "@/types/api";

// GET /admin/users → fetch all admin users
export async function getAllAdmins() {
  return await apiRequest("GET", "/admin/users");
}

// GET /admin/users/:id → fetch a single admin user
export async function getAdminById(id: number) {
  return await apiRequest("GET", `/admin/users/${id}`);
}

// POST /admin/users → create a new admin user
export async function createAdminUser(data: AdminUserInput) {
  const response = await axios.post("/admin/users", data);
  return response.data;
}

// PATCH /admin/users/:id → update an admin user
export async function updateAdminUser(id: string, data: Partial<AdminUserInput>) {
  return await apiRequest("PATCH", `/admin/users/${id}`, data);
}

// DELETE /admin/users/:id → delete an admin user
export async function deleteAdminUser(id: string) {
  return await apiRequest("DELETE", `/admin/users/${id}`);
}

// PATCH /admin/users/:id/password → reset admin user password
export async function resetAdminPassword(id: string, data: AdminPasswordReset) {
  return await apiRequest("PATCH", `/admin/users/${id}/password`, data);
}

// Get recent audit logs
export const getAuditLogs = async (limit: number = 10) => {
  return await apiRequest("GET", `/admin/users/logs/audit?limit=${limit}`);
};

// Get recent login logs
export const getLoginLogs = async (limit: number = 10) => {
  return await apiRequest("GET", `/admin/users/logs/login?limit=${limit}`);
};
