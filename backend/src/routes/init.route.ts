import express from "express";
import {
    signup,
    superAdminExists,
} from "../controllers/init.controller";

const router = express.Router();

router.get("/", superAdminExists);
router.post("/", signup);

export default router;