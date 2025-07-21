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
import { authenticate, authLimiter, isSuperadmin } from "../middlewares/auth.middleware";

const router = Router();

// ✅ Protect all admin routes: SUPERADMIN only
router.use(authenticate, isSuperadmin);

// GET all admins
router.get("/", getAdmins);

// Create admin
router.post("/", createAdminUser);

// Update admin
router.patch("/:id", updateAdminUser);

// Delete admin
router.delete("/:id", deleteAdminUser);

// Reset admin password
router.patch("/:id/password", authLimiter, resetAdminPassword);

// Get single admin
router.get("/:id", getSingleAdmin);

// Get audit logs
router.get("/logs/audit", getAuditLogs);

// Get login logs
router.get("/logs/login", getLoginLogs);

export default router;
