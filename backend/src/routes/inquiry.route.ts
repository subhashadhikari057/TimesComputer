import express from "express";
const router = express.Router();

import { createInquiry } from "../controllers/inquiry.controller";

router.route("/post/:id").post(createInquiry);

export default router;