-- CreateEnum
CREATE TYPE "KpiScopeType" AS ENUM ('PIC', 'BRAND', 'AKUN');

-- CreateEnum
CREATE TYPE "KpiComputeType" AS ENUM ('AUTO_POSTING_COUNT', 'AUTO_TOTAL_VIEWS', 'AUTO_ENGAGEMENT_RATE', 'AUTO_HEALTHY_ACCOUNTS', 'AUTO_FOLLOWER_GROWTH_ABS', 'AUTO_FOLLOWER_GROWTH_PCT', 'MANUAL');

-- AlterEnum
ALTER TYPE "AkunCategory" ADD VALUE 'DRACIN';

-- CreateTable
CREATE TABLE "AkunFollowerSnapshot" (
    "id" TEXT NOT NULL,
    "akunId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "followerCount" INTEGER NOT NULL,

    CONSTRAINT "AkunFollowerSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KpiTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "AkunCategory" NOT NULL,

    CONSTRAINT "KpiTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KpiTemplateItem" (
    "id" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "metricDescription" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "targetLabel" TEXT NOT NULL,
    "targetNumeric" DOUBLE PRECISION,
    "computeType" "KpiComputeType" NOT NULL,

    CONSTRAINT "KpiTemplateItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KpiManualInput" (
    "id" TEXT NOT NULL,
    "templateItemId" TEXT NOT NULL,
    "scopeType" "KpiScopeType" NOT NULL,
    "scopeId" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KpiManualInput_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AkunFollowerSnapshot_akunId_date_key" ON "AkunFollowerSnapshot"("akunId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "KpiManualInput_templateItemId_scopeType_scopeId_period_key" ON "KpiManualInput"("templateItemId", "scopeType", "scopeId", "period");

-- AddForeignKey
ALTER TABLE "AkunFollowerSnapshot" ADD CONSTRAINT "AkunFollowerSnapshot_akunId_fkey" FOREIGN KEY ("akunId") REFERENCES "Akun"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KpiTemplateItem" ADD CONSTRAINT "KpiTemplateItem_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "KpiTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KpiManualInput" ADD CONSTRAINT "KpiManualInput_templateItemId_fkey" FOREIGN KEY ("templateItemId") REFERENCES "KpiTemplateItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
