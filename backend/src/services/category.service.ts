// services/category.service.ts

import prisma from "../prisma/client";

// Create a new category
interface CategoryInput {
    name: string;
    imagePaths: string[];
}

export const addCategoryService = async ({ name, imagePaths }: CategoryInput) => {
    const existing = await prisma.category.findUnique({ where: { name } });
    if (existing) throw new Error("Category already exists.");

    const category = await prisma.category.create({
        data: {
            name,
            images: imagePaths,
        },
    });

    return category;
};

// Get all categories
export const getAllCategoryService = async () => {
    return await prisma.category.findMany();
};

// Get a category by ID
export const getCategoryByIdService = async (id: number) => {
    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) throw new Error("Category not found.");
    return category;
};

// Update a category
export const updateCategoryService = async (id: number, name: string) => {
    const exist = await prisma.category.findUnique({ where: { id } });
    if (!exist) throw new Error("Category not found.");

    const duplicate = await prisma.category.findUnique({ where: { name } });
    if (duplicate) throw new Error("Category name already exists.");

    return await prisma.category.update({
        where: { id },
        data: { name },
    });
};

// Delete a category
export const deleteCategoryService = async (id: number) => {
    const exist = await prisma.category.findUnique({ where: { id } });
    if (!exist) throw new Error("Category not found.");

    return await prisma.category.delete({ where: { id } });
};
