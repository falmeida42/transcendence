-- CreateTable
CREATE TABLE "Match" (
    "id" TEXT NOT NULL,
    "playerwinScore" INTEGER NOT NULL,
    "playerlosScore" INTEGER NOT NULL,
    "userwinId" TEXT,
    "userlosId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_userwinId_fkey" FOREIGN KEY ("userwinId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_userlosId_fkey" FOREIGN KEY ("userlosId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
