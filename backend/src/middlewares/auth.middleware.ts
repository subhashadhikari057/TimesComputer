import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../service/auth.service";
import prisma from "../prisma/client";
import { AppError } from "../utils/appError";
import { Role } from "@prisma/client";


interface JwtPayload {
    id: number,
    role: Role
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.accToken;
        if (!token) return next(new AppError("Access token not found", 401));

        const decoded = await verifyToken(res, token) as JwtPayload;
        if (!decoded) return next(new AppError("Invalid or expire access token", 401));

        const { id, role } = decoded;
        const user = await prisma.adminUser.findUnique({ where: { id } });
        if (!user) return next(new AppError("user not found", 404));

        req.user = { id, name: user.name, role }
        next();
    } catch (error: any) {
        next(error);
    }
}

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) return next(new AppError("unauthorized", 401));

        if (req.user.role === Role.SUPERADMIN || req.user.role === Role.ADMIN) {
            return next()
        } else {
            return next(new AppError("Forbidden: Admin only", 403));
        }

    } catch (error: any) {
        next(error);
    }
}

export const isSuperadmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) return next(new AppError("unauthorized", 401));

        if (req.user.role === Role.SUPERADMIN) {
            return next()
        } else {
            return next(new AppError("Forbidden: Superadmin only", 403));
        }

    } catch (error: any) {
        next(error);
    }
}

