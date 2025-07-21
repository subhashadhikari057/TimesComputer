import { Request, Response } from "express";
import {
    addColorService,
    getAllColorsService,
    getColorByIdService,
    updateColorService,
    deleteColorService,
} from "../services/color.service";
import { logAudit } from "../services/auditLog.service";

import prisma from "../prisma/client";

export const addColor = async (req: Request, res: Response) => {
    try {
        const color = await addColorService(req.body);

        // Log audit
        try {
            const currentUser = (req as any).user;
            await logAudit({
                actorId: currentUser?.id,
                targetId: color.id.toString(),
                action: "CREATE_COLOR",
                message: `Created color: ${color.name}`,
                ip: req.ip,
                userAgent: req.headers["user-agent"]
            });
        } catch (logError) {
            console.error("Audit log error:", logError);
        }

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
        res.status(error.status || 500).json({ error: error.message || "Internal Server Error" });
    }
};

export const getColorById = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const color = await getColorByIdService(id);
        res.status(200).json({ message: "Color retrieved successfully.", data: color });
    } catch (error: any) {
        res.status(error.status || 500).json({ error: error.message || "Internal Server Error" });
    }
};

export const updateColor = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const updatedColor = await updateColorService(id, req.body);

        // Log audit
        try {
            const currentUser = (req as any).user;
            await logAudit({
                actorId: currentUser?.id,
                targetId: id.toString(),
                action: "UPDATE_COLOR",
                message: `Updated color: ${updatedColor.name}`,
                ip: req.ip,
                userAgent: req.headers["user-agent"]
            });
        } catch (logError) {
            console.error("Audit log error:", logError);
        }

        res.status(200).json({ message: "Color updated successfully.", data: updatedColor });
    } catch (error: any) {
        res.status(error.status || 500).json({ error: error.message || "Internal Server Error" });
    }
};

export const deleteColor = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const colorToDelete = await getColorByIdService(id);
        await deleteColorService(id);

        // Log audit
        try {
            const currentUser = (req as any).user;
            await logAudit({
                actorId: currentUser?.id,
                targetId: id.toString(),
                action: "DELETE_COLOR",
                message: `Deleted color: ${colorToDelete.name}`,
                ip: req.ip,
                userAgent: req.headers["user-agent"]
            });
        } catch (logError) {
            console.error("Audit log error:", logError);
        }

        res.status(200).json({ message: "Color deleted successfully." });
    } catch (error: any) {
        res.status(error.status || 500).json({ error: error.message || "Internal Server Error" });
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