// services/category.service.ts

import prisma from "../prisma/client";

// Create a new category
interface CategoryInput {
    name: string;
    image: string;
    icon: string;
}

export const addCategoryService = async ({ name, image, icon }: CategoryInput) => {
    const existing = await prisma.category.findUnique({ where: { name } });
    if (existing) throw new Error("Category already exists.");

    const category = await prisma.category.create({
        data: {
            name,
            image,
            icon,
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
export const updateCategoryService = async (id: number, updateData: { name?: string; image?: string; icon?: string }) => {
    const exist = await prisma.category.findUnique({ where: { id } });
    if (!exist) throw new Error("Category not found.");
    if (updateData.name) {
        const duplicate = await prisma.category.findUnique({ where: { name: updateData.name } });
        if (duplicate && duplicate.id !== id) throw new Error("Category name already exists.");
    }
    return await prisma.category.update({
        where: { id },
        data: updateData,
    });
};

// Delete a category
export const deleteCategoryService = async (id: number) => {
    const exist = await prisma.category.findUnique({ where: { id } });
    if (!exist) throw new Error("Category not found.");

    return await prisma.category.delete({ where: { id } });
};
