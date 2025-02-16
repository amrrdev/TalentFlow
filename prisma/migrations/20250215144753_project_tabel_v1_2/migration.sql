/*
  Warnings:

  - You are about to drop the column `titel` on the `Projects` table. All the data in the column will be lost.
  - Added the required column `title` to the `Projects` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Projects" DROP COLUMN "titel",
ADD COLUMN     "title" VARCHAR(250) NOT NULL;
