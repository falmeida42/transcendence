/*
  Warnings:

  - You are about to drop the column `mutedAt` on the `MutedIn` table. All the data in the column will be lost.
  - Added the required column `muteExpiration` to the `MutedIn` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MutedIn" DROP COLUMN "mutedAt",
ADD COLUMN     "muteExpiration" TIMESTAMP(3) NOT NULL;
