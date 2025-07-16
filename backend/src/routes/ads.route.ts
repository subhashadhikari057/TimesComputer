import express from "express";
const router = express.Router();

import { uploadImages } from '../middlewares/upload.middleware';
import { authenticate, isAdmin } from "../middlewares/auth.middleware";
import { addAds, deleteAds, getAdsById, getAllAds, updateAds } from "../controllers/adBanner.controller";

router.route("/").get(getAllAds).post(authenticate, isAdmin, uploadImages, addAds);
router.route("/:id").get(getAdsById).patch(authenticate, isAdmin, uploadImages, updateAds).delete(authenticate, isAdmin, deleteAds).patch(authenticate, isAdmin, uploadImages, updateAds);

export default router;