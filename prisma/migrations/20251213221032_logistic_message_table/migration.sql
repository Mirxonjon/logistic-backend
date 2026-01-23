/*
  Warnings:

  - You are about to drop the `News` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "News";

-- CreateTable
CREATE TABLE "LogisticMessage" (
    "id" SERIAL NOT NULL,
    "tgMessageId" INTEGER NOT NULL,
    "channelName" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "date" TIMESTAMP(3),
    "views" INTEGER,
    "aiStatus" TEXT NOT NULL,
    "structured" JSONB,
    "isActual" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LogisticMessage_pkey" PRIMARY KEY ("id")
);
