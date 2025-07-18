import express from "express";
const router = express.Router();

import { authenticate, isAdmin } from "../middlewares/auth.middleware";
import { addColor, deleteColor, getAllColors, getColorById, getProductByColorId, updateColor } from "../controllers/color.controller";

router.route("/product/:id").get(getProductByColorId);
router.route("/").get(getAllColors).post(authenticate, isAdmin, addColor);
router.route("/:id").get(getColorById).patch(authenticate, isAdmin, updateColor).delete(authenticate, isAdmin, deleteColor);

export default router;