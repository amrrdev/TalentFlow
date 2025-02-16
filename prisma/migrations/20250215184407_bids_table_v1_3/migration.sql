/*
  Warnings:

  - Added the required column `cv` to the `Bids` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Bids" ADD COLUMN     "cv" TEXT NOT NULL;
