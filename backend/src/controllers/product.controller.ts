import { Request, Response } from 'express';
import { ZodError } from 'zod';
import {
    createProductService,
    deleteProductService,
    getAllProductsService,
    getProductByIdService,
    getProductBySlugService,
    updateProductService,
} from '../services/product.service';
import { CreateProductSchema, UpdateProductSchema } from '../validations/product.schema';
import prisma from '../prisma/client';
import slugify from 'slugify';
import { logAudit } from '../services/auditLog.service';

export const getAllProducts = async (req: Request, res: Response) => {
    try {
        const products = await getAllProductsService(req.query);
        res.status(200).json(products);
    } catch (error) {
        handleError(res, error);
    }
};

export const getProductById = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).json({ error: 'Invalid product ID.' });

        const product = await getProductByIdService(id);
        res.status(200).json(product);
    } catch (error) {
        handleError(res, error);
    }
};

export const getProductBySlug = async (req: Request, res: Response) => {
    try {
        const { slug } = req.params;
        if (!slug) return res.status(400).json({ error: 'Product slug is required.' });

        const product = await getProductBySlugService(slug);
        res.status(200).json(product);
    } catch (error) {
        handleError(res, error);
    }
};

export const createProduct = async (req: Request, res: Response) => {
    try {
        const slug = slugify(req.body.name, { lower: true, strict: true });
        const parsedData = CreateProductSchema.parse({
            ...req.body,
            price: parseFloat(req.body.price),
            stock: parseInt(req.body.stock),
            isPublished: req.body.isPublished === 'true',
            brandId: req.body.brandId ? parseInt(req.body.brandId) : null,
            categoryId: req.body.categoryId ? parseInt(req.body.categoryId) : null,
            featureTagIds: req.body.featureTagIds ? JSON.parse(req.body.featureTagIds) : [],
            marketingTagIds: req.body.marketingTagIds ? JSON.parse(req.body.marketingTagIds) : [],
            colorIds: req.body.colorIds ? JSON.parse(req.body.colorIds) : [],
            specs: req.body.specs ? JSON.parse(req.body.specs) : null,
            images: (req.files as Express.Multer.File[]).map(f => f.path),
            isFeature: req.body.isFeature === 'true'
        });

        const product = await createProductService({ ...parsedData, slug });

        // Log audit
        try {
            const currentUser = (req as any).user;
            await logAudit({
                actorId: currentUser?.id,
                targetId: product.id.toString(),
                action: "CREATE_PRODUCT",
                message: `Created product: ${product.name}`,
                ip: req.ip,
                userAgent: req.headers["user-agent"]
            });
        } catch (logError) {
            console.error("Audit log error:", logError);
        }

        res.status(201).json(product);
    } catch (error) {
        handleError(res, error);
    }
};

export const updateProduct = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).json({ error: 'Invalid product ID.' });

        // Parse existing images from the form field (JSON string)
        let existingImages: string[] = [];
        if (req.body.existingImages) {
            try {
                existingImages = JSON.parse(req.body.existingImages);
            } catch {
                existingImages = [];
            }
        }

        // Get new uploaded images
        const newImages = req.files && Array.isArray(req.files)
            ? (req.files as Express.Multer.File[]).map(f => f.path)
            : [];

        // Merge existing and new images
        const mergedImages = [...existingImages, ...newImages];

        const parsedData = UpdateProductSchema.parse({
            ...req.body,
            price: req.body.price ? parseFloat(req.body.price) : undefined,
            stock: req.body.stock ? parseInt(req.body.stock) : undefined,
            isPublished: req.body.isPublished === 'true',
            brandId: req.body.brandId ? parseInt(req.body.brandId) : undefined,
            categoryId: req.body.categoryId ? parseInt(req.body.categoryId) : undefined,
            featureTagIds: req.body.featureTagIds ? JSON.parse(req.body.featureTagIds) : undefined,
            marketingTagIds: req.body.marketingTagIds ? JSON.parse(req.body.marketingTagIds) : undefined,
            colorIds: req.body.colorIds ? JSON.parse(req.body.colorIds) : undefined,
            specs: req.body.specs ? JSON.parse(req.body.specs) : undefined,
            images: mergedImages,
            isFeature: req.body.isFeature === 'true'
        });

        const product = await updateProductService(id, parsedData);

        // Log audit
        try {
            const currentUser = (req as any).user;
            await logAudit({
                actorId: currentUser?.id,
                targetId: id.toString(),
                action: "UPDATE_PRODUCT",
                message: `Updated product: ${product.name}`,
                ip: req.ip,
                userAgent: req.headers["user-agent"]
            });
        } catch (logError) {
            console.error("Audit log error:", logError);
        }

        res.status(200).json(product);
    } catch (error) {
        handleError(res, error);
    }
};

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).json({ error: 'Invalid product ID.' });

        const productToDelete = await getProductByIdService(id);
        if (!productToDelete) {
            return res.status(404).json({ error: 'Product not found.' });
        }
        
        const result = await deleteProductService(id);

        // Log audit
        try {
            const currentUser = (req as any).user;
            await logAudit({
                actorId: currentUser?.id,
                targetId: id.toString(),
                action: "DELETE_PRODUCT",
                message: `Deleted product: ${productToDelete.name}`,
                ip: req.ip,
                userAgent: req.headers["user-agent"]
            });
        } catch (logError) {
            console.error("Audit log error:", logError);
        }

        res.status(200).json(result);
    } catch (error) {
        handleError(res, error);
    }
};

// --- Shared error handler ---
const handleError = (res: Response, error: any) => {
    if (error instanceof ZodError) {
        return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }

    if (error.code === 'P2002') {
        return res.status(409).json({ message: `Duplicate field: ${error.meta?.target}` });
    }

    if (error.code === 'P2025') {
        return res.status(404).json({ message: 'Record not found.' });
    }

    if (error.code === 'P2003') {
        return res.status(400).json({ message: 'Foreign key constraint failed.' });
    }

    return res.status(500).json({ message: error.message || 'Unknown server error.' });
};