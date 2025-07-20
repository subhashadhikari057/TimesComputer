import prisma from "../prisma/client";

interface BrandInput {
  name: string;
  image: string;
}

export const addBrandService = async ({ name, image }: BrandInput) => {
  const existing = Boolean(await prisma.brand.findUnique({ where: { name } }));
  if (existing) throw new Error("Brand already exists.");

  const Brand = await prisma.brand.create({
    data: {
      name,
      image,
    },
  });

  return Brand;
};

export const getAllBrandService = async () => {
  return await prisma.brand.findMany();
};

export const getBrandByIdService = async (id: number) => {
  const Brand = await prisma.brand.findUnique({ where: { id } });
  if (!Brand) throw new Error("Brand not found.");

  return Brand;
};

export const updateBrandService = async (
  id: number,
  updateData: { name?: string; image?: string }
) => {
  const exist = await prisma.brand.findUnique({ where: { id } });
  if (!exist) throw new Error("Brand not found.");

  if (updateData.name) {
    const duplicate = await prisma.brand.findUnique({
      where: { name: updateData.name },
    });
    if (duplicate && duplicate.id !== id)
      throw new Error("Brand name already exists.");
  }

  return await prisma.brand.update({
    where: { id },
    data: updateData,
  });
};

export const deleteBrandService = async (id: number) => {
  const exist = await prisma.brand.findUnique({ where: { id } });
  if (!exist) throw new Error("Brand not found.");

  return await prisma.brand.delete({ where: { id } });
};
