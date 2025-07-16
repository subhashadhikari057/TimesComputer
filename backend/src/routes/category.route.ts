import express from "express";
const router = express.Router();

import { uploadCategoryMedia } from '../middlewares/upload.middleware';
import { authenticate, isAdmin } from "../middlewares/auth.middleware";
import { addCategory, deleteCategory, getAllCategory, getCategoryById, updateCategory } from "../controllers/category.controller";

router.route("/").get(getAllCategory).post(authenticate, isAdmin, uploadCategoryMedia, addCategory);
router.route("/:id").get(getCategoryById).patch(authenticate, isAdmin, uploadCategoryMedia, updateCategory).delete(authenticate, isAdmin, deleteCategory)

export default router;