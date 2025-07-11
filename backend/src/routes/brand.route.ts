import express from "express";
import { addBrand, deleteBrand, getAllBrands, getBrandById, updateBrand } from "../controllers/brand.controller";
import { upload } from '../middlewares/upload.middleware';

const router = express.Router();

router.route("/add").post(upload, addBrand);
router.route("/get").get(getAllBrands);
router.route("/get/:id").get(getBrandById);
router.route("/update/:id").patch(updateBrand);
router.route("/delete/:id").delete(deleteBrand);

export default router;