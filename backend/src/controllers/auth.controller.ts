// Third-party module
import { ZodIssue } from "zod";
import { Role } from "@prisma/client";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

// Custome module
import prisma from "../prisma/client";
import { RegisterSchema, LoginSchema, ChangePasswordSchema } from "../validations/auth.schema"
import { hashPassword, verifyPassword, generateAccToken, generateRefToken, verifyToken } from "../service/auth.service";
import { catchAsync } from "../utils/catchAsync";

interface JwtPayload {
    id: number,
    userRole: string
}

// Admin Register Handler
export const register = catchAsync(async (req: Request, res: Response) => {
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
});

// Admin Login Handler
export const login = catchAsync(async (req: Request, res: Response) => {
    const data = LoginSchema.parse(req.body);
    const { email, password } = data;

    const user = await prisma.adminUser.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found." });

    const userPassword = user.password;
    const isPasswordValid = await verifyPassword(password, userPassword);
    if (!isPasswordValid) return res.status(401).json({ message: "Password do not match" });

    const { id, role } = user;
    const accToken = await generateAccToken(res, id, role);
    const refToken = await generateRefToken(res, id, role);
    if (!accToken || !refToken) return res.status(500).json({ message: "Unable to get token." });

    res.status(200).json({ message: "User login successfully.", accToken, refToken });
});

// Refresh Token Handler
export const refresh = catchAsync(async (req: Request, res: Response) => {
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
});

// Logout Handler
export const logout = catchAsync(async (req: Request, res: Response) => {
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
});

// Change-Password Habdler
export const changePassword = catchAsync(async (req: Request, res: Response) => {
    const data = ChangePasswordSchema.parse(req.body);
    const { oldPassword, newPassword } = data;

    const accToken = req.cookies?.accToken;
    if (!accToken) {
        return res.status(401).json({ message: "Unauthorized user: Token missing" });
    }
    const decoded = await verifyToken(res, accToken) as JwtPayload;
    const { id } = decoded;

    const user = await prisma.adminUser.findUnique({ where: { id } });
    const userPassword = user?.password;
    if (!userPassword) return res.status(400).json({ message: "unable to get password" });

    const isMatch = await verifyPassword(oldPassword, userPassword);
    if (!isMatch) return res.status(401).json({ message: "Old password is incorrect" });

    const hashNewPassword = await hashPassword(newPassword);
    await prisma.adminUser.update({ where: { id }, data: { password: hashNewPassword } });

    res.status(200).json({ message: "Password changed successfully." });
});