import prisma from "../prisma/client";

interface BlogInput {
    title: string;
    images: string[];
    content: string;
}

export const addBlogService = async ({ title, images, content }: BlogInput) => {
    const Blog = await prisma.blog.create({
        data: {
            title,
            images,
            content,
        },
    });
    return Blog;
};

export const getAllBlogService = async () => {
    return await prisma.blog.findMany();
};

export const getBlogByIdService = async (id: number) => {
    const Blog = await prisma.blog.findUnique({ where: { id } });
    if (!Blog) throw new Error("Blog not found.");

    return Blog;
};

export const updateBlogService = async (
    id: number,
    updateData: { title?: string; images?: string; content?: string }
) => {
    const exist = await prisma.blog.findUnique({ where: { id } });
    if (!exist) throw new Error("Blog not found.");

    const prismaUpdateData: {
        title?: string;
        images?: string[]; // ✅ proper type
        content?: string;
    } = {};

    if (updateData.title) prismaUpdateData.title = updateData.title;
    if (updateData.content) prismaUpdateData.content = updateData.content;
    if (updateData.images) prismaUpdateData.images = [updateData.images]; // ✅ FIX

    return await prisma.blog.update({
        where: { id },
        data: prismaUpdateData,
    });
};


export const deleteBlogService = async (id: number) => {
    const exist = await prisma.blog.findUnique({ where: { id } });
    if (!exist) throw new Error("Blog not found.");

    return await prisma.blog.delete({ where: { id } });
};
