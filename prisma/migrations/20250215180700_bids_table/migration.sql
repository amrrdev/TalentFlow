-- CreateTable
CREATE TABLE "Bids" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "freelancerId" INTEGER NOT NULL,

    CONSTRAINT "Bids_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Bids" ADD CONSTRAINT "Bids_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bids" ADD CONSTRAINT "Bids_freelancerId_fkey" FOREIGN KEY ("freelancerId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
