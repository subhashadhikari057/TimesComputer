import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../prisma/client";

type UserPayload = {
    id: string;
    role: "ADMIN" | "SUPERADMIN";
};

const ACCESS_SECRET: jwt.Secret = process.env.JWT_SECRET || "access_secret";
const REFRESH_SECRET: jwt.Secret = process.env.JWT_REFRESH_SECRET || "refresh_secret";
const ACCESS_EXPIRES = process.env.JWT_EXPIRES_IN || "15m";
const REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES_IN || "7d";

export const hashPassword = async (plain: string): Promise<string> => {
    return await bcrypt.hash(plain, 10);
};

export const comparePassword = async (
    plain: string,
    hashed: string
): Promise<boolean> => {
    return await bcrypt.compare(plain, hashed);
};

export const generateAccessToken = (user: UserPayload): string => {
    return jwt.sign(
        { userId: user.id, role: user.role },
        ACCESS_SECRET,
        { expiresIn: ACCESS_EXPIRES }
    );
};

export const generateRefreshToken = (user: UserPayload): string => {
    return jwt.sign(
        { userId: user.id, role: user.role },
        REFRESH_SECRET,
        { expiresIn: REFRESH_EXPIRES }
    );
};

export const verifyRefreshToken = (token: string): jwt.JwtPayload => {
    return jwt.verify(token, REFRESH_SECRET) as jwt.JwtPayload;
};


export const getAdminById = async (id: string) => {
    return prisma.adminUser.findUnique({
        where: { id }
    });
};
