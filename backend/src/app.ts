// src/app.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import path from "path";
import morgan from "morgan";

// import csrf from 'csurf'; // ✅ NEW: CSRF middleware

import authRoutes from './routes/auth.route';
import adminUserRoutes from "./routes/adminUser.route";
import adsRoutes from "./routes/ads.route";
import blogRoutes from "./routes/blog.route";
import brandRoutes from "./routes/brand.route";
import colorRoutes from "./routes/color.route";
import productRoutes from "./routes/product.route";
import inquiryRoutes from "./routes/inquiry.route";
import categoryRoutes from "./routes/category.route";
import featureTagRoutes from "./routes/featureTag.route";
import marketingTagRoutes from "./routes/marketingTags.route";

import searchRoutes from "./routes/search.route";
import initController from './routes/init.route'

dotenv.config();

const app = express();
const uploadPath = path.join(__dirname, "uploads");

// ✅ Security Middlewares
app.use(helmet());
app.use(cookieParser());

// ✅ Core Middlewares
const allowedOrigins = [
    'http://192.168.68.122:3000',
    'http://localhost:3000',
]
app.use(
    cors({
        origin: allowedOrigins,
        credentials: true,
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(uploadPath));
app.use(morgan("dev"));

// // ✅ CSRF Protection (must come AFTER cookie + json parser)
// app.use(csrf({ cookie: true }));

// ✅ CSRF Token route — Frontend fetches this first
app.get('/api/csrf-token', (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});

// ✅ Routes
app.use('/api/init', initController);
app.use('/api/auth', authRoutes);
app.use("/api/admin/users", adminUserRoutes);
app.use("/api/product", productRoutes);
app.use("/api/ads", adsRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/brand", brandRoutes);
app.use("/api/colors", colorRoutes);
app.use("/api/inquiry", inquiryRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/feature-tag", featureTagRoutes);
app.use("/api/marketing-tag", marketingTagRoutes);
app.use("/api/search", searchRoutes);

// ✅ Health check
app.get('/api/health', (_req, res) => {
    res.json({ status: 'OK', message: 'Backend is up and running' });
});

export default app;
