import express from "express";
import { addfeatureTag, deleteFeatureTag, getAllFeatureTags, getFeatureTagById, getProductByFeatureTag, updateFeatureTag } from "../controllers/featureTag.controller";
import { authenticate, isAdmin } from "../middlewares/auth.middleware";

const router = express.Router();

router.route("/add").post(authenticate, isAdmin, addfeatureTag);
router.route("/get").get(getAllFeatureTags);
router.route("/get/:id").get(getFeatureTagById);
router.route("/get/:id/products").get(getProductByFeatureTag);
router.route("/update/:id").patch(authenticate, isAdmin, updateFeatureTag);
router.route("/delete/:id").delete(authenticate, isAdmin, deleteFeatureTag);

export default router;