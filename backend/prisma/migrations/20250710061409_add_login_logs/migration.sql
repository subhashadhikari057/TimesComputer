-- CreateTable
CREATE TABLE "LoginLog" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "success" BOOLEAN NOT NULL,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LoginLog_pkey" PRIMARY KEY ("id")
);
