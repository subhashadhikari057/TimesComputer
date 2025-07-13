import prisma from "../prisma/client";

// Create a new category
import { Request, Response } from 'express';

export const addCategory = async (req: Request, res: Response) => {
    try {
        const { name } = req.body;

        if (!name || typeof name !== 'string') {
            return res.status(400).json({ error: 'Category name is required and must be a string.' });
        }

        const categoryExist = await prisma.category.findUnique({ where: { name } });
        if (categoryExist) return res.status(409).json({ message: "Category exit already." });

        const files = req.files as Express.Multer.File[];

        if (!files || files.length === 0) {
            return res.status(400).json({ error: 'At least one image is required.' });
        }

        const imagePaths = files.map((file) => file.path);

        const category = await prisma.category.create({
            data: {
                name,
                images: imagePaths,
            },
        });

        res.status(201).json({ message: 'Category created successfully.', data: category });
    } catch (error) {
        console.error('Create category error:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};



// Get all categorys
export const getAllCategorys = async (_req: Request, res: Response) => {
    try {
        const categorys = await prisma.category.findMany();
        res.status(200).json({ message: "categorys retrieved successfully.", data: categorys });
    } catch (error: any) {
        console.error("Get all categorys error:", error);
        res.status(500).json({ error: "Failed to retrieve categorys." });
    }
};

// Get a single category by ID
export const getCategoryById = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).json({ error: "Invalid category ID." });

        const category = await prisma.category.findUnique({ where: { id } });

        if (!category) return res.status(404).json({ error: "category not found." });

        res.status(200).json({ message: "category retrieved successfully.", data: category });
    } catch (error: any) {
        console.error("Get category by ID error:", error);
        res.status(500).json({ error: "Failed to retrieve category." });
    }
};

// Update a category
export const updateCategory = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const { name } = req.body;

        if (!name || typeof name !== "string") {
            return res.status(400).json({ error: "category name is required and must be a string." });
        }

        const existCategory = await prisma.category.findUnique({ where: { name } });
        if (existCategory) return res.status(409).json({ message: "Category exist already." });

        const category = await prisma.category.findUnique({ where: { id } });
        if (!category) return res.status(404).json({ error: "category not found." });

        const updatedcategory = await prisma.category.update({
            where: { id },
            data: { name },
        });

        res.status(200).json({ message: "category updated successfully.", data: updatedcategory });
    } catch (error: any) {
        console.error("Update category error:", error);
        res.status(500).json({ error: "Failed to update category." });
    }
};

// Delete category
export const deleteCategory = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);

        if (isNaN(id)) return res.status(400).json({ error: "Invalid category ID." });

        const category = await prisma.category.findUnique({ where: { id } });
        if (!category) return res.status(404).json({ error: "category not found." });

        const deletecategory = await prisma.category.delete({
            where: { id }
        });

        res.status(200).json({ message: "category deleted successfully.", deletecategory });
    } catch (error: any) {
        console.error("Delete category error:", error);
        res.status(500).json({ error: "Failed to delete category." });
    }
} 
