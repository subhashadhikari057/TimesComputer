import { Request, Response } from "express";
import {
    addColorService,
    getAllColorsService,
    getColorByIdService,
    updateColorService,
    deleteColorService,
} from "../services/color.service";

import prisma from "../prisma/client";

export const addColor = async (req: Request, res: Response) => {
    try {
        const color = await addColorService(req.body);
        res.status(201).json({ message: "Color created successfully.", data: color });
    } catch (error: any) {
        res.status(error.status || 500).json({ error: error.message || "Internal Server Error" });
    }
};

export const getAllColors = async (_req: Request, res: Response) => {
    try {
        const colors = await getAllColorsService();
        res.status(200).json({ message: "Colors retrieved successfully.", data: colors });
    } catch (error: any) {
        res.status(error.status || 500).json({ error: error.message || "Failed to retrieve colors." });
    }
};

export const getColorById = async (req: Request, res: Response) => {
    try {
        const color = await getColorByIdService(Number(req.params.id));
        res.status(200).json({ message: "Color retrieved successfully.", data: color });
    } catch (error: any) {
        res.status(error.status || 500).json({ error: error.message || "Failed to retrieve color." });
    }
};

export const updateColor = async (req: Request, res: Response) => {
    try {
        const updatedColor = await updateColorService(Number(req.params.id), req.body);
        res.status(200).json({ message: "Color updated successfully.", data: updatedColor });
    } catch (error: any) {
        res.status(error.status || 500).json({ error: error.message || "Failed to update color." });
    }
};

export const deleteColor = async (req: Request, res: Response) => {
    try {
        const deletedColor = await deleteColorService(Number(req.params.id));
        res.status(200).json({ message: "Color deleted successfully.", data: deletedColor });
    } catch (error: any) {
        res.status(error.status || 500).json({ error: error.message || "Failed to delete color." });
    }
};

export const getProductByColorId = async (req: Request, res: Response) => {
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