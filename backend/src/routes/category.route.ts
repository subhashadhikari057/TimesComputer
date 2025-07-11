import express from "express";
import { addcategory, deletecategory, getAllcategorys, getcategoryById, updatecategory } from "../controllers/category.controller";
import { upload } from '../middlewares/upload.middleware';

const router = express.Router();

router.route("/add").post(upload, addcategory);
router.route("/get").get(getAllcategorys);
router.route("/get/:id").get(getcategoryById);
router.route("/update/:id").patch(updatecategory);
router.route("/delete/:id").delete(deletecategory);

export default router;