import express from "express";
import { addMarketingTag, deleteMarketingTag, getAllMarketingTags, getMarketingTagById, getProductByMarketingTag, updateMarketingTag } from "../controllers/marketingTag.controller";
import { authenticate, isAdmin } from "../middlewares/auth.middleware";

const router = express.Router();

router.route("/:id/products").get(getProductByMarketingTag);
router.route("/").get(getAllMarketingTags).post(authenticate, isAdmin, addMarketingTag)
router.route("/:id").get(getMarketingTagById).patch(authenticate, isAdmin, updateMarketingTag).delete(authenticate, isAdmin, deleteMarketingTag);

export default router;