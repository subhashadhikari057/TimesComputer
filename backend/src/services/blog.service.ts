import prisma from "../prisma/client";

interface BlogInput {
    title: string;
    images: string[];
    content: string;
    author: string;
    slug: string;
    metadatas: any;
}

export const addBlogService = async ({ title, images, content, author, slug, metadatas }: BlogInput) => {

    const Blog = await prisma.blog.create({
        data: {
            title,
            images,
            content,
            author,
            slug,
            metadata: metadatas
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
    updateData: Partial<BlogInput> // partial so only some fields can be updated
) => {
    const exist = await prisma.blog.findUnique({ where: { id } });
    if (!exist) throw new Error("Blog not found.");

    const prismaUpdateData: {
        title?: string;
        images?: string[];
        content?: string;
        author?: string;
        slug?: string;
        metadata?: any;
    } = {};

    if (updateData.title) prismaUpdateData.title = updateData.title;
    if (updateData.content) prismaUpdateData.content = updateData.content;
    if (updateData.author) prismaUpdateData.author = updateData.author;
    if (updateData.slug) prismaUpdateData.slug = updateData.slug;

    if (updateData.images) {
        prismaUpdateData.images = Array.isArray(updateData.images)
            ? updateData.images
            : [updateData.images];
    }

    if (updateData.metadatas) {
        prismaUpdateData.metadata = typeof updateData.metadatas === 'string'
            ? updateData.metadatas
            : JSON.stringify(updateData.metadatas);
    }

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
