-- AlterTable
ALTER TABLE "Akun" ADD COLUMN     "tiktokAccessToken" TEXT,
ADD COLUMN     "tiktokOpenId" TEXT,
ADD COLUMN     "tiktokRefreshToken" TEXT,
ADD COLUMN     "tiktokTokenExpiresAt" TIMESTAMP(3);
