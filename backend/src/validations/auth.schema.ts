// src/validations/auth.schema.ts
import { z } from "zod";

// Login: email and password required
export const LoginSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

// Register: name, email, password (Superadmin only)
export const RegisterSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

// Change password (logged-in user)
export const ChangePasswordSchema = z
    .object({
        oldPassword: z.string().min(6),
        newPassword: z.string().min(6),
        confirmPassword: z.string().min(6),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "New passwords do not match",
        path: ["confirmPassword"],
    });
