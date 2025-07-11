import { Request, Response } from "express";
import prisma from "../prisma/client";

// Create a new FeatureTag
export const addfeatureTag = async (req: Request, res: Response) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ error: "featureTag name is required." });
        }

        const featureTag = await prisma.featureTag.create({
            data: { name, },
        });

        res.status(201).json({ message: "featureTag created successfully.", data: featureTag });
    } catch (error: any) {
        console.error("Create featureTag error:", error);
        res.status(500).json({ error: "Internal server error." });
    }
};

// Get all FeatureTags
export const getAllFeatureTags = async (_req: Request, res: Response) => {
    try {
        const featureTags = await prisma.featureTag.findMany();
        res.status(200).json({ message: "featureTags retrieved successfully.", data: featureTags });
    } catch (error: any) {
        console.error("Get all featureTags error:", error);
        res.status(500).json({ error: "Failed to retrieve featureTags." });
    }
};

// Get a single FeatureTag by ID
export const getFeatureTagById = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).json({ error: "Invalid featureTag ID." });

        const featureTag = await prisma.featureTag.findUnique({ where: { id } });

        if (!featureTag) return res.status(404).json({ error: "featureTag not found." });

        res.status(200).json({ message: "featureTag retrieved successfully.", data: featureTag });
    } catch (error: any) {
        console.error("Get featureTag by ID error:", error);
        res.status(500).json({ error: "Failed to retrieve featureTag." });
    }
};

// Update a FeatureTag
export const updateFeatureTag = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const { name } = req.body;

        if (isNaN(id)) return res.status(400).json({ error: "Invalid featureTag ID." });

        if (!name || typeof name !== "string") {
            return res.status(400).json({ error: "featureTag name is required and must be a string." });
        }

        const featureTag = await prisma.featureTag.findUnique({ where: { id } });
        if (!featureTag) return res.status(404).json({ error: "featureTag not found." });

        const updatedfeatureTag = await prisma.featureTag.update({
            where: { id },
            data: { name },
        });

        res.status(200).json({ message: "featureTag updated successfully.", data: updatedfeatureTag });
    } catch (error: any) {
        console.error("Update featureTag error:", error);
        res.status(500).json({ error: "Failed to update featureTag." });
    }
};

// Delete FeatureTag
export const deleteFeatureTag = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);

        if (isNaN(id)) return res.status(400).json({ error: "Invalid featureTag ID." });

        const featureTag = await prisma.featureTag.findUnique({ where: { id } });
        if (!featureTag) return res.status(404).json({ error: "featureTag not found." });

        const deletefeatureTag = await prisma.featureTag.delete({
            where: { id }
        });

        res.status(200).json({ message: "featureTag deleted successfully.", deletefeatureTag });
    } catch (error: any) {
        console.error("Delete featureTag error:", error);
        res.status(500).json({ error: "Failed to delete featureTag." });
    }
}

//  Get Product linked to a Feature Tag
export const getProductByFeatureTag = async (req: Request, res: Response) => {
    try {
        const tagId = parseInt(req.params.id);

        const product = await prisma.productFeatureTag.findMany({ where: { tagId }, include: { product: true } });
        const productList = product.map(pft => pft.product);
        res.status(200).json({ productList });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}