// src/app.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import path from 'path';


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
import credentials from './middlewares/credentials';

dotenv.config();

const app = express();
const uploadPath = path.join(__dirname, "uploads");

const origin = process.env.ORIGIN;
if (!origin) {
  throw new Error('ORIGIN environment variable is not set');
}

// ✅ Security Middlewares
app.use(helmet());
app.use(cookieParser());

app.use(credentials);
app.use(
    cors({
        origin: origin,
        credentials: true,
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', (req, res, next) => {
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
}, express.static(path.join(__dirname, '..', 'uploads')));


// ✅ Routes

app.use((req, res, next) => {
    next();
});
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
