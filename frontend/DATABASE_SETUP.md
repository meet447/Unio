# Database Setup for API Tokens

To enable the API token functionality in the Profile page, you need to apply the database migration.

## Option 1: Using Supabase CLI (Recommended)

1. Install Supabase CLI if you haven't already:
   ```bash
   npm install -g supabase
   ```

2. Login to Supabase:
   ```bash
   supabase login
   ```

3. Link your project:
   ```bash
   supabase link --project-ref miokhailhdjutkcygxgg
   ```

4. Apply the migration:
   ```bash
   supabase db push
   ```

## Option 2: Manual SQL Execution

If you prefer to run the SQL manually in the Supabase dashboard:

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `supabase/migrations/20250821170000_add_user_api_tokens.sql`
4. Execute the SQL

## What the Migration Does

The migration creates:

- `user_api_tokens` table to store personal access tokens
- `generate_api_token()` function to create new tokens securely
- `validate_api_token()` function to authenticate API requests
- Proper Row Level Security (RLS) policies
- Automatic timestamp triggers

## Features

After applying the migration, users will be able to:

- Generate personal access tokens for API authentication
- View their existing tokens with creation and last-used dates
- Revoke tokens when needed
- Copy tokens to clipboard
- See API usage information and examples

## Security

- Tokens are hashed using SHA-256 before storage
- Only the user who created a token can see or manage it
- Tokens are only shown in full once when generated
- RLS policies ensure data isolation between users