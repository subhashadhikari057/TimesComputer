import prisma from "../prisma/client";
import { hashPassword } from "./auth.service";
import { Role } from "@prisma/client";

// ✅ Get all admin users
export const getAllAdmins = async () => {
    return prisma.adminUser.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            isActive: true,
            createdAt: true,
        },
        orderBy: { createdAt: "desc" },
    });
};

// ✅ Create admin user
export const createAdmin = async ({
    name,
    email,
    password,
    role,
}: {
    name: string;
    email: string;
    password: string;
    role: Role;
}) => {
    const hashed = await hashPassword(password);

    return prisma.adminUser.create({
        data: {
            name,
            email,
            password: hashed,
            role,
            isActive: true,
        },
    });
};

// ✅ Get user by ID
export const getAdminById = async (id: string) => {
    return prisma.adminUser.findUnique({ where: { id } });
};

// ✅ Update admin user
export const updateAdmin = async (
    id: string,
    data: Partial<{ name: string; role: Role; isActive: boolean; password: string }>
) => {
    return prisma.adminUser.update({
        where: { id },
        data,
    });
};

// ✅ Delete admin user
export const deleteAdmin = async (id: string) => {
    return prisma.adminUser.delete({ where: { id } });
};

// ✅ Count how many SUPERADMINs exist
export const countSuperadmins = async () => {
    return prisma.adminUser.count({ where: { role: "SUPERADMIN", isActive: true } });
};
