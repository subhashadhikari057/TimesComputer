import express from "express";
import { createInquiry } from "../controllers/inquiry.controller";
const router = express.Router();

router.route("/post/:id").post(createInquiry);

export default router;