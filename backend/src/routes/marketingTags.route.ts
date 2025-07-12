import express from "express";
import { addMarketingTag, deleteMarketingTag, getAllMarketingTags, getMarketingTagById, getProductByMarketingTag, updateMarketingTag } from "../controllers/marketingTag.controller";
import { authenticate, isAdmin } from "../middlewares/auth.middleware";

const router = express.Router();

router.route("/add").post(authenticate, isAdmin, addMarketingTag);
router.route("/get").get(getAllMarketingTags);
router.route("/get/:id").get(getMarketingTagById);
router.route("/get/:id/products").get(getProductByMarketingTag);
router.route("/update/:id").patch(authenticate, isAdmin, updateMarketingTag);
router.route("/delete/:id").delete(authenticate, isAdmin, deleteMarketingTag);

export default router;