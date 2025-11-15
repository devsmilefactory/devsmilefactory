-- Migration: Add first_login tracking and draft data support
-- Date: 2025-11-02
-- Description: Add first_login flag to user_accounts and draft_data to profiles for partial completion

-- Add first_login column to user_accounts
ALTER TABLE user_accounts
ADD COLUMN first_login BOOLEAN DEFAULT TRUE;

-- Add draft_data column to profiles for storing partial form data
ALTER TABLE profiles
ADD COLUMN draft_data JSONB DEFAULT '{}'::jsonb;

-- Add index on first_login for faster queries
CREATE INDEX idx_user_accounts_first_login ON user_accounts(first_login) WHERE first_login = TRUE;

-- Add index on draft_data for faster queries
CREATE INDEX idx_profiles_draft_data ON profiles USING GIN (draft_data);

-- Update existing users to have first_login = FALSE (they've already logged in)
UPDATE user_accounts SET first_login = FALSE;

-- Comment on columns
COMMENT ON COLUMN user_accounts.first_login IS 'Flag to track if user needs to complete profile wizard on first login';
COMMENT ON COLUMN profiles.draft_data IS 'JSONB storage for partial profile form data during wizard completion';

