-- AlterTable
ALTER TABLE "LogisticMessage" ADD COLUMN     "advancePayment" DOUBLE PRECISION,
ADD COLUMN     "cargoUnit" TEXT,
ADD COLUMN     "paymentAmount" DOUBLE PRECISION,
ADD COLUMN     "paymentCurrency" TEXT,
ADD COLUMN     "paymentType" TEXT,
ADD COLUMN     "phoneNumber" TEXT,
ADD COLUMN     "pickupDate" TIMESTAMP(3),
ADD COLUMN     "title" TEXT,
ADD COLUMN     "vehicleType" TEXT,
ADD COLUMN     "weight" DOUBLE PRECISION;
