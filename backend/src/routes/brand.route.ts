import express from "express";
import { addBrand, deleteBrand, getAllBrands, getBrandById, updateBrand } from "../controllers/brand.controller";
import { uploadImage } from '../middlewares/upload.middleware';
import { authenticate, isAdmin } from "../middlewares/auth.middleware";

const router = express.Router();

router.route("/add").post(authenticate, isAdmin, uploadImage, addBrand);
router.route("/get").get(getAllBrands);
router.route("/get/:id").get(getBrandById);
router.route("/update/:id").patch(authenticate, isAdmin, updateBrand);
router.route("/delete/:id").delete(authenticate, isAdmin, deleteBrand);

export default router;