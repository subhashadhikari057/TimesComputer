import express from "express";
import { addFeatureTag, deleteFeatureTag, getAllFeatureTag, getFeatureTagById, getProductByFeatureTag, updateFeatureTag } from "../controllers/featureTag.controller";
import { authenticate, isAdmin } from "../middlewares/auth.middleware";

const router = express.Router();

router.route("/add").post(authenticate, isAdmin, addFeatureTag);
router.route("/get").get(getAllFeatureTag);
router.route("/get/:id").get(getFeatureTagById);
router.route("/get/:id/products").get(getProductByFeatureTag);
router.route("/update/:id").patch(authenticate, isAdmin, updateFeatureTag);
router.route("/delete/:id").delete(authenticate, isAdmin, deleteFeatureTag);

export default router;