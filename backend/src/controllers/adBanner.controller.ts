import { Request, Response } from "express";
import prisma from "../prisma/client";

export const addAds = async (req: Request, res: Response) => {
    try {
        const files = req.files as Express.Multer.File[];
        if (!files || files.length === 0) {
            return res.status(400).json({ error: "At least one image is required." });
        }

        const imagePaths = files.map(file => file.path);
        const ads = await prisma.adBanner.create({
            data: {
                images: imagePaths,
            },
        });

        res.status(201).json({ message: "Ads created successfully.", ads });
    } catch (error: any) {
        if (error.message.includes("exists")) {
            return res.status(409).json({ error: error.message });
        }
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
}

export const getAllAds = async (req: Request, res: Response) => {
    try {
        const ad = await prisma.adBanner.findMany();
        if (!ad) {
            return res.status(400).json({ error: "Unable to get ads." });
        }
        res.status(201).json({ ad });
    } catch (error: any) {
        if (error.message.includes("exists")) {
            return res.status(409).json({ error: error.message });
        }
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
}

export const getAdsById = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const ad = await prisma.adBanner.findUnique({ where: { id } });
        if (!ad) {
            return res.status(400).json({ error: "Unable to get ads." });
        }
        res.status(201).json({ ad });
    } catch (error: any) {
        if (error.message.includes("exists")) {
            return res.status(409).json({ error: error.message });
        }
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
}


export const updateAds = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const files = req.files as Express.Multer.File[];
        if (!files || files.length === 0) {
            return res.status(400).json({ error: "At least one image is required." });
        }

        const imagePaths = files.map(file => file.path);
        const updateAds = await prisma.adBanner.update({
            where: { id },
            data: {
                images: imagePaths,
            },
        });

        res.status(201).json({ message: "Ads update successfully.", updateAds });
    } catch (error: any) {
        if (error.message.includes("exists")) {
            return res.status(409).json({ error: error.message });
        }
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
}

export const deleteAds = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const ad = await prisma.adBanner.findUnique({ where: { id } });
        if (!ad) {
            return res.status(400).json({ error: "Unable to get ads." });
        }

        const deleteAds = await prisma.adBanner.delete({ where: { id } });

        if (!deleteAds) return res.status(400).send("Ads not found.");

        res.status(201).json({ message: "Ad deleted successfull.", deleteAds });
    } catch (error: any) {
        if (error.message.includes("exists")) {
            return res.status(409).json({ error: error.message });
        }
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
}