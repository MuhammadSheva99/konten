-- CreateEnum
CREATE TYPE "AkunCategory" AS ENUM ('OFFICIAL', 'OUTLET');

-- AlterTable
ALTER TABLE "Akun" ADD COLUMN     "category" "AkunCategory" NOT NULL DEFAULT 'OFFICIAL';
