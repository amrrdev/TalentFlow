-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('open', 'in_progress', 'completed');

-- CreateTable
CREATE TABLE "Projects" (
    "id" SERIAL NOT NULL,
    "titel" VARCHAR(250) NOT NULL,
    "description" TEXT NOT NULL,
    "budget" DECIMAL(10,2) NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "status" "ProjectStatus" NOT NULL DEFAULT 'open',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "clientId" INTEGER NOT NULL,

    CONSTRAINT "Projects_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Projects" ADD CONSTRAINT "Projects_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
