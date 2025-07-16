import express from "express";
import { addBrand, deleteBrand, getAllBrands, getBrandById, updateBrand } from "../controllers/brand.controller";
import { uploadCategoryMedia } from '../middlewares/upload.middleware';
import { authenticate, isAdmin } from "../middlewares/auth.middleware";

const router = express.Router();

router.route("/add").post(/* authenticate, isAdmin, */uploadCategoryMedia, addBrand);
router.route("/get").get(getAllBrands);
router.route("/get/:id").get(getBrandById);
router.route("/update/:id").patch(authenticate, isAdmin, uploadCategoryMedia, updateBrand);
router.route("/delete/:id").delete(authenticate, isAdmin, deleteBrand);

export default router;