import { Request, Response, NextFunction } from "express";
import {
    addMarketingTagService,
    getAllMarketingTagService,
    getMarketingTagByIdService,
    updateMarketingTagService,
    deleteMarketingTagService,
    getProductByMarketingTagService,
} from "../services/marketingTag.service";

export const addMarketingTag = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name } = req.body;
        const newTag = await addMarketingTagService(name);
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
        res.status(200).json({ message: "MarketingTag updated successfully.", data: updatedTag });
    } catch (error) {
        next(error);
    }
};

export const deleteMarketingTag = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);
        const deletedTag = await deleteMarketingTagService(id);
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
