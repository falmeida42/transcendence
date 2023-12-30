/*
  Warnings:

  - Made the column `playerlosScore` on table `Match` required. This step will fail if there are existing NULL values in that column.
  - Made the column `playerwinScore` on table `Match` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Match" ALTER COLUMN "playerlosScore" SET NOT NULL,
ALTER COLUMN "playerwinScore" SET NOT NULL;
