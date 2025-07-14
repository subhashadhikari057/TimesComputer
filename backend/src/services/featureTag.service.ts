import prisma from "../prisma/client";

interface FeatureTagData {
  name: string;
}

export const addFeatureTagService = async ({ name }: FeatureTagData) => {
  if (!name) throw { status: 400, message: "Feature tag name is required." };

  const exists = await prisma.featureTag.findUnique({ where: { name } });
  if (exists) throw { status: 409, message: "Feature tag already exists." };

  return prisma.featureTag.create({ data: { name } });
};

export const getAllFeatureTagService = async () => {
  return prisma.featureTag.findMany();
};

export const getFeatureTagByIdService = async (id: number) => {
  if (isNaN(id)) throw { status: 400, message: "Invalid feature tag ID." };

  const featureTag = await prisma.featureTag.findUnique({ where: { id } });
  if (!featureTag) throw { status: 404, message: "Feature tag not found." };

  return featureTag;
};

export const updateFeatureTagService = async (id: number, data: Partial<FeatureTagData>) => {
  if (isNaN(id)) throw { status: 400, message: "Invalid feature tag ID." };

  const { name } = data;
  if (!name || typeof name !== "string") {
    throw { status: 400, message: "Feature tag name is required and must be a string." };
  }

  const existing = await prisma.featureTag.findUnique({ where: { id } });
  if (!existing) throw { status: 404, message: "Feature tag not found." };

  return prisma.featureTag.update({ where: { id }, data: { name } });
};

export const deleteFeatureTagService = async (id: number) => {
  if (isNaN(id)) throw { status: 400, message: "Invalid feature tag ID." };

  const existing = await prisma.featureTag.findUnique({ where: { id } });
  if (!existing) throw { status: 404, message: "Feature tag not found." };

  await prisma.featureTag.delete({ where: { id } });
};

export const getProductByFeatureTagService = async (tagId: number) => {
  if (isNaN(tagId)) throw { status: 400, message: "Invalid feature tag ID." };

  const featureTag = await prisma.featureTag.findUnique({ where: { id: tagId } });
  if (!featureTag) throw { status: 404, message: "Feature tag not found." };

  const productFeatureTags = await prisma.productFeatureTag.findMany({
    where: { tagId },
    include: { product: true },
  });

  return productFeatureTags.map((pft) => pft.product);
};
