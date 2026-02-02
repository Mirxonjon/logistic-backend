-- Update enum UserRole: rename USER to DISPATCHER and set default
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'UserRole') THEN
    -- Rename enum value USER -> DISPATCHER if old value exists
    BEGIN
      ALTER TYPE "UserRole" RENAME VALUE 'USER' TO 'DISPATCHER';
    EXCEPTION WHEN others THEN
      -- In case value already renamed or not present, ignore
      NULL;
    END;
  END IF;
END $$;

-- Ensure default is DISPATCHER on User.role
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'DISPATCHER';
