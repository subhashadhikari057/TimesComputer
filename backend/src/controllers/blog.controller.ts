import { Request, Response } from "express";
import {
    addBlogService,
    getAllBlogService,
    getBlogByIdService,
    updateBlogService,
    deleteBlogService,
} from "../services/blog.service";

export const addBlog = async (req: Request, res: Response) => {
    try {
        const { title, content, author, slug, metadata } = req.body;
        const metadatas = JSON.parse(metadata);

        if (!title || typeof title !== "string" || !content || typeof content !== "string") {
            return res.status(400).json({ error: "All field are required and must be a string." });
        }

        const files = req.files as Express.Multer.File[];
        if (!files || files.length === 0) {
            return res.status(400).json({ error: "At least one image is required." });
        }

        const imagePaths = files.map(file => file.path);

        const blog = await addBlogService({ title, images: imagePaths, content, author, slug, metadatas });

        res.status(201).json({ message: "Blog created successfully.", data: blog });
    } catch (error: any) {
        if (error.message.includes("exists")) {
            return res.status(409).json({ error: error.message });
        }
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
};

export const getAllBlog = async (_req: Request, res: Response) => {
    try {
        const blog = await getAllBlogService();
        res.status(200).json({ message: "Blog retrieved successfully.", data: blog });
    } catch (error: any) {
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
};

export const getBlogById = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).json({ error: "Invalid Blog ID." });

        const Blog = await getBlogByIdService(id);
        res.status(200).json({ message: "Blog retrieved successfully.", data: Blog });
    } catch (error: any) {
        const status = error.message === "Blog not found." ? 404 : 500;
        res.status(status).json({ error: error.message });
    }
};

export const updateBlog = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).json({ error: "Invalid Blog ID." });

        const { title, content, author, slug, metadata } = req.body;
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        const updateData: any = {};

        // Validate and add fields if they exist and are valid
        if (typeof title === "string" && title.trim()) {
            updateData.title = title.trim();
        }

        if (typeof content === "string" && content.trim()) {
            updateData.content = content.trim();
        }

        if (typeof author === "string" && author.trim()) {
            updateData.author = author.trim();
        }

        if (typeof slug === "string" && slug.trim()) {
            updateData.slug = slug.trim();
        }

        // Try to parse metadata if it exists
        if (metadata) {
            try {
                const parsedMetadata = typeof metadata === "string" ? JSON.parse(metadata) : metadata;

                if (parsedMetadata && typeof parsedMetadata === "object" && !Array.isArray(parsedMetadata)) {
                    updateData.metadata = parsedMetadata;
                } else {
                    return res.status(400).json({ error: "Metadata must be a valid JSON object." });
                }
            } catch {
                return res.status(400).json({ error: "Invalid JSON in metadata." });
            }
        }

        // Handle image upload (only first image)
        if (files && files["image"] && files["image"][0]) {
            updateData.images = [files["image"][0].path]; // assuming images is an array
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ error: "No valid fields provided for update." });
        }

        const updatedBlog = await updateBlogService(id, updateData);
        res.status(200).json({ message: "Blog updated successfully.", data: updatedBlog });
    } catch (error: any) {
        const status = error.message.includes("not found") ? 404 :
            error.message.includes("already exists") ? 409 : 500;
        res.status(status).json({ error: error.message });
    }
};


export const deleteBlog = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).json({ error: "Invalid Blog ID." });

        const deleted = await deleteBlogService(id);
        res.status(200).json({ message: "Blog deleted successfully.", data: deleted });
    } catch (error: any) {
        const status = error.message === "Blog not found." ? 404 : 500;
        res.status(status).json({ error: error.message });
    }
};
