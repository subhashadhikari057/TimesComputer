import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// import prisma from "../prisma/client";
import { Response } from "express";


const ACCESS_SECRET: jwt.Secret = process.env.ACCESS_SECRET as string;
const REFRESH_SECRET: jwt.Secret = process.env.REFRESH_SECRET as string;

export const hashPassword = async (plain: string): Promise<string> => {
    return await bcrypt.hash(plain, 10);
};

export const comparePassword = async (
    plain: string,
    hashed: string
): Promise<boolean> => {
    return await bcrypt.compare(plain, hashed);
};

export const attachAccessToken = (user: User, res: Response): Response => {
    const token = jwt.sign(
        { email: user?.email, role: user?.role },
        ACCESS_SECRET,
        { expiresIn: '1h' }
    );
    return res.cookie("access_token", token, {
        path: '/api',
        httpOnly: true,
        secure: process.env.SECURE === "true",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60, // 1 hour
    });
};

export const attachRefreshToken = (user: User, res: Response): Response => {
    const token = jwt.sign(
        { email: user?.email, role: user?.role },
        REFRESH_SECRET,
        { expiresIn: '7d' }
    );
    return res.cookie("refresh_token", token, {
        path: '/api/auth/refresh',
        httpOnly: true,
        secure: process.env.SECURE === "true",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });
};


export const verifyRefreshToken = (token: string): jwt.JwtPayload => {
    return jwt.verify(token, REFRESH_SECRET) as jwt.JwtPayload;
};
