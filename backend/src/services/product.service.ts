import { Prisma } from '@prisma/client';
import prisma from '../prisma/client';
import { Request } from 'express';

export const getAllProductsService = async (query: any) => {
  const { isPublished } = query;
  let where: Prisma.ProductWhereInput = {};

  if (isPublished !== undefined) {
    where.isPublished = String(isPublished).toLowerCase() === 'true';
  }

  return prisma.product.findMany({
    where,
    include: productIncludes,
  });
};

export const getProductByIdService = (id: number) => {
  return prisma.product.findUnique({
    where: { id },
    include: productIncludes,
  });
};

export const getProductBySlugService = (slug: string) => {
  return prisma.product.findUnique({
    where: { slug },
    include: productIncludes,
  });
};

export const createProductService = async (data: any) => {
  const {
    name, slug, description, price, stock, isPublished,
    brochure, specs, brandId, categoryId,
    images, featureTagIds, marketingTagIds, colorIds, isFeature
  } = data;


  return prisma.product.create({
    data: {
      name,
      slug,
      description,
      price,
      stock,
      isPublished,
      isFeature,
      brochure,
      specs,
      brand: brandId ? { connect: { id: brandId } } : undefined,
      category: categoryId ? { connect: { id: categoryId } } : undefined,
      images,
      featureTags: featureTagIds?.length
        ? { createMany: { data: featureTagIds.map((tagId: number) => ({ tagId })) } }
        : undefined,
      marketingTags: marketingTagIds?.length
        ? { createMany: { data: marketingTagIds.map((tagId: number) => ({ tagId })) } }
        : undefined,
      colors: colorIds?.length
        ? { createMany: { data: colorIds.map((colorId: number) => ({ colorId })) } }
        : undefined,
    },
    include: productIncludes,
  });
};

export const updateProductService = async (id: number, data: any) => {
  const {
    name, slug, description, price, stock, isPublished,
    brochure, specs, brandId, categoryId,
    images, featureTagIds, marketingTagIds, colorIds, isFeature
  } = data;

  const updateData: Prisma.ProductUpdateInput = {
    name,
    slug,
    description,
    price,
    stock,
    isPublished,
    isFeature,
    brochure,
    specs,
    brand: brandId !== undefined
      ? brandId === null ? { disconnect: true } : { connect: { id: brandId } }
      : undefined,
    images,
    category: categoryId !== undefined
      ? categoryId === null ? { disconnect: true } : { connect: { id: categoryId } }
      : undefined,
    updatedAt: new Date(),
  };

  if (featureTagIds !== undefined) {
    await prisma.productFeatureTag.deleteMany({ where: { productId: id } });
    updateData.featureTags = {
      createMany: {
        data: featureTagIds.map((tagId: number) => ({ tagId })),
      },
    };
  }

  if (marketingTagIds !== undefined) {
    await prisma.productMarketingTag.deleteMany({ where: { productId: id } });
    updateData.marketingTags = {
      createMany: {
        data: marketingTagIds.map((tagId: number) => ({ tagId })),
      },
    };
  }

  if (colorIds !== undefined) {
    await prisma.productColor.deleteMany({ where: { productId: id } });
    updateData.colors = {
      createMany: {
        data: colorIds.map((colorId: number) => ({ colorId })),
      },
    };
  }

  return prisma.product.update({
    where: { id },
    data: updateData,
    include: productIncludes,
  });
};

export const deleteProductService = (id: number) => {
  return prisma.product.delete({ where: { id } });
};

const productIncludes = {
  brand: true,
  category: true,
  featureTags: {
    include: { tag: true },
  },
  marketingTags: {
    include: { tag: true },
  },
  colors: {
    include: { color: true },
  },
};