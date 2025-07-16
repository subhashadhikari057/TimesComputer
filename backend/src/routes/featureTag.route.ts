import express from "express";
const router = express.Router();

import { authenticate, isAdmin } from "../middlewares/auth.middleware";
import { addFeatureTag, deleteFeatureTag, getAllFeatureTag, getFeatureTagById, getProductByFeatureTag, updateFeatureTag } from "../controllers/featureTag.controller";

router.route("/products/:id").get(getProductByFeatureTag);
router.route("/").get(getAllFeatureTag).post(authenticate, isAdmin, addFeatureTag);
router.route("/:id").get(getFeatureTagById).patch(authenticate, isAdmin, updateFeatureTag).delete(authenticate, isAdmin, deleteFeatureTag);

export default router;