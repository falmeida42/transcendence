-- AlterTable
ALTER TABLE "User" ADD COLUMN     "twoFactorAuthEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "twoFactorAuthSecret" TEXT;
