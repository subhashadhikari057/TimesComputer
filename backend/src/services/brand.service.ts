// services/Brand.service.ts

import prisma from "../prisma/client";

// Create a new Brand
interface BrandInput {
    name: string;
    imagePaths: string[];
}

export const addBrandService = async ({ name, imagePaths }: BrandInput) => {
    const existing = await prisma.brand.findUnique({ where: { name } });
    if (existing) throw new Error("Brand already exists.");

    const Brand = await prisma.brand.create({
        data: {
            name,
            images: imagePaths,
        },
    });

    return Brand;
};

// Get all categories
export const getAllBrandService = async () => {
    return await prisma.brand.findMany();
};

// Get a Brand by ID
export const getBrandByIdService = async (id: number) => {
    const Brand = await prisma.brand.findUnique({ where: { id } });
    if (!Brand) throw new Error("Brand not found.");
    return Brand;
};

// Update a Brand
export const updateBrandService = async (id: number, name: string) => {
    const exist = await prisma.brand.findUnique({ where: { id } });
    if (!exist) throw new Error("Brand not found.");

    const duplicate = await prisma.brand.findUnique({ where: { name } });
    if (duplicate) throw new Error("Brand name already exists.");

    return await prisma.brand.update({
        where: { id },
        data: { name },
    });
};

// Delete a Brand
export const deleteBrandService = async (id: number) => {
    const exist = await prisma.brand.findUnique({ where: { id } });
    if (!exist) throw new Error("Brand not found.");

    return await prisma.brand.delete({ where: { id } });
};
