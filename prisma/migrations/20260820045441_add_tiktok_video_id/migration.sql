/*
  Warnings:

  - A unique constraint covering the columns `[tiktokVideoId]` on the table `Performance` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tiktokVideoId]` on the table `Posting` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Performance" ADD COLUMN     "tiktokVideoId" TEXT;

-- AlterTable
ALTER TABLE "Posting" ADD COLUMN     "tiktokVideoId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Performance_tiktokVideoId_key" ON "Performance"("tiktokVideoId");

-- CreateIndex
CREATE UNIQUE INDEX "Posting_tiktokVideoId_key" ON "Posting"("tiktokVideoId");
