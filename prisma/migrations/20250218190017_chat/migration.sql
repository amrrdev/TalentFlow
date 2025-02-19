/*
  Warnings:

  - A unique constraint covering the columns `[clientId,freelancerId]` on the table `Chat` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Chat_clientId_freelancerId_key" ON "Chat"("clientId", "freelancerId");
