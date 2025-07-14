import prisma from "../prisma/client";

export const addMarketingTagService = async (name: string) => {
    if (!name) {
        const error = new Error("MarketingTag name is required.");
        (error as any).statusCode = 400;
        throw error;
    }

    const existingTag = await prisma.marketingTag.findUnique({ where: { name } });
    if (existingTag) {
        const error = new Error("Marketing tag already exists.");
        (error as any).statusCode = 409;
        throw error;
    }

    return await prisma.marketingTag.create({ data: { name } });
};

export const getAllMarketingTagService = async () => {
    return await prisma.marketingTag.findMany();
};

export const getMarketingTagByIdService = async (id: number) => {
    if (isNaN(id)) {
        const error = new Error("Invalid MarketingTag ID.");
        (error as any).statusCode = 400;
        throw error;
    }

    const marketingTag = await prisma.marketingTag.findUnique({ where: { id } });
    if (!marketingTag) {
        const error = new Error("MarketingTag not found.");
        (error as any).statusCode = 404;
        throw error;
    }

    return marketingTag;
};

export const updateMarketingTagService = async (id: number, name: string) => {
    if (isNaN(id)) {
        const error = new Error("Invalid MarketingTag ID.");
        (error as any).statusCode = 400;
        throw error;
    }
    if (!name || typeof name !== "string") {
        const error = new Error("MarketingTag name is required and must be a string.");
        (error as any).statusCode = 400;
        throw error;
    }

    const existingTag = await prisma.marketingTag.findUnique({ where: { id } });
    if (!existingTag) {
        const error = new Error("MarketingTag not found.");
        (error as any).statusCode = 404;
        throw error;
    }

    return await prisma.marketingTag.update({
        where: { id },
        data: { name },
    });
};

export const deleteMarketingTagService = async (id: number) => {
    if (isNaN(id)) {
        const error = new Error("Invalid MarketingTag ID.");
        (error as any).statusCode = 400;
        throw error;
    }

    const existingTag = await prisma.marketingTag.findUnique({ where: { id } });
    if (!existingTag) {
        const error = new Error("MarketingTag not found.");
        (error as any).statusCode = 404;
        throw error;
    }

    return await prisma.marketingTag.delete({ where: { id } });
};

export const getProductByMarketingTagService = async (tagId: number) => {
    if (isNaN(tagId)) {
        const error = new Error("Invalid marketing-tag ID.");
        (error as any).statusCode = 400;
        throw error;
    }

    const marketingTag = await prisma.marketingTag.findUnique({ where: { id: tagId } });
    if (!marketingTag) {
        const error = new Error("Marketing-tag not found.");
        (error as any).statusCode = 404;
        throw error;
    }

    const products = await prisma.productMarketingTag.findMany({
        where: { tagId },
        include: { product: true },
    });

    return products.map((pc) => pc.product);
};
