-- Track where each LogisticMessage originated: external Telegram scraper, or
-- a logged-in dispatcher posting directly via /v1/post/send-to-telegram.

CREATE TYPE "PostSource" AS ENUM ('SCRAPING', 'DISPATCHER');

ALTER TABLE "LogisticMessage"
  ADD COLUMN "source"      "PostSource" NOT NULL DEFAULT 'SCRAPING',
  ADD COLUMN "createdById" INTEGER;

ALTER TABLE "LogisticMessage"
  ADD CONSTRAINT "LogisticMessage_createdById_fkey"
  FOREIGN KEY ("createdById") REFERENCES "User"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX "LogisticMessage_source_idx"      ON "LogisticMessage"("source");
CREATE INDEX "LogisticMessage_createdById_idx" ON "LogisticMessage"("createdById");
