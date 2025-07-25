import { Request, Response } from 'express';
import { ZodError } from 'zod';
import {
    createProductService,
    deleteProductService,
    getAllProductsService,
    getProductByIdService,
    getProductBySlugService,
    updateProductService,
    incrementProductViewService,
} from '../services/product.service';
import { CreateProductSchema, UpdateProductSchema } from '../validations/product.schema';
import prisma from '../prisma/client';
import slugify from 'slugify';
import { logAudit } from '../services/auditLog.service';
import { parse as csvParse } from 'csv-parse/sync';
import fs from 'fs';
import * as XLSX from 'xlsx';
import { addBrandService } from '../services/brand.service';
import { addCategoryService } from '../services/category.service';
import { addFeatureTagService } from '../services/featureTag.service';
import { addMarketingTagService } from '../services/marketingTag.service';
// Make sure to install xlsx: npm install xlsx

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
            isFeature: req.body.isFeature === 'true',
            slug // <-- ensure slug is included
        });

        const product = await createProductService({ ...parsedData, slug });

        // Log audit
        try {
            const currentUser = (req as any).user;
            if (currentUser?.id) {
                await logAudit({
                    actorId: currentUser.id,
                    targetId: product.id.toString(),
                    action: "CREATE_PRODUCT",
                    message: `Created product: ${product.name}`,
                    ip: req.ip,
                    userAgent: req.headers["user-agent"]
                });
            }
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
            if (currentUser?.id) {
                await logAudit({
                    actorId: currentUser.id,
                    targetId: id.toString(),
                    action: "UPDATE_PRODUCT",
                    message: `Updated product: ${product.name}`,
                    ip: req.ip,
                    userAgent: req.headers["user-agent"]
                });
            }
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
            if (currentUser?.id) {
                await logAudit({
                    actorId: currentUser.id,
                    targetId: id.toString(),
                    action: "DELETE_PRODUCT",
                    message: `Deleted product: ${productToDelete.name}`,
                    ip: req.ip,
                    userAgent: req.headers["user-agent"]
                });
            }
        } catch (logError) {
            console.error("Audit log error:", logError);
        }

        res.status(200).json(result);
    } catch (error) {
        handleError(res, error);
    }
};

export const incrementProductView = async (req: Request, res: Response) => {
    try {
        const { slug } = req.params;
        if (!slug) return res.status(400).json({ error: 'Product slug is required.' });

        const product = await incrementProductViewService(slug);
        res.status(200).json({ 
            success: true, 
            message: 'View count incremented successfully',
            views: product.views 
        });
    } catch (error) {
        handleError(res, error);
    }
};

export const importProductsFromCSV = async (req: Request, res: Response) => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const images = files?.images || [];
    const csvFiles = files?.csv || [];
    if (!csvFiles || csvFiles.length === 0) {
      return res.status(400).json({ error: 'CSV or Excel file is required.' });
    }
    const csvFilePath = csvFiles[0].path;
    let records: any[] = [];
    if (csvFilePath.endsWith('.csv')) {
      const csvData = await fs.promises.readFile(csvFilePath, 'utf8');
      try {
        records = csvParse(csvData, { columns: true, skip_empty_lines: true });
      } catch (err) {
        const errorMsg = (err && typeof err === 'object' && 'message' in err) ? (err as Error).message : String(err);
        console.error('CSV Parse Error:', errorMsg);
        return res.status(400).json({ error: 'Invalid CSV format.', details: errorMsg });
      }
    } else if (csvFilePath.endsWith('.xlsx') || csvFilePath.endsWith('.xls')) {
      // Excel logic
      const workbook: XLSX.WorkBook = XLSX.readFile(csvFilePath);
      const sheetName = workbook.SheetNames?.[0];
      if (!sheetName) {
        return res.status(400).json({ error: 'Excel file has no sheets.' });
      }
      const worksheet = workbook.Sheets?.[sheetName];
      if (!worksheet) {
        return res.status(400).json({ error: `Worksheet '${sheetName}' not found in Excel file.` });
      }
      records = XLSX.utils.sheet_to_json(worksheet);
    } else {
      return res.status(400).json({ error: 'Unsupported file format.' });
    }
    const results = [];
    const BATCH_SIZE = 10;
    for (let i = 0; i < records.length; i += BATCH_SIZE) {
      const batch = records.slice(i, i + BATCH_SIZE);
      const batchResults = await Promise.all(batch.map(async (row, index) => {
        try {
          // --- Brand ---
          let brandId = null;
          if (row.brand) {
            let brand = await prisma.brand.findUnique({ where: { name: row.brand } });
            if (!brand) {
              try {
                brand = await addBrandService({ name: row.brand, image: row.brandImage || '' });
              } catch (e) {
                // If already exists, fetch again
                brand = await prisma.brand.findUnique({ where: { name: row.brand } });
              }
            }
            if (brand) brandId = brand.id;
          }
          // --- Category ---
          let categoryId = null;
          if (row.category) {
            let category = await prisma.category.findUnique({ where: { name: row.category } });
            if (!category) {
              try {
                const defaultImage = '/uploads/default-category.png';
                const defaultIcon = '/uploads/default-category-icon.svg';
                category = await addCategoryService({
                  name: row.category,
                  image: row.categoryImage || defaultImage,
                  icon: row.categoryIcon || defaultIcon,
                });
              } catch (e) {
                category = await prisma.category.findUnique({ where: { name: row.category } });
              }
            }
            if (category) categoryId = category.id;
          }
          // --- Feature Tags ---
          let featureTagIds: number[] = [];
          if (row.feature_tags) {
            const tags = String(row.feature_tags).split(',').map((t: string) => t.trim()).filter(Boolean);
            for (const tagName of tags) {
              let tag = await prisma.featureTag.findUnique({ where: { name: tagName } });
              if (!tag) {
                try {
                  tag = await addFeatureTagService({ name: tagName });
                } catch (e) {
                  tag = await prisma.featureTag.findUnique({ where: { name: tagName } });
                }
              }
              if (tag) featureTagIds.push(tag.id);
            }
          }
          // --- Marketing Tags ---
          let marketingTagIds: number[] = [];
          if (row.marketing_tags) {
            const tags = String(row.marketing_tags).split(',').map((t: string) => t.trim()).filter(Boolean);
            for (const tagName of tags) {
              let tag = await prisma.marketingTag.findUnique({ where: { name: tagName } });
              if (!tag) {
                try {
                  tag = await addMarketingTagService(tagName);
                } catch (e) {
                  tag = await prisma.marketingTag.findUnique({ where: { name: tagName } });
                }
              }
              if (tag) marketingTagIds.push(tag.id);
            }
          }
          // --- Colors ---
          let colorIds: number[] = [];
          if (row.colors) {
            const colors = String(row.colors).split(',').map((c: string) => c.trim()).filter(Boolean);
            for (const colorValue of colors) {
              // Try to find by hexCode first, then by name
              let color = await prisma.color.findUnique({ where: { hexCode: colorValue } });
              if (!color) {
                color = await prisma.color.findFirst({ where: { name: colorValue } });
              }
              if (color) colorIds.push(color.id);
            }
          }
          // --- Images ---
          let productImages: string[] = [];
          if (row.images) {
            productImages = String(row.images).split(',').map((img: string) => img.trim()).filter(Boolean).map((img: string) => `/uploads/${img}`);
          } else if (images.length > 0) {
            productImages = images.map(f => f.path);
          }
          const slug = slugify(row.name, { lower: true, strict: true });
          const productData = {
            name: row.name,
            description: row.description,
            price: parseFloat(row.price),
            stock: parseInt(row.stock),
            isPublished: row.isPublished !== undefined ? row.isPublished === 'true' || row.isPublished === true : true,
            isFeature: row.isFeature !== undefined ? row.isFeature === 'true' || row.isFeature === true : true,
            specs: row.specs ? (typeof row.specs === 'string' ? JSON.parse(row.specs) : row.specs) : null,
            brochure: row.brochure || null,
            brandId,
            categoryId,
            images: productImages,
            featureTagIds,
            marketingTagIds,
            colorIds,
            slug,
          };
          const parsed = CreateProductSchema.parse(productData);
          const product = await createProductService(parsed);
          return { index: i + index, status: 'success', product };
        } catch (error: any) {
          let userMessage = "An unexpected error occurred.";
          if (error.code === 'P2002' && error.meta?.target?.includes('slug')) {
            userMessage = "A product with this name already exists.";
          } else if (error.code === 'P2003') {
            userMessage = "Selected brand or category does not exist.";
          } else if (error instanceof ZodError) {
            userMessage = "Invalid product data. Please check your file.";
          }
          return { index: i + index, status: 'error', error: userMessage };
        }
      }));
      results.push(...batchResults);
    }
    res.status(200).json({ summary: results });
  } catch (error) {
    console.error('ImportProductsFromCSV error:', error);
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