// /backend/src/server.ts

import app from './app';
import prisma from './prisma/client';

const PORT = process.env.PORT || 8080;

async function startServer() {
    try {
        await prisma.$connect();
        console.log('✅ Connected to Neon PostgreSQL database');

        app.listen(PORT, () => {
            console.log(`🚀 Server is running at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ Failed to connect to the database:', error);
        process.exit(1); // exit the app if DB connection fails
    }
}

startServer();
