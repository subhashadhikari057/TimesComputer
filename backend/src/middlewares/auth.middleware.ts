import type { Request, Response, NextFunction } from "express";
import jwt, { type Secret } from "jsonwebtoken";
import rateLimit from "express-rate-limit";

const ACCESS_SECRET: Secret = process.env.ACCESS_SECRET as string;

// ✅ Middleware: Authenticated user & attach user to req
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.access_token;
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, ACCESS_SECRET) as { email: string; role: string };
        (req as any).user = { email: decoded.email, role: decoded.role };
        next();
    } catch (err) {
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};

// ✅ Middleware: Only ADMIN or SUPERADMIN
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    const role = (req as any).user?.role;
    if (role === "ADMIN" || role === "SUPERADMIN") return next();
    return res.status(403).json({ message: "Admin access only" });
};

// ✅ Middleware: Only SUPERADMIN
export const isSuperadmin = (req: Request, res: Response, next: NextFunction) => {
    const role = (req as any).user?.role;
    if (role === "SUPERADMIN") return next();
    return res.status(403).json({ message: "Superadmin access only" });
};


// ✅ General limiter — max 5 requests per 15 minutes per IP
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: {
        message: "Too many attempts, please try again after 15 minutes.",
    },
    standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
    legacyHeaders: false,  // Disable `X-RateLimit-*` headers
});
