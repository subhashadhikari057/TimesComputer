import { Request, Response } from "express";
import {
  addCategoryService,
  getAllCategoryService,
  getCategoryByIdService,
  updateCategoryService,
  deleteCategoryService,
} from "../services/category.service";
import prisma from "../prisma/client";
import { logAudit } from "../services/auditLog.service";

export const addCategory = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const imageFiles = files && files['image'] ? files['image'] : [];
    const iconFiles = files && files['icon'] ? files['icon'] : [];

    if (!name || typeof name !== "string") {
      return res.status(400).json({ error: "Category name is required and must be a string." });
    }

    if (!imageFiles || imageFiles.length === 0) {
      return res.status(400).json({ error: "One image file is required." });
    }

    if (!iconFiles || iconFiles.length === 0) {
      return res.status(400).json({ error: "One SVG icon file is required." });
    }

    const imagePath = imageFiles[0].path;
    const iconPath = iconFiles[0].path;

    const category = await addCategoryService({ name, image: imagePath, icon: iconPath });

    // Log audit
    try {
      const currentUser = (req as any).user;
      await logAudit({
        actorId: currentUser?.id,
        targetId: category.id.toString(),
        action: "CREATE_CATEGORY",
        message: `Created category: ${category.name}`,
        ip: req.ip,
        userAgent: req.headers["user-agent"]
      });
    } catch (logError) {
      console.error("Audit log error:", logError);
    }

    res.status(201).json({ message: "Category created successfully.", data: category });
  } catch (error: any) {
    if (error.message.includes("exists")) {
      return res.status(409).json({ error: error.message });
    }
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
};

export const getAllCategories = async (_req: Request, res: Response) => {
  try {
    const category = await getAllCategoryService();
    res.status(200).json({ message: "Category retrieved successfully.", data: category });
  } catch (error: any) {
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid Category ID." });

    const category = await getCategoryByIdService(id);
    const product = await prisma.product.findMany({ where: { id } });
    res.status(200).json({ message: "Category retrieved successfully.", data: category, product });
  } catch (error: any) {
    const status = error.message === "Category not found." ? 404 : 500;
    res.status(status).json({ error: error.message });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { name } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    let updateData: any = {};
    if (name && typeof name === "string") updateData.name = name;
    if (files && files['image'] && files['image'][0]) updateData.image = files['image'][0].path;
    if (files && files['icon'] && files['icon'][0]) updateData.icon = files['icon'][0].path;
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: "No valid fields provided for update." });
    }
    
    const updatedCategory = await updateCategoryService(id, updateData);

    // Log audit
    try {
      const currentUser = (req as any).user;
      await logAudit({
        actorId: currentUser?.id,
        targetId: id.toString(),
        action: "UPDATE_CATEGORY",
        message: `Updated category: ${updatedCategory.name}`,
        ip: req.ip,
        userAgent: req.headers["user-agent"]
      });
    } catch (logError) {
      console.error("Audit log error:", logError);
    }

    res.status(200).json({ message: "Category updated successfully.", data: updatedCategory });
  } catch (error: any) {
    const status = error.message.includes("not found") ? 404 :
      error.message.includes("already exists") ? 409 : 500;
    res.status(status).json({ error: error.message });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid Category ID." });

    const categoryToDelete = await getCategoryByIdService(id);
    const deleted = await deleteCategoryService(id);

    // Log audit
    try {
      const currentUser = (req as any).user;
      await logAudit({
        actorId: currentUser?.id,
        targetId: id.toString(),
        action: "DELETE_CATEGORY",
        message: `Deleted category: ${categoryToDelete.name}`,
        ip: req.ip,
        userAgent: req.headers["user-agent"]
      });
    } catch (logError) {
      console.error("Audit log error:", logError);
    }

    res.status(200).json({ message: "Category deleted successfully.", data: deleted });
  } catch (error: any) {
    const status = error.message === "Category not found." ? 404 : 500;
    res.status(status).json({ error: error.message });
  }
};
