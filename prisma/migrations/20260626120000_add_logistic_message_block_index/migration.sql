-- Add blockIndex to LogisticMessage for multi-load message support.
-- A single long Telegram message may be split into N separate load rows;
-- each row carries the parent's tgMessageId + channelName + text but has a
-- distinct blockIndex (0, 1, 2, ...). Existing rows default to 0.
--
-- `IF NOT EXISTS` keeps this idempotent in case a previous failed run already
-- added the column.
ALTER TABLE "LogisticMessage"
  ADD COLUMN IF NOT EXISTS "blockIndex" INTEGER NOT NULL DEFAULT 0;

-- The dedup query (`findFirst({ tgMessageId, channelName })`) only filters
-- on these two columns; this composite index keeps that lookup fast on the
-- multi-load ingest path. No unique constraint here — application-level
-- dedup in PostsService.create is the source of truth.
CREATE INDEX IF NOT EXISTS "LogisticMessage_tgMessageId_channelName_idx"
  ON "LogisticMessage" ("tgMessageId", "channelName");
