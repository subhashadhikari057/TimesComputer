import { Request, Response } from "express";
import prisma from "../prisma/client";
import {
    hashPassword,
    comparePassword,
    attachAccessToken,
    attachRefreshToken,
    verifyRefreshToken,
} from "../services/auth.service";
import {
    LoginSchema,
    ChangePasswordSchema,
} from "../validations/auth.schema";

// ✅ GET /auth/verify
export const verify = async (req: Request, res: Response) => {
    // If we reach here, the authenticate middleware has already verified the token
    const user = (req as any).user;
    res.json({ 
        message: "Token is valid",
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
        }
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

    const user: User = await prisma.adminUser.findUnique({ where: { email } });
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

    attachAccessToken(user, res);
    attachRefreshToken(user, res);

    return res.status(200).json({ user: { name: user.name, email: user.email, role: user.role } });
};


// ✅ POST /auth/refresh/logout — Clears cookies
export const logout = async (_req: Request, res: Response) => {

    res.clearCookie("access_token", {
        httpOnly: true,
        secure: process.env.SECURE === "true",
        sameSite: "strict",
        path: "/api",
    });

    res.clearCookie("refresh_token", {
        httpOnly: true,
        secure: process.env.SECURE === "true",
        sameSite: "strict",
        path: "/api/auth/refresh",
    });

    return res.json({ message: "Logout Successful." });

};

// ✅ POST /auth/refresh/renewtoken — Validates refresh token
export const refresh = async (req: Request, res: Response) => {
    const token = req.cookies.refresh_token;
    if (!token) return res.status(401).json({ message: "Refresh token missing" });

    try {
        const decoded = verifyRefreshToken(token);
        attachAccessToken(decoded as User, res);
        return res.sendStatus(200);
    } catch (err) {
        return res.status(403).json({ message: "Invalid refresh token" });
    }
};


// ✅ PATCH /auth/change-password — User must be logged in
export const changePassword = async (req: Request, res: Response) => {
    const userEmail = (req as any).user?.email;

    if (!userEmail || typeof userEmail !== "string") {
        return res.status(401).json({ message: "Not authorized" });
    }

    const body = ChangePasswordSchema.safeParse(req.body);
    if (!body.success) {
        return res.status(400).json({ message: body.error.errors });
    }

    const { oldPassword, newPassword } = body.data;

    const user = await prisma.adminUser.findFirst({
        where: { email: userEmail, isActive: true },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    const valid = await comparePassword(oldPassword, user.password);
    
    if (!valid)
        return res.status(400).json({ message: "Old password is incorrect" });

    const hashedPw = await hashPassword(newPassword);

    await prisma.adminUser.update({
        where: { email: userEmail },
        data: { password: hashedPw },
    });

    return res.status(200).json({ message: "Password changed successfully" });
};
