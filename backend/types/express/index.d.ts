import { Role } from "@prisma/client";
import "express"

declare module "express" {
    export interface Request {
        user?: {
            id: number;
            name: string;
            role: Role;
        };
        message?: string;
    }
}