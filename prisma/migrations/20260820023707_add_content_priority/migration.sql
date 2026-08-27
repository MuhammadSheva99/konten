-- CreateEnum
CREATE TYPE "ContentPriority" AS ENUM ('URGENT', 'TINGGI', 'NORMAL', 'RENDAH');

-- AlterTable
ALTER TABLE "ContentPlan" ADD COLUMN     "priority" "ContentPriority" NOT NULL DEFAULT 'NORMAL';
