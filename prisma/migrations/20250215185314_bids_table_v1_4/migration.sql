/*
  Warnings:

  - A unique constraint covering the columns `[freelancerId,projectId]` on the table `Bids` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Bids_freelancerId_projectId_key" ON "Bids"("freelancerId", "projectId");
