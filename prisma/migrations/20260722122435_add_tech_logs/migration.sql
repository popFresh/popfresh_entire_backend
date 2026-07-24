-- CreateEnum
CREATE TYPE "LogLevel" AS ENUM ('INFO', 'WARN', 'ERROR', 'CRITICAL');

-- CreateEnum
CREATE TYPE "LogCategory" AS ENUM ('SYSTEM', 'DATABASE', 'PAYMENT', 'ORDER', 'EMAIL', 'SHIPROCKET', 'WHATSAPP', 'CONTACT', 'AUTH');

-- CreateTable
CREATE TABLE "TechLog" (
    "id" TEXT NOT NULL,
    "level" "LogLevel" NOT NULL,
    "category" "LogCategory" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TechLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TechLog_level_idx" ON "TechLog"("level");

-- CreateIndex
CREATE INDEX "TechLog_category_idx" ON "TechLog"("category");

-- CreateIndex
CREATE INDEX "TechLog_createdAt_idx" ON "TechLog"("createdAt" DESC);
