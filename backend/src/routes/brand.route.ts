import express from "express";
const router = express.Router();

import { uploadCategoryMedia } from '../middlewares/upload.middleware';
import { authenticate, isAdmin } from "../middlewares/auth.middleware";
import { addBrand, deleteBrand, getAllBrands, getBrandById, updateBrand } from "../controllers/brand.controller";

router.route("/").get(getAllBrands).post(authenticate, isAdmin, uploadCategoryMedia, addBrand);
router.route("/:id").get(getBrandById).patch(authenticate, isAdmin, uploadCategoryMedia, updateBrand).delete(authenticate, isAdmin, deleteBrand)

export default router;