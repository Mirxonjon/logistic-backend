/*
  Warnings:

  - You are about to drop the column `weightMax` on the `LogisticMessage` table. All the data in the column will be lost.
  - You are about to drop the column `weightMin` on the `LogisticMessage` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "LogisticMessage" DROP COLUMN "weightMax",
DROP COLUMN "weightMin",
ADD COLUMN     "isComplete" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "sentToTelegramAt" TIMESTAMP(3);
