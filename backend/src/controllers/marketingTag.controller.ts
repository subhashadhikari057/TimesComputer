import { Request, Response } from "express";
import prisma from "../prisma/client";

// Create a new Marketing-Tag
export const addMarketingTag = async (req: Request, res: Response) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ error: "MarketingTag name is required." });
        }

        const MarketingTag = await prisma.marketingTag.create({
            data: { name, },
        });

        res.status(201).json({ message: "MarketingTag created successfully.", data: MarketingTag });
    } catch (error: any) {
        console.error("Create MarketingTag error:", error);
        res.status(500).json({ error: "Internal server error." });
    }
};

// Get all Marketing-Tags
export const getAllMarketingTags = async (_req: Request, res: Response) => {
    try {
        const MarketingTags = await prisma.marketingTag.findMany();
        res.status(200).json({ message: "MarketingTags retrieved successfully.", data: MarketingTags });
    } catch (error: any) {
        console.error("Get all MarketingTags error:", error);
        res.status(500).json({ error: "Failed to retrieve MarketingTags." });
    }
};

// Get a single Marketing-Tag by ID
export const getMarketingTagById = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).json({ error: "Invalid MarketingTag ID." });

        const MarketingTag = await prisma.marketingTag.findUnique({ where: { id } });

        if (!MarketingTag) return res.status(404).json({ error: "MarketingTag not found." });

        res.status(200).json({ message: "MarketingTag retrieved successfully.", data: MarketingTag });
    } catch (error: any) {
        console.error("Get MarketingTag by ID error:", error);
        res.status(500).json({ error: "Failed to retrieve MarketingTag." });
    }
};

// Update a Marketing-Tag
export const updateMarketingTag = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const { name } = req.body;

        if (isNaN(id)) return res.status(400).json({ error: "Invalid MarketingTag ID." });

        if (!name || typeof name !== "string") {
            return res.status(400).json({ error: "MarketingTag name is required and must be a string." });
        }

        const MarketingTag = await prisma.marketingTag.findUnique({ where: { id } });
        if (!MarketingTag) return res.status(404).json({ error: "MarketingTag not found." });

        const updatedMarketingTag = await prisma.marketingTag.update({
            where: { id },
            data: { name },
        });

        res.status(200).json({ message: "MarketingTag updated successfully.", data: updatedMarketingTag });
    } catch (error: any) {
        console.error("Update MarketingTag error:", error);
        res.status(500).json({ error: "Failed to update MarketingTag." });
    }
};

// Delete Marketing-Tag
export const deleteMarketingTag = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);

        if (isNaN(id)) return res.status(400).json({ error: "Invalid MarketingTag ID." });

        const MarketingTag = await prisma.marketingTag.findUnique({ where: { id } });
        if (!MarketingTag) return res.status(404).json({ error: "MarketingTag not found." });

        const deleteMarketingTag = await prisma.marketingTag.delete({
            where: { id }
        });

        res.status(200).json({ message: "MarketingTag deleted successfully.", deleteMarketingTag });
    } catch (error: any) {
        console.error("Delete MarketingTag error:", error);
        res.status(500).json({ error: "Failed to delete MarketingTag." });
    }
}

//  Get Product linked to a Marketing Tag
export const getProductByMarketingTag = async (req: Request, res: Response) => {
    try {
        const tagId = parseInt(req.params.id);
        if (isNaN(tagId)) {
            return res.status(400).json({ error: "Invalid marketing-tag ID." });
        }

        // Check if the feature tag exists
        const marketingTag = await prisma.marketingTag.findUnique({ where: { id: tagId } });
        if (!marketingTag) {
            return res.status(404).json({ error: "marketing-tag not found." });
        }

        //  If color exists, fetch linked products
        const products = await prisma.productMarketingTag.findMany({
            where: { tagId },
            include: { product: true }
        });

        const productList = products.map(pc => pc.product);
        res.status(200).json({ message: "Products retrieved successfully.", data: productList });
    } catch (error: any) {
        console.error("Get Product by marketing-tag error:", error);
        res.status(500).json({ error: "Failed to fetch products for marketing tag." });
    }
};