/*
  Warnings:

  - Added the required column `experience` to the `Bids` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Bids" ADD COLUMN     "aiAsuggestions" TEXT,
ADD COLUMN     "experience" TEXT NOT NULL;
