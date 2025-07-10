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
