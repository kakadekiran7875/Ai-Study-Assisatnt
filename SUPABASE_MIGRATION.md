# Supabase Migration Guide

## Overview
This backend has been migrated from MongoDB to Supabase (PostgreSQL). This guide will help you set up and run the application with Supabase.

## Prerequisites
1. A Supabase account (free tier available at https://supabase.com)
2. Node.js installed on your system

## Setup Steps

### 1. Create a Supabase Project
1. Go to https://supabase.com and sign up/login
2. Click "New Project"
3. Fill in the project details:
   - **Name**: AI Study Assistant (or any name you prefer)
   - **Database Password**: Choose a strong password
   - **Region**: Select the closest region to you
4. Wait for the project to be created (takes ~2 minutes)

### 2. Get Your Supabase Credentials
1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

### 3. Run the Database Schema
1. In your Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy the entire contents of `src/config/schema.sql`
4. Paste it into the SQL editor
5. Click **Run** or press `Ctrl+Enter`
6. You should see a success message

### 4. Configure Environment Variables
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and update the following:
   ```env
   # Supabase Database
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-supabase-anon-key-here
   
   # JWT Configuration (generate strong secrets)
   JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-chars
   REFRESH_TOKEN_SECRET=your-refresh-token-secret-change-in-production-min-32-chars
   
   # Google OAuth (if using Google login)
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   ```

### 5. Install Dependencies
```bash
npm install
```

This will install the new `@supabase/supabase-js` package and remove the old `mongoose` dependency.

### 6. Run the Server
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

## What Changed?

### Database
- **Before**: MongoDB with Mongoose ODM
- **After**: PostgreSQL with Supabase

### Key Files Modified
1. **package.json** - Replaced `mongoose` with `@supabase/supabase-js`
2. **src/config/database.js** → **src/config/supabase.js** - New Supabase client
3. **src/models/User.js** - Converted from Mongoose schema to Supabase queries
4. **src/controllers/authController.js** - Updated to use new User model methods
5. **src/middleware/auth.js** - Minor updates for compatibility
6. **.env.example** - Updated with Supabase credentials

### New Files
1. **src/config/supabase.js** - Supabase client configuration
2. **src/config/schema.sql** - PostgreSQL database schema
3. **SUPABASE_MIGRATION.md** - This file

## Database Schema

The `users` table has the following structure:

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key (auto-generated) |
| name | VARCHAR(50) | User's full name |
| email | VARCHAR(255) | User's email (unique) |
| password | VARCHAR(255) | Hashed password (null for Google/Guest) |
| login_type | VARCHAR(20) | 'email', 'google', or 'guest' |
| role | VARCHAR(20) | 'user', 'guest', or 'admin' |
| google_id | VARCHAR(255) | Google OAuth ID (unique, nullable) |
| is_email_verified | BOOLEAN | Email verification status |
| last_login | TIMESTAMP | Last login timestamp |
| refresh_token | TEXT | JWT refresh token |
| created_at | TIMESTAMP | Account creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

## API Endpoints (Unchanged)

All API endpoints remain the same:

- `POST /api/auth/register` - Register with email/password
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/google` - Login/Register with Google
- `POST /api/auth/guest` - Guest login
- `GET /api/auth/profile` - Get user profile (Protected)
- `POST /api/auth/logout` - Logout (Protected)
- `POST /api/auth/refresh` - Refresh access token

## Viewing Your Data

You can view and manage your data in Supabase:

1. Go to your Supabase project dashboard
2. Click on **Table Editor** in the sidebar
3. Select the `users` table
4. You can view, add, edit, or delete records directly

## Troubleshooting

### "Supabase credentials not found"
- Make sure you've created a `.env` file (not just `.env.example`)
- Verify that `SUPABASE_URL` and `SUPABASE_ANON_KEY` are set correctly

### "relation 'users' does not exist"
- You need to run the SQL schema in Supabase SQL Editor
- Copy contents from `src/config/schema.sql` and run it

### "Email already registered" error
- This is expected behavior if you try to register with an existing email
- Check your users table in Supabase to see existing users

### Connection issues
- Verify your Supabase project is active (not paused)
- Check that your SUPABASE_URL is correct
- Ensure your internet connection is stable

## Benefits of Supabase

1. **Free Tier**: Generous free tier with 500MB database
2. **Real-time**: Built-in real-time subscriptions (if needed later)
3. **Auth**: Built-in authentication (we're using custom JWT for now)
4. **Storage**: File storage capabilities
5. **Dashboard**: Beautiful UI to manage your data
6. **Backups**: Automatic backups on paid plans
7. **PostgreSQL**: Industry-standard relational database

## Next Steps

- Set up Google OAuth credentials if you want Google login
- Configure CORS_ORIGIN for your Flutter app
- Test all authentication endpoints
- Deploy to production (Render, Railway, etc.)

## Support

If you encounter any issues:
1. Check the Supabase documentation: https://supabase.com/docs
2. Review the console logs for error messages
3. Verify your environment variables are correct
