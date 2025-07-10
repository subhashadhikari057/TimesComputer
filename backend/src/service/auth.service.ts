// Third-party modules
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Response } from "express";

// hash user password 
export const hashPassword = async (password: string) => {
    try {
        const hash = await bcrypt.hash(password, 10);
        return hash;
    } catch (error: any) {
        console.error("Failed to hash password:", error.message);
        throw new Error("Failed to hash password");
    }
}

// verify input password againts store hash 
export const verifyPassword = async (password: string, userPassword: string) => {
    try {
        const isMatch = await bcrypt.compare(password, userPassword);
        return isMatch;
    } catch (error: any) {
        console.error("Failed to verify password:", error.message);
        throw new Error("Failed to verify password");
    }
}

// Generate access token
export const generateAccToken = async (res: Response, id: number, role: string) => {
    try {
        const token = jwt.sign({ id, role }, process.env.ACC_SECRETKEY as string, { expiresIn: "15m" });
        res.cookie("accToken", token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            path: "/",
            maxAge: 15 * 60 * 1000
        });
        return token;
    } catch (error: any) {
        console.error("Failed to create access token:", error.message);
        throw new Error("Failed to create token");
    }
}

// Generte reference token
export const generateRefToken = async (res: Response, id: number, role: string) => {
    try {
        const token = jwt.sign({ id, role }, process.env.REF_SECRETKEY as string, { expiresIn: "7d" });
        res.cookie("refToken", token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            path: "/",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        return token;
    } catch (error: any) {
        console.error("Failed to create refresh token:", error.message);
        throw new Error("Failed to create token");
    }
}

export const verifyToken = async (res: Response, token: string) => {
    try {
        const isVerify = jwt.verify(token, process.env.ACC_SECRETKEY as string);
        return isVerify
    } catch (error: any) {
        console.error("token verification erro:", error.message);
        throw new Error("Failed to verify token");
    }
}
