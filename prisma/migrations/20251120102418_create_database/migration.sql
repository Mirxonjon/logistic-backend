-- CreateTable
CREATE TABLE "News" (
    "id" SERIAL NOT NULL,
    "source" TEXT NOT NULL,
    "tickers" TEXT[],
    "title" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "uniqueKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "News_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "News_uniqueKey_key" ON "News"("uniqueKey");
