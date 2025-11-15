-- SmileFactory Database Schema
-- Initial migration for authentication and profiles

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. USER ACCOUNTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for user_accounts
CREATE INDEX IF NOT EXISTS idx_user_accounts_email ON user_accounts(email);

-- ============================================================================
-- 2. PROFILE TYPES ENUM
-- ============================================================================
DO $$ BEGIN
  CREATE TYPE profile_type AS ENUM (
    'innovator',
    'mentor',
    'investor',
    'academic_student',
    'academic_institution',
    'organization',
    'professional'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ============================================================================
-- 3. PROFILES TABLE (One-to-Many with User Accounts)
-- ============================================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_account_id UUID REFERENCES user_accounts(id) ON DELETE CASCADE,
  profile_type profile_type NOT NULL,
  display_name VARCHAR(255) NOT NULL,
  username VARCHAR(100) UNIQUE,
  bio TEXT,
  avatar_url TEXT,
  cover_image_url TEXT,
  location VARCHAR(255),
  website VARCHAR(255),
  phone VARCHAR(50),
  is_primary BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT FALSE,
  completion_percentage INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for profiles
CREATE INDEX IF NOT EXISTS idx_profiles_user_account_id ON profiles(user_account_id);
CREATE INDEX IF NOT EXISTS idx_profiles_profile_type ON profiles(profile_type);
CREATE INDEX IF NOT EXISTS idx_profiles_is_primary ON profiles(is_primary);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);

-- Ensure only one primary profile per user
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_primary_profile 
  ON profiles(user_account_id, is_primary) 
  WHERE is_primary = TRUE;

-- ============================================================================
-- 4. OTP CODES TABLE (Temporary Storage)
-- ============================================================================
CREATE TABLE IF NOT EXISTS otp_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL,
  code VARCHAR(6) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_used BOOLEAN DEFAULT FALSE,
  attempts INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for otp_codes
CREATE INDEX IF NOT EXISTS idx_otp_codes_email ON otp_codes(email);
CREATE INDEX IF NOT EXISTS idx_otp_codes_expires_at ON otp_codes(expires_at);

-- ============================================================================
-- 5. PROFILE METADATA TABLE (For storing profile question answers)
-- ============================================================================
CREATE TABLE IF NOT EXISTS profile_metadata (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  metadata_key VARCHAR(255) NOT NULL,
  metadata_value TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for profile_metadata
CREATE INDEX IF NOT EXISTS idx_profile_metadata_profile_id ON profile_metadata(profile_id);
CREATE INDEX IF NOT EXISTS idx_profile_metadata_key ON profile_metadata(metadata_key);

-- Ensure unique keys per profile
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_profile_metadata 
  ON profile_metadata(profile_id, metadata_key);

-- ============================================================================
-- 6. TRIGGERS FOR UPDATED_AT
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for user_accounts
DROP TRIGGER IF EXISTS update_user_accounts_updated_at ON user_accounts;
CREATE TRIGGER update_user_accounts_updated_at
  BEFORE UPDATE ON user_accounts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for profiles
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for profile_metadata
DROP TRIGGER IF EXISTS update_profile_metadata_updated_at ON profile_metadata;
CREATE TRIGGER update_profile_metadata_updated_at
  BEFORE UPDATE ON profile_metadata
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on tables
ALTER TABLE user_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_metadata ENABLE ROW LEVEL SECURITY;

-- User accounts policies
CREATE POLICY "Users can view their own account"
  ON user_accounts FOR SELECT
  USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update their own account"
  ON user_accounts FOR UPDATE
  USING (auth.uid()::text = id::text);

-- Profiles policies
CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their own profiles"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid()::text = user_account_id::text);

CREATE POLICY "Users can update their own profiles"
  ON profiles FOR UPDATE
  USING (auth.uid()::text = user_account_id::text);

CREATE POLICY "Users can delete their own profiles"
  ON profiles FOR DELETE
  USING (auth.uid()::text = user_account_id::text);

-- Profile metadata policies
CREATE POLICY "Users can view metadata for their profiles"
  ON profile_metadata FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = profile_metadata.profile_id
      AND profiles.user_account_id::text = auth.uid()::text
    )
  );

CREATE POLICY "Users can insert metadata for their profiles"
  ON profile_metadata FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = profile_metadata.profile_id
      AND profiles.user_account_id::text = auth.uid()::text
    )
  );

CREATE POLICY "Users can update metadata for their profiles"
  ON profile_metadata FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = profile_metadata.profile_id
      AND profiles.user_account_id::text = auth.uid()::text
    )
  );

CREATE POLICY "Users can delete metadata for their profiles"
  ON profile_metadata FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = profile_metadata.profile_id
      AND profiles.user_account_id::text = auth.uid()::text
    )
  );

-- ============================================================================
-- 8. SAMPLE DATA (Optional - for development)
-- ============================================================================

-- Uncomment below to insert sample data for testing
/*
INSERT INTO user_accounts (email, email_verified) VALUES
  ('test@example.com', true),
  ('demo@smilefactory.com', true);

INSERT INTO profiles (user_account_id, profile_type, display_name, bio, is_primary, completion_percentage) VALUES
  ((SELECT id FROM user_accounts WHERE email = 'test@example.com'), 'innovator', 'Test User', 'Innovation enthusiast', true, 60),
  ((SELECT id FROM user_accounts WHERE email = 'demo@smilefactory.com'), 'mentor', 'Demo Mentor', 'Experienced mentor', true, 80);
*/

