// src/app.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { Request, Response, NextFunction } from 'express';

import auth from "./routes/auth.route";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/api/health', (_req, res) => {
    res.json({ status: 'OK', message: 'Backend is up and running' });
});

// admin auth route
app.use("/api/auth", auth);

// Global Error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error("Error stack:", err.stack);

    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal server error";

    res.status(statusCode).json({ success: false, message });
})

// TODO: Mount routes here
// app.use('/api/products', productRoutes);

export default app;
