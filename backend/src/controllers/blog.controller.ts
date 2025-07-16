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
        const { title, content } = req.body;

        if (!title || typeof title !== "string" || !content || typeof content !== "string") {
            return res.status(400).json({ error: "All field are required and must be a string." });
        }

        const files = req.files as Express.Multer.File[];
        if (!files) {
            return res.status(400).json({ error: "At least one image is required." });
        }

        const imagePaths = files.map(file => file.path);

        const blog = await addBlogService({ title, images: imagePaths, content });

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
        const { title, content } = req.body;
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        let updateData: any = {};
        const updateTitle = title && typeof title === "string" && title.trim();
        const updateContent = content && typeof content === "string";
        if (updateTitle && updateContent) {
            updateData.title = title;
            updateData.content = content;
        }

        if (files && files['image'] && files['image'][0]) updateData.image = files['image'][0].path;

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
