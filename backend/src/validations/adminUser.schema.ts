import { z } from "zod";
import { Role } from "@prisma/client"; // assumes your Prisma enum is used

// ✅ Schema: Create Admin
export const CreateAdminSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email(),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.nativeEnum(Role),
});

// ✅ Schema: Update Admin (partial, for PATCH)
export const UpdateAdminSchema = z.object({
    name: z.string().min(1).optional(),
    role: z.nativeEnum(Role).optional(),
    isActive: z.boolean().optional(),
});

// ✅ Schema: Admin ID param (for validation if needed)
export const AdminIdParamSchema = z.object({
    id: z.string().uuid(),
});

// ✅ Schema: Password Reset
export const ResetPasswordSchema = z.object({
    password: z.string().min(6, "Password must be at least 6 characters"),
});
