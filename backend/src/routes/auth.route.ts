import express from "express";
import {
    login,
    logout,
    refresh,
    changePassword,
    verify,
} from "../controllers/auth.controller";
import { authenticate, authLimiter } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/refresh/login", authLimiter, login);       // Login and set cookies
router.post("/refresh/logout", logout);     // Clear cookies
router.post("/refresh/renewtoken", refresh);   // Renew access_token
router.get("/verify", authenticate, verify);    // Verify token
router.patch("/change-password", authenticate, changePassword); // Only for logged-in users

export default router;
