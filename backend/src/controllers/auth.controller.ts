import { Request, Response } from "express";
import prisma from "../prisma/client";
import {
    hashPassword,
    comparePassword,
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
} from "../services/auth.service";
import {
    LoginSchema,
    RegisterSchema,
    ChangePasswordSchema,
} from "../validations/auth.schema";


// ✅ POST /auth/register — Superadmin only if no users exist
export const register = async (req: Request, res: Response) => {
    const body = RegisterSchema.safeParse(req.body);
    if (!body.success) return res.status(400).json({ error: body.error.errors });

    const { name, email, password } = body.data;

    const existingAdmins = await prisma.adminUser.count();
    if (existingAdmins > 0) {
        return res.status(403).json({ message: "Superadmin already exists." });
    }

    const hashed = await hashPassword(password);
    const user = await prisma.adminUser.create({
        data: {
            name,
            email,
            password: hashed,
            role: "SUPERADMIN",
            isActive: true,
        },
    });

    res.status(201).json({
        message: "Superadmin created",
        user: { id: user.id, email: user.email },
    });
};

export const login = async (req: Request, res: Response) => {
    const body = LoginSchema.safeParse(req.body);
    if (!body.success)
        return res.status(400).json({ error: body.error.errors });

    const { email, password } = body.data;

    // 🔐 Check for lockout — 5 failed attempts in last 15 minutes
    const recentAttempts = await prisma.loginLog.findMany({
        where: {
            email,
            createdAt: {
                gte: new Date(Date.now() - 15 * 60 * 1000), // last 15 minutes
            },
        },
        orderBy: { createdAt: "desc" },
        take: 5,
    });

    const failedCount = recentAttempts.filter(a => !a.success).length;

    if (failedCount >= 5) {
        return res.status(429).json({
            message: "Too many failed attempts. Try again in 15 minutes.",
        });
    }

    const user = await prisma.adminUser.findUnique({ where: { email } });

    const valid = user && user.isActive
        ? await comparePassword(password, user.password)
        : false;

    // 🔍 Log this login attempt
    await prisma.loginLog.create({
        data: {
            email,
            ip: req.ip || "unknown",
            success: valid,
            userAgent: req.headers["user-agent"] || "unknown",
        },
    });

    if (!user || !valid) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = generateAccessToken({ id: user.id, role: user.role });
    const refreshToken = generateRefreshToken({ id: user.id, role: user.role });

    const cookieOptions = {
        httpOnly: true,
        secure: process.env.COOKIE_SECURE === "true",
        sameSite: "strict" as const,
    };

    res
        .cookie("token", accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 })
        .cookie("refreshToken", refreshToken, {
            ...cookieOptions,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        .json({
            message: "Logged in",
            user: { id: user.id, role: user.role, email: user.email },
        });
};


// ✅ POST /auth/logout — Clears cookies
export const logout = async (_req: Request, res: Response) => {
    res.clearCookie("token").clearCookie("refreshToken").json({ message: "Logged out" });
};

// ✅ POST /auth/refresh — Validates and rotates refresh token
export const refresh = async (req: Request, res: Response) => {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ message: "Refresh token missing" });

    try {
        const decoded = verifyRefreshToken(token);

        // ✅ Create new rotated tokens
        const newAccessToken = generateAccessToken({
            id: decoded.userId,
            role: decoded.role,
        });

        const newRefreshToken = generateRefreshToken({
            id: decoded.userId,
            role: decoded.role,
        });

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.COOKIE_SECURE === "true",
            sameSite: "strict" as const,
        };

        res
            .cookie("token", newAccessToken, {
                ...cookieOptions,
                maxAge: 15 * 60 * 1000,
            })
            .cookie("refreshToken", newRefreshToken, {
                ...cookieOptions,
                maxAge: 7 * 24 * 60 * 60 * 1000,
            })
            .json({ message: "Token rotated" });
    } catch (err) {
        return res.status(403).json({ message: "Invalid refresh token" });
    }
};


// ✅ PATCH /auth/change-password — User must be logged in
export const changePassword = async (req: Request, res: Response) => {
    const userId = (req as any).user?.id;

    if (!userId || typeof userId !== "string") {
        return res.status(401).json({ message: "Not authorized" });
    }

    const body = ChangePasswordSchema.safeParse(req.body);
    if (!body.success) {
        return res.status(400).json({ error: body.error.errors });
    }

    const { oldPassword, newPassword } = body.data;

    const user = await prisma.adminUser.findUnique({
        where: { id: userId },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    const valid = await comparePassword(oldPassword, user.password);
    if (!valid)
        return res.status(400).json({ message: "Old password is incorrect" });

    const hashed = await hashPassword(newPassword);

    await prisma.adminUser.update({
        where: { id: userId },
        data: { password: hashed },
    });

    res.json({ message: "Password changed successfully" });
};
