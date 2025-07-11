// src/app.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

// import csrf from 'csurf'; // ✅ NEW: CSRF middleware

import authRoutes from './routes/auth.route';
import adminUserRoutes from "./routes/adminUser.route";
import categoryRoutes from "./routes/category.route";
import brandRoutes from "./routes/brand.route";
import featureTagRoutes from "./routes/featureTag.route";
import marketingTagRoutes from "./routes/marketingTags.route";


dotenv.config();

const app = express();

// ✅ Security Middlewares
app.use(helmet());
app.use(cookieParser());

// ✅ Core Middlewares
app.use(
    cors({
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        credentials: true,
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// // ✅ CSRF Protection (must come AFTER cookie + json parser)
// app.use(csrf({ cookie: true }));

// ✅ CSRF Token route — Frontend fetches this first
app.get('/api/csrf-token', (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use("/admin/users", adminUserRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/brand", brandRoutes);
app.use("/api/feature-tag", featureTagRoutes);
app.use("/api/marketing-tag", marketingTagRoutes);


// ✅ Health check
app.get('/api/health', (_req, res) => {
    res.json({ status: 'OK', message: 'Backend is up and running' });
});

export default app;
