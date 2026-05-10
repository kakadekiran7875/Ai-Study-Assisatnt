# ⚡ Quick Start Guide - Supabase Backend

Follow these steps to get your backend running with Supabase in under 10 minutes!

## Step 1: Create Supabase Project (2 minutes)

1. Go to **https://supabase.com**
2. Click **"Start your project"** or **"New Project"**
3. Sign in with GitHub (recommended) or email
4. Click **"New Project"**
5. Fill in:
   - **Name**: `ai-study-assistant` (or any name)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to you
6. Click **"Create new project"**
7. Wait ~2 minutes for setup

## Step 2: Get Your Credentials (1 minute)

1. In your Supabase dashboard, click **Settings** (⚙️ icon)
2. Click **API** in the sidebar
3. You'll see:
   - **Project URL**: Copy this (looks like `https://xxxxx.supabase.co`)
   - **anon/public key**: Copy this (long string starting with `eyJ...`)

## Step 3: Run Database Schema (1 minute)

1. In Supabase dashboard, click **SQL Editor** (📝 icon)
2. Click **"New Query"**
3. Open `src/config/schema.sql` in your code editor
4. Copy ALL the SQL code
5. Paste into Supabase SQL Editor
6. Click **"Run"** or press `Ctrl+Enter`
7. You should see: ✅ Success message

## Step 4: Configure Backend (2 minutes)

**Option A: Interactive Setup (Recommended)**
```powershell
# In backend folder
.\setup-supabase.ps1
```
Follow the prompts and paste your credentials.

**Option B: Manual Setup**
```powershell
# Copy example file
cp .env.example .env

# Edit .env and add:
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

## Step 5: Install & Run (2 minutes)

```powershell
# Install dependencies (already done if you ran npm install)
npm install

# Start the server
npm run dev
```

You should see:
```
✅ Supabase Connected: https://xxxxx.supabase.co
📊 Database: PostgreSQL (Supabase)
🚀 AI Study Assistant Backend Server
📡 Server running on port: 5000
```

## Step 6: Test It! (2 minutes)

Open a new terminal and test registration:

```powershell
# Test registration
curl -X POST http://localhost:5000/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{\"name\":\"Test User\",\"email\":\"test@example.com\",\"password\":\"test123\"}'
```

You should get a success response with a token!

## ✅ Verify in Supabase

1. Go to Supabase Dashboard
2. Click **Table Editor**
3. Click **users** table
4. You should see your test user!

## 🎉 You're Done!

Your backend is now running with Supabase PostgreSQL!

### What's Next?

- [ ] Update your Flutter app's API URL (if needed)
- [ ] Set up Google OAuth (optional)
- [ ] Test all authentication flows
- [ ] Deploy to production (Railway, Render, etc.)

### Common Issues

**"Supabase credentials not found"**
→ Make sure you created `.env` file (not `.env.example`)

**"relation 'users' does not exist"**
→ Run the SQL schema in Supabase SQL Editor

**Server won't start**
→ Check if port 5000 is already in use

### Need More Help?

- 📚 Detailed guide: `SUPABASE_MIGRATION.md`
- 📋 Summary: `MIGRATION_SUMMARY.md`
- 📖 Full docs: `README.md`

---

**Total Time**: ~10 minutes ⚡
**Difficulty**: Easy 😊
**Cost**: Free! 💰
