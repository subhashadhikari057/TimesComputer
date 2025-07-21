import prisma from "../prisma/client";
import { hashPassword } from "./auth.service";
import { Role } from "@prisma/client";

// Helper function to parse user agent and extract device info
const parseUserAgent = (userAgent: string | null) => {
    if (!userAgent) return { device: "Unknown", browser: "Unknown", os: "Unknown" };
    
    const ua = userAgent.toLowerCase();
    
    // Detect device type
    let device = "Desktop";
    if (ua.includes("mobile") || ua.includes("android") || ua.includes("iphone")) {
        device = "Mobile";
    } else if (ua.includes("tablet") || ua.includes("ipad")) {
        device = "Tablet";
    }
    
    // Detect browser
    let browser = "Unknown";
    if (ua.includes("chrome") && !ua.includes("edge")) {
        browser = "Chrome";
    } else if (ua.includes("firefox")) {
        browser = "Firefox";
    } else if (ua.includes("safari") && !ua.includes("chrome")) {
        browser = "Safari";
    } else if (ua.includes("edge")) {
        browser = "Edge";
    }
    
    // Detect OS
    let os = "Unknown";
    if (ua.includes("windows")) {
        os = "Windows";
    } else if (ua.includes("mac") && !ua.includes("iphone") && !ua.includes("ipad")) {
        os = "macOS";
    } else if (ua.includes("linux")) {
        os = "Linux";
    } else if (ua.includes("android")) {
        os = "Android";
    } else if (ua.includes("iphone") || ua.includes("ipad")) {
        os = "iOS";
    }
    
    return { device, browser, os };
};

// Helper function to format IP address
const formatIpAddress = (ip: string) => {
    if (ip === "::1" || ip === "127.0.0.1" || ip === "localhost") {
        return "localhost";
    }
    return ip;
};

// ✅ Get all admin users
export const getAllAdmins = async () => {
    return prisma.adminUser.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            isActive: true,
            createdAt: true,
        },
        orderBy: { createdAt: "desc" },
    });
};

// ✅ Create admin user
export const createAdmin = async ({
    name,
    email,
    password,
}: {
    name: string;
    email: string;
    password: string;
}) => {
    const hashed = await hashPassword(password);

    return prisma.adminUser.create({
        data: {
            name,
            email,
            password: hashed
        },
    });
};

// ✅ Get user by ID
export const getAdminById = async (id: string) => {
    return prisma.adminUser.findUnique({ where: { id } });
};

// ✅ Update admin user
export const updateAdmin = async (
    id: string,
    data: Partial<{ name: string; role: Role; isActive: boolean; password: string }>
) => {
    return prisma.adminUser.update({
        where: { id },
        data,
    });
};

// ✅ Delete admin user
export const deleteAdmin = async (id: string) => {
    return prisma.adminUser.delete({ where: { id } });
};

// ✅ Count how many SUPERADMINs exist
export const countSuperadmins = async () => {
    return prisma.adminUser.count({ where: { role: "SUPERADMIN", isActive: true } });
};

// ✅ Get recent login logs with device information
export const getRecentLoginLogs = async (limit: number = 10) => {
    const logs = await prisma.loginLog.findMany({
        take: limit,
        orderBy: { createdAt: "desc" },
    });

    // Parse user agent and format IP for each log
    return logs.map(log => {
        const deviceInfo = parseUserAgent(log.userAgent);
        const formattedIp = formatIpAddress(log.ip);
        
        return {
            ...log,
            deviceInfo,
            formattedIp,
            deviceName: `${deviceInfo.os} - ${deviceInfo.browser}`
        };
    });
};
