import { Request, Response } from "express";
import {
    CreateAdminSchema,
    UpdateAdminSchema,
    ResetPasswordSchema,
} from "../validations/adminUser.schema";
import {
    getAllAdmins,
    createAdmin,
    getAdminById,
    updateAdmin,
    deleteAdmin,
    countSuperadmins,
} from "../services/adminUser.service";
import { hashPassword } from "../services/auth.service";
import { logAudit } from "../services/auditLog.service";

// ✅ GET /admin/users
export const getAdmins = async (_req: Request, res: Response) => {
    const users = await getAllAdmins();
    res.json(users);
};

// ✅ POST /admin/users
export const createAdminUser = async (req: Request, res: Response) => {
    const body = CreateAdminSchema.safeParse(req.body);

    if (!body.success) return res.status(400).json({ message: body.error.errors });
    
    if (body.data.role === 'SUPERADMIN')
        return res.status(403).json({ message: "Only one super_admin is allowed." });

    try {
        const user = await createAdmin(body.data);
        const currentUser = (req as any).user;
        await logAudit({
            actorId: currentUser?.id,
            targetId: user.id,
            action: "CREATE_ADMIN",
            message: `Created admin: ${user.email}`,
            ip: req.ip,
            userAgent: req.headers["user-agent"]
        });

        res.status(201).json({
            message: "Admin user created successfully",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                isActive: user.isActive,
            },
        });
    } catch (err: any) {
        if (err.code === "P2002") {
            return res.status(409).json({ message: "Email already exists" });
        }
        res.status(500).json({ message: "Failed to create admin", error: err });
    }
};

// ✅ PATCH /admin/users/:id
export const updateAdminUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const body = UpdateAdminSchema.safeParse(req.body);
    if (!body.success) return res.status(400).json({ error: body.error.errors });

    const user = await getAdminById(id);
    if (!user) return res.status(404).json({ message: "Admin not found" });

    const currentUser = (req as any).user;

    // Prevent self-demotion
    if (user.id === currentUser.id && body.data.role && body.data.role !== "SUPERADMIN") {
        return res.status(403).json({ message: "You cannot demote yourself" });
    }

    // Prevent last superadmin demotion/deactivation
    const superCount = await countSuperadmins();
    const isDemotingLastSuperadmin =
        user.role === "SUPERADMIN" &&
        superCount === 1 &&
        (body.data.role !== "SUPERADMIN" || body.data.isActive === false);

    if (isDemotingLastSuperadmin) {
        return res
            .status(403)
            .json({ message: "Cannot demote or deactivate the last SUPERADMIN" });
    }

    await updateAdmin(id, body.data);

    await logAudit({
        actorId: currentUser?.id,
        targetId: user.id,
        action: "UPDATE_ADMIN",
        message: `Updated admin: ${user.email}`,
        ip: req.ip,
        userAgent: req.headers["user-agent"]
    });

    res.json({ message: "Admin user updated", updated: true });
};

// ✅ DELETE /admin/users/:id
export const deleteAdminUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await getAdminById(id);
    if (!user) return res.status(404).json({ message: "Admin not found" });

    const currentUser = (req as any).user;

    if (user.id === currentUser.id) {
        return res.status(403).json({ message: "You cannot delete yourself" });
    }

    const superCount = await countSuperadmins();
    if (user.role === "SUPERADMIN" && superCount === 1) {
        return res
            .status(403)
            .json({ message: "Cannot delete the last SUPERADMIN" });
    }

    await deleteAdmin(id);

    await logAudit({
        actorId: currentUser?.id,
        targetId: user.id,
        action: "DELETE_ADMIN",
        message: `Deleted admin: ${user.email}`,
        ip: req.ip,
        userAgent: req.headers["user-agent"]
    });

    res.json({ message: "Admin user deleted" });
};

// ✅ PATCH /admin/users/:id/password
export const resetAdminPassword = async (req: Request, res: Response) => {
    const { id } = req.params;
    const body = ResetPasswordSchema.safeParse(req.body);
    if (!body.success) return res.status(400).json({ error: body.error.errors });

    const user = await getAdminById(id);
    if (!user) return res.status(404).json({ message: "Admin not found" });

    const hashed = await hashPassword(body.data.newPassword);
    await updateAdmin(id, { password: hashed });

    const currentUser = (req as any).user;

    await logAudit({
        actorId: currentUser?.id,
        targetId: user.id,
        action: "RESET_PASSWORD",
        message: `Reset password for: ${user.email}`,
        ip: req.ip,
        userAgent: req.headers["user-agent"]
    });

    res.json({ message: "Password reset successful" });
};

// ✅ GET /admin/users/:id
export const getSingleAdmin = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const user = await getAdminById(id);
        if (!user) {
            return res.status(404).json({ message: "Admin not found" });
        }

        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
            createdAt: user.createdAt,
        });
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch admin", error: err });
    }
};
