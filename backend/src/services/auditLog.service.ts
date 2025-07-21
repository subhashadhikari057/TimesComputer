import prisma from "../prisma/client";

export const logAudit = async ({
    actorId,
    targetId,
    action,
    message,
    ip,
    userAgent
}: {
    actorId: string;
    targetId?: string;
    action: string;
    message?: string;
    ip?: string;
    userAgent?: string;
}) => {
    return prisma.auditLog.create({
        data: {
            actorId,
            targetId,
            action,
            message,
            ip,
            userAgent,
        },
    });
};

// Get recent audit logs with actor information
export const getRecentAuditLogs = async (limit: number = 10) => {
    return prisma.auditLog.findMany({
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
            actor: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                }
            }
        }
    });
};
