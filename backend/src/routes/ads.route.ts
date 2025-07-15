import express from "express";
import { uploadImage } from '../middlewares/upload.middleware';
import { authenticate, isAdmin, isSuperadmin } from "../middlewares/auth.middleware";
import { addAds, deleteAds, getAdsById, getAllAds, updateAds } from "../controllers/adBanner.controller";

const router = express.Router();

router.route("/add").post(authenticate, isSuperadmin, isAdmin, uploadImage, addAds);
router.route("/get").get(getAllAds);
router.route("/get/:id").get(getAdsById);
router.route("/update/:id").patch(authenticate, isAdmin, updateAds);
router.route("/delete/:id").delete(authenticate, isAdmin, deleteAds);

export default router;