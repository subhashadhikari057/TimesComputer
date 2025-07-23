import express from "express";
const router = express.Router();

import { createInquiry, createBulkInquiry } from "../controllers/inquiry.controller";

router.route("/post/:id").post(createInquiry);
router.route("/bulk/:id").post(createBulkInquiry);

export default router;