/*
  Warnings:

  - You are about to drop the column `player1Score` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `player2Score` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `user1Id` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `user2Id` on the `Match` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_user1Id_fkey";

-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_user2Id_fkey";

-- AlterTable
ALTER TABLE "Match" DROP COLUMN "player1Score",
DROP COLUMN "player2Score",
DROP COLUMN "user1Id",
DROP COLUMN "user2Id",
ADD COLUMN     "playerlosScore" INTEGER,
ADD COLUMN     "playerwinScore" INTEGER,
ADD COLUMN     "userlosId" TEXT,
ADD COLUMN     "userwinId" TEXT;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_userwinId_fkey" FOREIGN KEY ("userwinId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_userlosId_fkey" FOREIGN KEY ("userlosId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
