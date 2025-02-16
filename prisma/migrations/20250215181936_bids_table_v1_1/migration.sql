/*
  Warnings:

  - Added the required column `amount` to the `Bids` table without a default value. This is not possible if the table is not empty.
  - Added the required column `coverLetter` to the `Bids` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Bids` table without a default value. This is not possible if the table is not empty.
  - Added the required column `estimatedWork` to the `Bids` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Bids` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BidStatus" AS ENUM ('pending', 'accepted', 'rejected');

-- AlterTable
ALTER TABLE "Bids" ADD COLUMN     "amount" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "coverLetter" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "estimatedWork" VARCHAR(100) NOT NULL,
ADD COLUMN     "status" "BidStatus" NOT NULL DEFAULT 'pending',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
