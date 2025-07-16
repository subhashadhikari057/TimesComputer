import express from "express";
const router = express.Router();

import { uploadImages } from '../middlewares/upload.middleware';
import { authenticate, isAdmin } from "../middlewares/auth.middleware";
import { addBlog, deleteBlog, getAllBlog, getBlogById, updateBlog } from "../controllers/blog.controller";

router.route("/").get(getAllBlog).post(authenticate, isAdmin, uploadImages, addBlog);
router.route("/:id").get(getBlogById).patch(authenticate, isAdmin, uploadImages, updateBlog).delete(authenticate, isAdmin, deleteBlog)

export default router;