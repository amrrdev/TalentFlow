/*
  Warnings:

  - Added the required column `proposalUrl` to the `Proposals` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Proposals` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ProposalStatus" AS ENUM ('pending', 'accepted', 'rejected');

-- AlterTable
ALTER TABLE "Proposals" ADD COLUMN     "additionalDerails" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "proposalUrl" TEXT NOT NULL,
ADD COLUMN     "status" "ProposalStatus" NOT NULL DEFAULT 'pending',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
