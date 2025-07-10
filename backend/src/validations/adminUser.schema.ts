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
    role: z.enum(["ADMIN", "SUPERADMIN"]).optional(),
    isActive: z.boolean().optional()
}).strict();

// ✅ Schema: Admin ID param (for validation if needed)
export const AdminIdParamSchema = z.object({
    id: z.string().uuid(),
});

// ✅ Schema: Password Reset
export const ResetPasswordSchema = z.object({
    newPassword: z.string().min(6),
    confirmPassword: z.string().min(6)
}).refine(data => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
});
