-- AlterTable
ALTER TABLE "LogisticMessage" ADD COLUMN     "countryFrom" TEXT,
ADD COLUMN     "countryTo" TEXT,
ADD COLUMN     "regionFrom" TEXT,
ADD COLUMN     "regionTo" TEXT,
ADD COLUMN     "weightMax" DOUBLE PRECISION,
ADD COLUMN     "weightMin" DOUBLE PRECISION;
