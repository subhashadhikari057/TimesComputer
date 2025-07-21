import { Request, Response } from "express";
import {
  addFeatureTagService,
  deleteFeatureTagService,
  getAllFeatureTagService,
  getFeatureTagByIdService,
  getProductByFeatureTagService,
  updateFeatureTagService,
} from "../services/featureTag.service";
import { logAudit } from "../services/auditLog.service";

export const addFeatureTag = async (req: Request, res: Response) => {
  try {
    const featureTag = await addFeatureTagService(req.body);

    // Log audit
    try {
      const currentUser = (req as any).user;
      await logAudit({
        actorId: currentUser?.id,
        targetId: featureTag.id.toString(),
        action: "CREATE_FEATURE_TAG",
        message: `Created feature tag: ${featureTag.name}`,
        ip: req.ip,
        userAgent: req.headers["user-agent"]
      });
    } catch (logError) {
      console.error("Audit log error:", logError);
    }

    res.status(201).json({ message: "Feature tag created successfully.", data: featureTag });
  } catch (error: any) {
    res.status(error.status || 500).json({ error: error.message || "Internal Server Error" });
  }
};

export const getAllFeatureTag = async (_req: Request, res: Response) => {
  try {
    const featureTags = await getAllFeatureTagService();
    res.status(200).json({ message: "Feature tags retrieved successfully.", data: featureTags });
  } catch (error: any) {
    res.status(error.status || 500).json({ error: error.message || "Internal Server Error" });
  }
};

export const getFeatureTagById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const featureTag = await getFeatureTagByIdService(id);
    res.status(200).json({ message: "Feature tag retrieved successfully.", data: featureTag });
  } catch (error: any) {
    res.status(error.status || 500).json({ error: error.message || "Internal Server Error" });
  }
};

export const updateFeatureTag = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const updatedFeatureTag = await updateFeatureTagService(id, req.body);

    // Log audit
    try {
      const currentUser = (req as any).user;
      await logAudit({
        actorId: currentUser?.id,
        targetId: id.toString(),
        action: "UPDATE_FEATURE_TAG",
        message: `Updated feature tag: ${updatedFeatureTag.name}`,
        ip: req.ip,
        userAgent: req.headers["user-agent"]
      });
    } catch (logError) {
      console.error("Audit log error:", logError);
    }

    res.status(200).json({ message: "Feature tag updated successfully.", data: updatedFeatureTag });
  } catch (error: any) {
    res.status(error.status || 500).json({ error: error.message || "Internal Server Error" });
  }
};

export const deleteFeatureTag = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const featureTagToDelete = await getFeatureTagByIdService(id);
    await deleteFeatureTagService(id);

    // Log audit
    try {
      const currentUser = (req as any).user;
      await logAudit({
        actorId: currentUser?.id,
        targetId: id.toString(),
        action: "DELETE_FEATURE_TAG",
        message: `Deleted feature tag: ${featureTagToDelete.name}`,
        ip: req.ip,
        userAgent: req.headers["user-agent"]
      });
    } catch (logError) {
      console.error("Audit log error:", logError);
    }

    res.status(200).json({ message: "Feature tag deleted successfully." });
  } catch (error: any) {
    res.status(error.status || 500).json({ error: error.message || "Internal Server Error" });
  }
};

export const getProductByFeatureTag = async (req: Request, res: Response) => {
  try {
    const tagId = Number(req.params.id);
    const products = await getProductByFeatureTagService(tagId);
    res.status(200).json({ message: "Products retrieved successfully.", data: products });
  } catch (error: any) {
    res.status(error.status || 500).json({ error: error.message || "Internal Server Error" });
  }
};
