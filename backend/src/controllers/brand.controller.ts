import { Request, Response } from "express";
import prisma from "../prisma/client";

// Create a new brand
export const addBrand = async (req: Request, res: Response) => {
    try {
        const { name } = req.body;

        if (!name || typeof name !== "string") {
            return res.status(400).json({ error: "Brand name is required and must be a string." });
        }

        const brandExist = await prisma.brand.findUnique({ where: { name } });
        if (brandExist) return res.status(409).json({ message: "Brand already exist." });


        const files = req.files as Express.Multer.File[];

        if (!files || files.length === 0) {
            return res.status(400).json({ error: 'At least one image is required.' });
        }

        const imagePaths = files.map((file) => file.path);

        const brand = await prisma.brand.create({
            data: { name, images: imagePaths },
        });

        res.status(201).json({ message: "Brand created successfully.", data: brand });
    } catch (error: any) {
        console.error("Create brand error:", error);
        res.status(500).json({ error: "Internal server error." });
    }
};

// Get all brands
export const getAllBrands = async (_req: Request, res: Response) => {
    try {
        const brands = await prisma.brand.findMany();
        res.status(200).json({ message: "Brands retrieved successfully.", data: brands });
    } catch (error: any) {
        console.error("Get all brands error:", error);
        res.status(500).json({ error: "Failed to retrieve brands." });
    }
};

// Get a single brand by ID
export const getBrandById = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).json({ error: "Invalid brand ID." });

        const brand = await prisma.brand.findUnique({ where: { id } });

        if (!brand) return res.status(404).json({ error: "Brand not found." });

        res.status(200).json({ message: "Brand retrieved successfully.", data: brand });
    } catch (error: any) {
        console.error("Get brand by ID error:", error);
        res.status(500).json({ error: "Failed to retrieve brand." });
    }
};

// Update a brand
export const updateBrand = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const { name } = req.body;

        if (isNaN(id)) return res.status(400).json({ error: "Invalid brand ID." });

        if (!name || typeof name !== "string") {
            return res.status(400).json({ error: "Brand name is required and must be a string." });
        }


        const brandExist = await prisma.brand.findUnique({ where: { name } });
        if (brandExist) return res.status(409).json({ message: "Brand already exist." });

        const brand = await prisma.brand.findUnique({ where: { id } });
        if (!brand) return res.status(404).json({ error: "Brand not found." });

        const updatedBrand = await prisma.brand.update({
            where: { id },
            data: { name },
        });

        res.status(200).json({ message: "Brand updated successfully.", data: updatedBrand });
    } catch (error: any) {
        console.error("Update brand error:", error);
        res.status(500).json({ error: "Failed to update brand." });
    }
};

// Delete brand
export const deleteBrand = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);

        if (isNaN(id)) return res.status(400).json({ error: "Invalid brand ID." });

        const brand = await prisma.brand.findUnique({ where: { id } });
        if (!brand) return res.status(404).json({ error: "Brand not found." });

        const deleteBrand = await prisma.brand.delete({
            where: { id }
        });

        res.status(200).json({ message: "Brand delete successfully.", deleteBrand });
    } catch (error: any) {
        console.error("Delete brand error:", error);
        res.status(500).json({ error: "Failed to delete brand." });
    }
} 
