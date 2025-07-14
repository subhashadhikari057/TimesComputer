import express from "express";
import { addColor, deleteColor, getAllColors, getColorById, getProductByColorId, updateColor } from "../controllers/color.controller";
import { authenticate, isAdmin } from "../middlewares/auth.middleware";

const router = express.Router();

router.route("/add").post(authenticate, isAdmin, addColor);
router.route("/get").get(getAllColors);
router.route("/get/:id").get(getColorById);
router.route("/get/:id/products").get(getProductByColorId);
router.route("/update/:id").patch(authenticate, isAdmin, updateColor);
router.route("/delete/:id").delete(authenticate, isAdmin, deleteColor);

export default router;