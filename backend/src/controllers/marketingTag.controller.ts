import { Request, Response, NextFunction } from "express";
import {
    addMarketingTagService,
    getAllMarketingTagService,
    getMarketingTagByIdService,
    updateMarketingTagService,
    deleteMarketingTagService,
    getProductByMarketingTagService,
} from "../services/marketingTag.service";
import { logAudit } from "../services/auditLog.service";

export const addMarketingTag = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name } = req.body;
        const newTag = await addMarketingTagService(name);

        // Log audit
        try {
            const currentUser = (req as any).user;
            await logAudit({
                actorId: currentUser?.id,
                targetId: newTag.id.toString(),
                action: "CREATE_MARKETING_TAG",
                message: `Created marketing tag: ${newTag.name}`,
                ip: req.ip,
                userAgent: req.headers["user-agent"]
            });
        } catch (logError) {
            console.error("Audit log error:", logError);
        }

        res.status(201).json({ message: "MarketingTag created successfully.", data: newTag });
    } catch (error) {
        next(error);
    }
};

export const getAllMarketingTags = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const tags = await getAllMarketingTagService();
        res.status(200).json({ message: "MarketingTags retrieved successfully.", data: tags });
    } catch (error) {
        next(error);
    }
};

export const getMarketingTagById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);
        const tag = await getMarketingTagByIdService(id);
        res.status(200).json({ message: "MarketingTag retrieved successfully.", data: tag });
    } catch (error) {
        next(error);
    }
};

export const updateMarketingTag = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);
        const { name } = req.body;
        const updatedTag = await updateMarketingTagService(id, name);

        // Log audit
        try {
            const currentUser = (req as any).user;
            await logAudit({
                actorId: currentUser?.id,
                targetId: id.toString(),
                action: "UPDATE_MARKETING_TAG",
                message: `Updated marketing tag: ${updatedTag.name}`,
                ip: req.ip,
                userAgent: req.headers["user-agent"]
            });
        } catch (logError) {
            console.error("Audit log error:", logError);
        }

        res.status(200).json({ message: "MarketingTag updated successfully.", data: updatedTag });
    } catch (error) {
        next(error);
    }
};

export const deleteMarketingTag = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);
        const tagToDelete = await getMarketingTagByIdService(id);
        const deletedTag = await deleteMarketingTagService(id);

        // Log audit
        try {
            const currentUser = (req as any).user;
            await logAudit({
                actorId: currentUser?.id,
                targetId: id.toString(),
                action: "DELETE_MARKETING_TAG",
                message: `Deleted marketing tag: ${tagToDelete.name}`,
                ip: req.ip,
                userAgent: req.headers["user-agent"]
            });
        } catch (logError) {
            console.error("Audit log error:", logError);
        }

        res.status(200).json({ message: "MarketingTag deleted successfully.", data: deletedTag });
    } catch (error) {
        next(error);
    }
};

export const getProductByMarketingTag = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);
        const products = await getProductByMarketingTagService(id);
        res.status(200).json({ message: "Products retrieved successfully.", data: products });
    } catch (error) {
        next(error);
    }
};
