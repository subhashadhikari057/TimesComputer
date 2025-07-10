// Third-party module
import { ZodIssue } from "zod";
import { Role } from "@prisma/client";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

// Custome module
import prisma from "../prisma/client";
import { RegisterSchema, LoginSchema, ChangePasswordSchema } from "../validations/auth.schema"
import { hashPassword, verifyPassword, generateAccToken, generateRefToken } from "../service/auth.service";

interface JwtPayload {
    id: number,
    userRole: string
}

// Admin Register Handler
export const register = async (req: Request, res: Response) => {
    try {
        const data = RegisterSchema.parse(req.body);
        const { name, email, password } = data;

        const existUser = await prisma.adminUser.findUnique({ where: { email } });
        if (existUser) return res.status(409).json({ message: "User exist already. Please register with another email address" });

        const user = await prisma.adminUser.findMany();
        const superAdmin = user.some(user => user.role === Role.SUPERADMIN);
        const userRole = superAdmin ? Role.ADMIN : Role.SUPERADMIN;

        const hashPass = await hashPassword(password);

        const newUser = await prisma.adminUser.create({
            data: {
                name,
                email,
                password: hashPass,
                role: userRole,
            }
        });

        res.status(201).json({
            message: "User Register successfully.",
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email
            }
        });
    } catch (error: any) {
        if (error.name === "ZodError") {
            const message = error.errors.map((err: ZodIssue) => err.message);
            return res.status(400).json({ error: message });
        }
        res.status(500).json({ message: "Internal server error." });
    }
}

// Admin Login Handler
export const login = async (req: Request, res: Response) => {
    try {
        const data = LoginSchema.parse(req.body);
        const { email, password } = data;

        const user = await prisma.adminUser.findUnique({ where: { email } });
        if (!user) return res.status(404).json({ message: "User not found." });

        const userPassword = user.password;
        const hashPassword = await verifyPassword(password, userPassword);
        if (!hashPassword) return res.status(401).json({ message: "Password do not match" });

        const { id, role } = user;
        const accToken = await generateAccToken(res, id, role);
        const refToken = await generateRefToken(res, id, role);
        if (!accToken || !refToken) return res.status(500).json({ message: "Unable to get token." });

        res.status(200).json({ message: "User login succesfully.", accToken, refToken });
    } catch (error: any) {
        if (error.name === "ZodError") {
            const message = error.errors.map((err: ZodIssue) => err.message);
            return res.status(400).json({ error: message });
        }
        res.status(500).json({ message: "Internal server error" });
    }
}

// Refresh Token Handler
export const refresh = async (req: Request, res: Response) => {

    try {
        const refToken = req.cookies?.refToken;
        if (!refToken) return res.status(401).json({ message: "Refresh token not found." });

        let decoded: JwtPayload;
        try {
            decoded = jwt.verify(refToken, process.env.REF_SECRETKEY as string) as JwtPayload;
        } catch (error: any) {
            console.error(error.message);
            return res.status(401).json({ message: "Invalid or expired refresh token" });
        }

        const { id, userRole } = decoded;
        const newAccToken = await generateAccToken(res, id, userRole);
        const newRefToken = await generateRefToken(res, id, userRole);
        res.status(200).json({ message: "Access token Refresh successfully", accToken: newAccToken, refToken: newRefToken });
    } catch (error: any) {
        console.error(error.message);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

// Logout Handler
export const logout = async (req: Request, res: Response) => {
    try {
        res.clearCookie("accToken", {
            httpOnly: true,
            secure: false,
            sameSite: "strict"
        })

        res.clearCookie("refToken", {
            httpOnly: true,
            secure: false,
            sameSite: "strict"
        });

        res.status(200).json({ message: "User logout succesfully." });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: "unable to logout user.", error: error.message });
    }
}

// Change-Password Habdler
export const changePassword = async (req: Request, res: Response) => {
    try {
        const data = ChangePasswordSchema.parse(req.body);
        const { oldPassword, newPassword } = data;

        const accToken = req.cookies.accToken;
        const decoded = jwt.verify(accToken, process.env.ACC_SECRETKEY as string) as JwtPayload;
        const { id } = decoded;

        const user = await prisma.adminUser.findUnique({ where: { id } });
        const userPassword = user?.password;
        if (!userPassword) return res.status(400).json({ message: "unable to get password" });

        const isMatch = await verifyPassword(oldPassword, userPassword);
        if (!isMatch) return res.status(401).json({ message: "Old password is incorrect" });

        const hashNewPassword = await hashPassword(newPassword);
        await prisma.adminUser.update({ where: { id }, data: { password: hashNewPassword } });

        res.status(200).json({ message: "Password changed successfully." });
    } catch (error: any) {
        console.error(error.message);
        res.status(500).json({ message: "Internal server error." });
    }
}