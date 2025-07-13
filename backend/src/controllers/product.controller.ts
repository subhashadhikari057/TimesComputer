import { Request, Response } from 'express';
import { ZodError } from 'zod';
import {
    // createProductService,
    deleteProductService,
    getAllProductsService,
    getProductByIdService,
    getProductBySlugService,
    updateProductService,
} from '../services/product.service';
import { CreateProductSchema, UpdateProductSchema } from '../validations/product.schema';
import prisma from '../prisma/client';
import { Prisma } from '@prisma/client';

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
        const body = req.body;

        // Convert and validate values
        body.price = Number(body.price);
        body.stock = Number(body.stock);
        body.brandId = isNaN(Number(body.brandId)) ? null : Number(body.brandId);
        body.categoryId = isNaN(Number(body.categoryId)) ? null : Number(body.categoryId);
        body.isPublished = body.isPublished === 'true';
        body.slug = body.slug?.toLowerCase().replace(/\s+/g, '-');

        // Handle optional values
        body.brochure = !body.brochure || body.brochure.trim() === '' ? null : body.brochure;
        body.specs = body.specs ? JSON.parse(body.specs) : {};
        body.featureTagIds = body.featureTagIds ? JSON.parse(body.featureTagIds) : [];
        body.marketingTagIds = body.marketingTagIds ? JSON.parse(body.marketingTagIds) : [];
        body.colorIds = body.colorIds ? JSON.parse(body.colorIds) : [];

        // ✅ Validate with Zod after transformation
        const data = CreateProductSchema.parse(body);
        const {
            name,
            slug,
            description,
            price,
            stock,
            isPublished,
            brochure,
            specs,
            brandId,
            categoryId,
            featureTagIds,
            marketingTagIds,
            colorIds,
        } = data;

        const productExist = await prisma.product.findUnique({ where: { slug } });
        if (productExist)
            return res.status(409).json({ message: 'Product already exists.' });

        const files = req.files as Express.Multer.File[];
        if (!files || files.length === 0) {
            return res.status(400).json({ error: 'At least one image is required.' });
        }
        const imagePaths = files.map((file) => file.path);

        // 1. Create product first without featureTags, marketingTags, colors
        const product = await prisma.product.create({
            data: {
                name,
                slug,
                description,
                price,
                stock,
                isPublished,
                brochure,
                specs: specs as Prisma.InputJsonValue,
                brandId,
                categoryId,
                images: imagePaths,
            },
        });

        // 2. Create relations manually by inserting into join tables
        if (featureTagIds && featureTagIds.length > 0) {
            await prisma.productFeatureTag.createMany({
                data: featureTagIds.map((tagId: number) => ({
                    productId: product.id,
                    tagId,
                })),
                skipDuplicates: true,
            });
        }

        if (marketingTagIds && marketingTagIds.length > 0) {
            await prisma.productMarketingTag.createMany({
                data: marketingTagIds.map((tagId: number) => ({
                    productId: product.id,
                    tagId,
                })),
                skipDuplicates: true,
            });
        }

        if (colorIds && colorIds.length > 0) {
            await prisma.productColor.createMany({
                data: colorIds.map((colorId: number) => ({
                    productId: product.id,
                    colorId,
                })),
                skipDuplicates: true,
            });
        }

        res.status(201).json({ message: 'Product created successfully.', data: product });
    } catch (error: any) {
        console.error('Create product error:', error.message);
        res.status(500).json({ error: 'Internal server error.' });
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
