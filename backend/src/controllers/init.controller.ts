import { Request, Response } from "express";
import prisma from "../prisma/client";
import { RegisterSchema } from "../validations/auth.schema";
import { hashPassword } from "../services/auth.service";

export const superAdminExists = async (req: Request, res: Response) => {
    const existingAdmin = await prisma.adminUser.findFirst();
    if (existingAdmin) {
        return res.status(200).json({ message: true });
    }

    return res.status(200).json({ message: false });
};

export const signup = async (req: Request, res: Response) => {

    // ⚠️ First check if superadmin exists
    const existingAdmin = await prisma.adminUser.findFirst();
    if (existingAdmin) {
        return res.status(403).json({ message: "Superadmin already exists." });
    }

    const body = RegisterSchema.safeParse(req.body);
    if (!body.success) return res.status(400).json({ message: body.error.errors });

    const { name, email, password } = body.data;

    const hashedPw = await hashPassword(password);
    await prisma.adminUser.create({
        data: {
            name,
            email,
            password: hashedPw,
            role: "SUPERADMIN",
            isActive: true,
        },
    });

    return res.sendStatus(201);
};
