import { Router } from "express";
import {
    getAdmins,
    createAdminUser,
    updateAdminUser,
    deleteAdminUser,
    resetAdminPassword,
} from "../controllers/adminUser.controller";
import { authenticate, isSuperadmin } from "../middlewares/auth.middleware";

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
router.patch("/:id/password", resetAdminPassword);

export default router;
