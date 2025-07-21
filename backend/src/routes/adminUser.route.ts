import { Router } from "express";
import {
    getAdmins,
    createAdminUser,
    updateAdminUser,
    deleteAdminUser,
    resetAdminPassword,
    getSingleAdmin,
    getAuditLogs,
    getLoginLogs,
} from "../controllers/adminUser.controller";
import { authenticate, authLimiter, isAdmin, isSuperadmin } from "../middlewares/auth.middleware";

const router = Router();

// ✅ All routes require authentication
router.use(authenticate);

// ✅ Dashboard data routes - Allow both ADMIN and SUPERADMIN
router.get("/", isAdmin, getAdmins); // For dashboard user count
router.get("/logs/audit", isAdmin, getAuditLogs); // For dashboard audit logs
router.get("/logs/login", isAdmin, getLoginLogs); // For dashboard login logs

// ✅ User management routes - SUPERADMIN only
router.post("/", isSuperadmin, createAdminUser); // Create admin
router.patch("/:id", isSuperadmin, updateAdminUser); // Update admin
router.delete("/:id", isSuperadmin, deleteAdminUser); // Delete admin
router.patch("/:id/password", isSuperadmin, authLimiter, resetAdminPassword); // Reset password
router.get("/:id", isSuperadmin, getSingleAdmin); // Get single admin details

export default router;
