# Database Setup Guide

This directory contains database migrations and setup scripts for the SmileFactory platform.

## Prerequisites

- Supabase account (https://supabase.com)
- Supabase project created
- Supabase CLI installed (optional, for local development)

## Setup Instructions

### Option 1: Using Supabase Dashboard (Recommended)

1. **Log in to your Supabase Dashboard**
   - Go to https://app.supabase.com
   - Select your project

2. **Run the Migration**
   - Navigate to the SQL Editor in the left sidebar
   - Click "New Query"
   - Copy the contents of `migrations/001_initial_schema.sql`
   - Paste into the SQL editor
   - Click "Run" to execute the migration

3. **Verify Tables Created**
   - Navigate to "Table Editor" in the left sidebar
   - You should see the following tables:
     - `user_accounts`
     - `profiles`
     - `otp_codes`
     - `profile_metadata`

### Option 2: Using Supabase CLI

1. **Install Supabase CLI**
   ```bash
   npm install -g supabase
   ```

2. **Login to Supabase**
   ```bash
   supabase login
   ```

3. **Link to your project**
   ```bash
   supabase link --project-ref your-project-ref
   ```

4. **Run migrations**
   ```bash
   supabase db push
   ```

## Database Schema Overview

### Tables

#### 1. `user_accounts`
- Stores user account information
- One user account can have multiple profiles
- Fields: id, email, email_verified, created_at, updated_at

#### 2. `profiles`
- Stores user profiles (multiple per user)
- Profile types: innovator, mentor, investor, academic_student, academic_institution, organization, professional
- Fields: id, user_account_id, profile_type, display_name, username, bio, avatar_url, cover_image_url, location, website, phone, is_primary, is_verified, completion_percentage, created_at, updated_at

#### 3. `otp_codes`
- Temporary storage for OTP codes
- Used for authentication
- Fields: id, email, code, expires_at, is_used, attempts, created_at

#### 4. `profile_metadata`
- Stores profile question answers and additional metadata
- Key-value pairs linked to profiles
- Fields: id, profile_id, metadata_key, metadata_value, created_at, updated_at

### Relationships

```
user_accounts (1) -----> (many) profiles
profiles (1) -----> (many) profile_metadata
```

### Row Level Security (RLS)

All tables have RLS enabled with the following policies:

- **user_accounts**: Users can only view and update their own account
- **profiles**: 
  - All authenticated users can view all profiles (public)
  - Users can only create, update, and delete their own profiles
- **profile_metadata**: Users can only access metadata for their own profiles

## Environment Variables

Make sure to set the following environment variables in your `.env` file:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
SUPABASE_ANON_KEY=your-anon-key
JWT_SECRET=your-jwt-secret-key
```

## Getting Supabase Credentials

1. Go to your Supabase project dashboard
2. Navigate to Settings > API
3. Copy the following:
   - Project URL → `SUPABASE_URL`
   - `service_role` key → `SUPABASE_SERVICE_KEY`
   - `anon` key → `SUPABASE_ANON_KEY`

## Testing the Database

After running the migration, you can test the database by:

1. **Creating a test user account**:
   ```sql
   INSERT INTO user_accounts (email, email_verified) 
   VALUES ('test@example.com', true);
   ```

2. **Creating a test profile**:
   ```sql
   INSERT INTO profiles (user_account_id, profile_type, display_name, is_primary) 
   VALUES (
     (SELECT id FROM user_accounts WHERE email = 'test@example.com'),
     'innovator',
     'Test User',
     true
   );
   ```

3. **Querying profiles**:
   ```sql
   SELECT * FROM profiles WHERE user_account_id = (
     SELECT id FROM user_accounts WHERE email = 'test@example.com'
   );
   ```

## Troubleshooting

### Issue: "relation already exists"
- This means the tables are already created
- You can either drop the tables first or skip the migration

### Issue: "permission denied"
- Make sure you're using the `service_role` key, not the `anon` key
- Check that RLS policies are correctly configured

### Issue: "function uuid_generate_v4() does not exist"
- Run: `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`

## Next Steps

After setting up the database:

1. Update your `.env` file with Supabase credentials
2. Start the backend services
3. Test the authentication endpoints
4. Create your first user via the API

## Support

For issues or questions:
- Check Supabase documentation: https://supabase.com/docs
- Review the backend implementation plan: `../BACKEND_IMPLEMENTATION_PLAN.md`

