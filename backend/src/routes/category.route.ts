import express from "express";
import { addCategory, deleteCategory, getAllCategorys, getCategoryById, updateCategory } from "../controllers/category.controller";
import { uploadCategoryMedia } from '../middlewares/upload.middleware';
import { authenticate, isAdmin } from "../middlewares/auth.middleware";

const router = express.Router();

router.route("/add").post(/* authenticate, isAdmin, */ uploadCategoryMedia, addCategory);
router.route("/get").get(getAllCategorys);
router.route("/get/:id").get(getCategoryById);
router.route("/update/:id").patch(authenticate, isAdmin, uploadCategoryMedia, updateCategory);
router.route("/delete/:id").delete(authenticate, isAdmin, deleteCategory);

export default router;