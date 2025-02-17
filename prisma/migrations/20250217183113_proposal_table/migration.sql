-- CreateTable
CREATE TABLE "Proposals" (
    "id" SERIAL NOT NULL,
    "freelancerId" INTEGER NOT NULL,
    "projectId" INTEGER NOT NULL,
    "bidId" INTEGER NOT NULL,

    CONSTRAINT "Proposals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Proposals_bidId_key" ON "Proposals"("bidId");

-- AddForeignKey
ALTER TABLE "Proposals" ADD CONSTRAINT "Proposals_freelancerId_fkey" FOREIGN KEY ("freelancerId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proposals" ADD CONSTRAINT "Proposals_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proposals" ADD CONSTRAINT "Proposals_bidId_fkey" FOREIGN KEY ("bidId") REFERENCES "Bids"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
