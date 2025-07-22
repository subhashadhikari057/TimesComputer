import { Request, Response } from "express";
import prisma from "../prisma/client";
import path from "path";

export const addAds = async (req: Request, res: Response) => {
    try {
        const { link, placement, title } = req.body;
        
        if (!link) {
            return res.status(400).json({ error: "Link is required" });
        }
        
        if (!placement) {
            return res.status(400).json({ error: "Placement is required" });
        }

        const files = req.files as Express.Multer.File[];
        if (!files || files.length === 0) {
            return res.status(400).json({ error: "At least one image is required." });
        }

        const baseUrl = process.env.BASE_URL || "http://localhost:8080";
        const imageUrl = files.map(file => `${baseUrl}/uploads/${path.basename(file.path)}`);

        const ads = await prisma.adBanner.create({
            data: {
                title: title || null,
                images: imageUrl,
                link,
                placement,
                isActive: true,
            },
        });

        res.status(201).json({ message: "Ad created successfully.", data: ads });
    } catch (error: any) {
        console.error("Create ad error:", error);
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
}

export const getAllAds = async (req: Request, res: Response) => {
    try {
        const { placement, active } = req.query;
        
        let whereClause: any = {};
        
        // Filter by active status (default to true if not specified)
        if (active !== undefined) {
            whereClause.isActive = active === 'true';
        } else {
            whereClause.isActive = true;
        }
        
        // Filter by placement if specified
        if (placement) {
            whereClause.placement = placement;
        }
        
        const ads = await prisma.adBanner.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' }
        });
        
        res.status(200).json({ 
            success: true, 
            data: ads,
            count: ads.length 
        });
    } catch (error: any) {
        console.error("Get ads error:", error);
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
}

export const getAdsById = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const ad = await prisma.adBanner.findUnique({ where: { id } });
        
        if (!ad) {
            return res.status(404).json({ error: "Ad not found" });
        }
        
        res.status(200).json({ 
            success: true, 
            data: ad 
        });
    } catch (error: any) {
        console.error("Get ad by ID error:", error);
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
}


export const updateAds = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const { link, placement, title, isActive } = req.body;
        const files = req.files as Express.Multer.File[];
        
        // Build update data object
        const updateData: any = {};
        
        if (link !== undefined) updateData.link = link;
        if (placement !== undefined) updateData.placement = placement;
        if (title !== undefined) updateData.title = title;
        if (isActive !== undefined) updateData.isActive = isActive === 'true' || isActive === true;
        
        // Only update images if new ones are provided
        if (files && files.length > 0) {
            const baseUrl = process.env.BASE_URL || "http://localhost:8080";
            const imageUrl = files.map(file => `${baseUrl}/uploads/${path.basename(file.path)}`);
            updateData.images = imageUrl;
        }

        const updatedAd = await prisma.adBanner.update({
            where: { id },
            data: updateData,
        });

        res.status(200).json({ 
            message: "Ad updated successfully.", 
            data: updatedAd 
        });
    } catch (error: any) {
        console.error("Update ad error:", error);
        if (error.code === 'P2025') {
            return res.status(404).json({ error: "Ad not found" });
        }
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
}

export const deleteAds = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        
        const ad = await prisma.adBanner.findUnique({ where: { id } });
        if (!ad) {
            return res.status(404).json({ error: "Ad not found" });
        }

        const deletedAd = await prisma.adBanner.delete({ where: { id } });

        res.status(200).json({ 
            message: "Ad deleted successfully.", 
            data: deletedAd 
        });
    } catch (error: any) {
        console.error("Delete ad error:", error);
        if (error.code === 'P2025') {
            return res.status(404).json({ error: "Ad not found" });
        }
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
}