// controllers/Brand.controller.ts

import { Request, Response } from "express";
import {
    addBrandService,
    getAllBrandService,
    getBrandByIdService,
    updateBrandService,
    deleteBrandService,
} from "../services/brand.service";

export const addBrand = async (req: Request, res: Response) => {
    try {
        const { name } = req.body;
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        const imageFiles = files && files['image'] ? files['image'] : [];
        const iconFiles = files && files['icon'] ? files['icon'] : [];

        if (!name || typeof name !== 'string') {
            return res.status(400).json({ error: "Brand name is required and must be a string." });
        }
        if (!imageFiles || imageFiles.length === 0) {
            return res.status(400).json({ error: "One image file is required." });
        }
        if (!iconFiles || iconFiles.length === 0) {
            return res.status(400).json({ error: "One SVG icon file is required." });
        }

        const imagePath = imageFiles[0].path;
        const iconPath = iconFiles[0].path;
        const Brand = await addBrandService({ name, image: imagePath, icon: iconPath });

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
        const categories = await getAllBrandService();
        res.status(200).json({ message: "Categories retrieved successfully.", data: categories });
    } catch (error: any) {
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
};

export const getBrandById = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).json({ error: "Invalid Brand ID." });

        const Brand = await getBrandByIdService(id);
        res.status(200).json({ message: "Brand retrieved successfully.", data: Brand });
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
        if (files && files['icon'] && files['icon'][0]) updateData.icon = files['icon'][0].path;
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ error: "No valid fields provided for update." });
        }
        const updatedBrand = await updateBrandService(id, updateData);
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

        const deleted = await deleteBrandService(id);
        res.status(200).json({ message: "Brand deleted successfully.", data: deleted });
    } catch (error: any) {
        const status = error.message === "Brand not found." ? 404 : 500;
        res.status(status).json({ error: error.message });
    }
};
