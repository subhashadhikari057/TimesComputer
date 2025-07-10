// src/app.ts
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import helmet from 'helmet';
// import csrf from 'csurf'; // ✅ NEW: CSRF middleware

import authRoutes from './routes/auth.route';
import adminUserRoutes from "./routes/adminUser.route";

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


// ✅ Health check
app.get('/api/health', (_req, res) => {
    res.json({ status: 'OK', message: 'Backend is up and running' });
});

export default app;
