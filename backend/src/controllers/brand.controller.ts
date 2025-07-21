// controllers/Brand.controller.ts

import { Request, Response } from "express";
import {
    addBrandService,
    getAllBrandService,
    getBrandByIdService,
    updateBrandService,
    deleteBrandService,
} from "../services/brand.service";
import prisma from "../prisma/client";
import { logAudit } from "../services/auditLog.service";

export const addBrand = async (req: Request, res: Response) => {
    try {
        const { name } = req.body;
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        const imageFiles = files && files['image'] ? files['image'] : [];

        if (!name || typeof name !== 'string') {
            return res.status(400).json({ error: "Brand name is required and must be a string." });
        }
        if (!imageFiles || imageFiles.length === 0) {
            return res.status(400).json({ error: "One image file is required." });
        }

        const imagePath = imageFiles[0].path;
        const Brand = await addBrandService({ name, image: imagePath });

        // Log audit
        try {
            const currentUser = (req as any).user;
            await logAudit({
                actorId: currentUser?.id,
                targetId: Brand.id.toString(),
                action: "CREATE_BRAND",
                message: `Created brand: ${Brand.name}`,
                ip: req.ip,
                userAgent: req.headers["user-agent"]
            });
        } catch (logError) {
            console.error("Audit log error:", logError);
        }

        res.status(201).json({ message: "Brand created successfully.", data: Brand });
    } catch (error: any) {
        if (error.message.includes("exists")) {
            return res.status(409).json({ error: error.message });
        }
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
};

export const getAllBrands = async (_req: Request, res: Response) => {
    try {
        const brand = await getAllBrandService();
        res.status(200).json({ message: "Brand retrieved successfully.", data: brand });
    } catch (error: any) {
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
};

export const getBrandById = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).json({ error: "Invalid Brand ID." });

        const Brand = await getBrandByIdService(id);
        const product = await prisma.product.findMany({ where: { id } });
        res.status(200).json({ message: "Brand retrieved successfully.", data: Brand, product });
    } catch (error: any) {
        const status = error.message === "Brand not found." ? 404 : 500;
        res.status(status).json({ error: error.message });
    }
};

export const updateBrand = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const { name } = req.body;
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        let updateData: any = {};
        if (name && typeof name === 'string') updateData.name = name;
        if (files && files['image'] && files['image'][0]) updateData.image = files['image'][0].path;
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ error: "No valid fields provided for update." });
        }
        
        const updatedBrand = await updateBrandService(id, updateData);

        // Log audit
        try {
            const currentUser = (req as any).user;
            await logAudit({
                actorId: currentUser?.id,
                targetId: id.toString(),
                action: "UPDATE_BRAND",
                message: `Updated brand: ${updatedBrand.name}`,
                ip: req.ip,
                userAgent: req.headers["user-agent"]
            });
        } catch (logError) {
            console.error("Audit log error:", logError);
        }

        res.status(200).json({ message: "Brand updated successfully.", data: updatedBrand });
    } catch (error: any) {
        const status = error.message.includes("not found") ? 404 :
            error.message.includes("already exists") ? 409 : 500;
        res.status(status).json({ error: error.message });
    }
};

export const deleteBrand = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).json({ error: "Invalid Brand ID." });

        const brandToDelete = await getBrandByIdService(id);
        const deleted = await deleteBrandService(id);

        // Log audit
        try {
            const currentUser = (req as any).user;
            await logAudit({
                actorId: currentUser?.id,
                targetId: id.toString(),
                action: "DELETE_BRAND",
                message: `Deleted brand: ${brandToDelete.name}`,
                ip: req.ip,
                userAgent: req.headers["user-agent"]
            });
        } catch (logError) {
            console.error("Audit log error:", logError);
        }

        res.status(200).json({ message: "Brand deleted successfully.", data: deleted });
    } catch (error: any) {
        const status = error.message === "Brand not found." ? 404 : 500;
        res.status(status).json({ error: error.message });
    }
};
