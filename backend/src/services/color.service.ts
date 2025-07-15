import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface ColorData {
    name: string;
    hexCode: string;
}

export const addColorService = async ({ name, hexCode }: ColorData) => {
    if (!name || !hexCode) throw { status: 400, message: "All fields are required." };

    const existingColor = await prisma.color.findUnique({ where: { name } });
    if (existingColor) throw { status: 409, message: "Color already exists." };

    return await prisma.color.create({ data: { name, hexCode } });
};

export const getAllColorsService = async () => {
    return await prisma.color.findMany();
};

export const getColorByIdService = async (id: number) => {
    if (isNaN(id)) throw { status: 400, message: "Invalid color ID." };

    const color = await prisma.color.findUnique({ where: { id } });
    if (!color) throw { status: 404, message: "Color not found." };

    return color;
};

export const updateColorService = async (id: number, data: Partial<ColorData>) => {
    const { name, hexCode } = data;
    if (!name || !hexCode) throw { status: 400, message: "All fields are required." };

    const existingColor = await prisma.color.findUnique({ where: { id } });
    if (!existingColor) throw { status: 404, message: "Color not found." };

    return await prisma.color.update({ where: { id }, data: { name, hexCode } });
};

export const deleteColorService = async (id: number) => {
    const existingColor = await prisma.color.findUnique({ where: { id } });
    if (!existingColor) throw { status: 404, message: "Color not found." };

    return await prisma.color.delete({ where: { id } });
};



