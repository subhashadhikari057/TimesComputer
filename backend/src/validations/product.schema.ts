import { z } from 'zod';

export const ProductImageSchema = z.object({
  url: z.string().url('Image URL must be a valid URL.'),
});

export const CreateProductSchema = z.object({
  name: z.string().min(1, 'Product name is required.'),
  slug: z.string().min(1, 'Product slug is required.').regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be kebab-case.'),
  description: z.string().nullable().optional(),
  price: z.number().positive('Price must be a positive number.'),
  stock: z.number().int().min(0, 'Stock cannot be negative.').default(0),
  isPublished: z.boolean().default(true),
  brochure: z.string().url('Brochure URL must be a valid URL.').nullable().optional(),
  specs: z.record(z.any()).nullable().optional(),
  brandId: z.number().int().positive('Brand ID must be a positive integer.').nullable().optional(),
  categoryId: z.number().int().positive('Category ID must be a positive integer.').nullable().optional(),
  images: z.array(ProductImageSchema).optional().default([]),
  featureTagIds: z.array(z.number().int().positive('Feature Tag ID must be a positive integer.')).optional().default([]),
  marketingTagIds: z.array(z.number().int().positive('Marketing Tag ID must be a positive integer.')).optional().default([]),
  colorIds: z.array(z.number().int().positive('Color ID must be a positive integer.')).optional().default([]),
});

export const UpdateProductSchema = z.object({
  name: z.string().min(1, 'Product name is required.').optional(),
  slug: z.string().min(1, 'Product slug is required.').regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be kebab-case.').optional(),
  description: z.string().nullable().optional(),
  price: z.number().positive('Price must be a positive number.').optional(),
  stock: z.number().int().min(0, 'Stock cannot be negative.').optional(),
  isPublished: z.boolean().optional(),
  brochure: z.string().url('Brochure URL must be a valid URL.').nullable().optional(),
  specs: z.record(z.any()).nullable().optional(),
  brandId: z.number().int().positive('Brand ID must be a positive integer.').nullable().optional(),
  categoryId: z.number().int().positive('Category ID must be a positive integer.').nullable().optional(),
  images: z.array(ProductImageSchema).optional(),
  featureTagIds: z.array(z.number().int().positive('Feature Tag ID must be a positive integer.')).optional(),
  marketingTagIds: z.array(z.number().int().positive('Marketing Tag ID must be a positive integer.')).optional(),
  colorIds: z.array(z.number().int().positive('Color ID must be a positive integer.')).optional(),
});
