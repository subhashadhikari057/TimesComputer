import { Request, Response } from "express";
import prisma from "../prisma/client";

// Create a new Color
export const addColor = async (req: Request, res: Response) => {
    try {
        const { name, hexCode } = req.body;

        if (!name || !hexCode) {
            return res.status(400).json({ error: "All field are required." });
        }

        const colorExist = await prisma.color.findUnique({ where: { name } });
        if (colorExist) return res.status(409).json({ message: "color exit already." });

        const Color = await prisma.color.create({
            data: { name, hexCode },
        });

        res.status(201).json({ message: "Color created successfully.", data: Color });
    } catch (error: any) {
        console.error("Create Color error:", error);
        res.status(500).json({ error: "Internal server error." });
    }
};

// Get all Colors
export const getAllColors = async (_req: Request, res: Response) => {
    try {
        const Colors = await prisma.color.findMany();
        res.status(200).json({ message: "Colors retrieved successfully.", data: Colors });
    } catch (error: any) {
        console.error("Get all Colors error:", error);
        res.status(500).json({ error: "Failed to retrieve Colors." });
    }
};

// Get a single Color by ID
export const getColorById = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).json({ error: "Invalid Color ID." });

        const Color = await prisma.color.findUnique({ where: { id } });

        if (!Color) return res.status(404).json({ error: "Color not found." });

        res.status(200).json({ message: "Color retrieved successfully.", data: Color });
    } catch (error: any) {
        console.error("Get Color by ID error:", error);
        res.status(500).json({ error: "Failed to retrieve Color." });
    }
};

// Update a Color
export const updateColor = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const { name, hexCode } = req.body;

        if (isNaN(id)) return res.status(400).json({ error: "Invalid Color ID." });

        if (!name || !hexCode) {
            return res.status(400).json({ error: "All field are required." });
        }

        const Color = await prisma.color.findUnique({ where: { id } });
        if (!Color) return res.status(404).json({ error: "Color not found." });

        const updatedColor = await prisma.color.update({
            where: { id },
            data: { name, hexCode },
        });

        res.status(200).json({ message: "Color updated successfully.", data: updatedColor });
    } catch (error: any) {
        console.error("Update Color error:", error);
        res.status(500).json({ error: "Failed to update Color." });
    }
};

// Delete Color
export const deleteColor = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);

        if (isNaN(id)) return res.status(400).json({ error: "Invalid Color ID." });

        const Color = await prisma.color.findUnique({ where: { id } });
        if (!Color) return res.status(404).json({ error: "Color not found." });

        const deleteColor = await prisma.color.delete({
            where: { id }
        });

        res.status(200).json({ message: "Color deleted successfully.", deleteColor });
    } catch (error: any) {
        console.error("Delete Color error:", error);
        res.status(500).json({ error: "Failed to delete Color." });
    }
}

//  Get Product linked to a Color
export const getProductByColor = async (req: Request, res: Response) => {
    try {
        const colorId = parseInt(req.params.id);
        if (isNaN(colorId)) {
            return res.status(400).json({ error: "Invalid color ID." });
        }

        // Check if the color exists
        const color = await prisma.color.findUnique({ where: { id: colorId } });
        if (!color) {
            return res.status(404).json({ error: "Color not found." });
        }

        //  If color exists, fetch linked products
        const linkedProducts = await prisma.productColor.findMany({
            where: { colorId },
            include: { product: true }
        });

        const productList = linkedProducts.map(pc => pc.product);
        res.status(200).json({ message: "Products retrieved successfully.", data: productList });
    } catch (error: any) {
        console.error("Get Product by Color error:", error);
        res.status(500).json({ error: "Failed to fetch products for color." });
    }
};
