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

        await prisma.product.update({
            where: { id },
            data: { views: { increment: 1 } },
        });

        const product = await getProductByIdService(id);
        if (!product) return res.status(404).json({ error: 'Product not found.' });

        res.status(200).json(product);
    } catch (error) {
        handleError(res, error);
    }
};


export const getProductBySlug = async (req: Request, res: Response) => {
    try {
        const { slug } = req.params;

        const existing = await prisma.product.findUnique({ where: { slug } });
        if (!existing) return res.status(404).json({ error: 'Product not found.' });

        await prisma.product.update({
            where: { slug },
            data: { views: { increment: 1 } },
        });

        const product = await getProductBySlugService(slug);
        res.status(200).json(product);
    } catch (error) {
        handleError(res, error);
    }
};


export const createProduct = async (req: Request, res: Response) => {
    try {
        const data = CreateProductSchema.parse(req.body);
        const product = await createProductService(data);
        res.status(201).json(product);
    } catch (error) {
        handleError(res, error);
    }
};

export const updateProduct = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).json({ error: 'Invalid product ID.' });

        const data = UpdateProductSchema.parse(req.body);
        const product = await updateProductService(id, data);
        res.status(200).json(product);
    } catch (error) {
        handleError(res, error);
    }
};

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).json({ error: 'Invalid product ID.' });

        await deleteProductService(id);
        res.status(204).send();
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
        return res.status(409).json({ error: `Duplicate field: ${error.meta?.target}` });
    }

    if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Record not found.' });
    }

    if (error.code === 'P2003') {
        return res.status(400).json({ error: 'Foreign key constraint failed.' });
    }

    return res.status(500).json({ error: error.message || 'Unknown server error.' });
};