import express from "express";
import {
    register,
    login,
    logout,
    refresh,
    changePassword,
} from "../controllers/auth.controller";
import { authenticate, authLimiter } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/register", authLimiter, register); // Superadmin creation (only if none exist)
router.post("/login", authLimiter, login);       // Login and set cookies
router.post("/logout", logout);     // Clear cookies
router.post("/refresh", refresh);   // Get new access token
router.patch("/change-password", authenticate, changePassword); // Only for logged-in users

export default router;
