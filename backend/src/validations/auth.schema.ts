import { z } from 'zod';

export const RegisterSchema = z.object({
    name: z.string().min(2, "Name is too short."),
    email: z.string().email("Invalid email format."),
    password: z.string().min(8, "Password must be at least 8 character.")
});

export const LoginSchema = z.object({
    email: z.string().email("Invalid email."),
    password: z.string().min(8, "Password must be at least 8 character")
});

export const ChangePasswordSchema = z.object({
    oldPassword: z.string().min(8, "Password required"),
    newPassword: z.string().min(8, "Password required"),
    confirmPassword: z.string().min(8, "Password required")
}).superRefine((data, ctx) => {
    if (data.newPassword !== data.confirmPassword) {
        ctx.addIssue({
            path: ["confirmPassword"],
            message: "Confirm password do not match",
            code: "custom"
        });
    }
})

export const AdminPasswordSchema = z.object({
    newPassword: z.string().min(8, "Password required"),
    confirmPassword: z.string().min(8, "Password required")
}).superRefine((data, ctx) => {
    if (data.newPassword !== data.confirmPassword) {
        ctx.addIssue({
            path: ["confirmPassword"],
            message: "Confirm password do not match",
            code: "custom"
        });
    }
});