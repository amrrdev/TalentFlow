-- AlterEnum
ALTER TYPE "ProjectStatus" ADD VALUE 'closed';

-- AlterTable
ALTER TABLE "Projects" ADD COLUMN     "deletedAt" TIMESTAMP(3);
