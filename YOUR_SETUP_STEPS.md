# 🚀 YOUR SETUP INSTRUCTIONS

## ✅ What You Have:
- Supabase URL: `https://qzhhekukwoqltqxrwxlx.supabase.co`
- Backend code: Ready and migrated to Supabase

## 📋 What You Need To Do:

### Step 1: Get Your Anon Key (2 minutes)

1. Open this link in your browser:
   **https://supabase.com/dashboard/project/qzhhekukwoqltqxrwxlx/settings/api**

2. Scroll down to **"Project API keys"**

3. Find the key labeled **"anon" "public"**
   - It starts with `eyJ...`
   - It's about 200-300 characters long
   - Click the copy button next to it

4. Open `backend/.env` file

5. Find this line:
   ```
   SUPABASE_ANON_KEY=YOUR_ANON_KEY_HERE_STARTS_WITH_eyJ
   ```

6. Replace `YOUR_ANON_KEY_HERE_STARTS_WITH_eyJ` with your actual key

7. Save the file

### Step 2: Run Database Schema (2 minutes)

1. Go to Supabase SQL Editor:
   **https://supabase.com/dashboard/project/qzhhekukwoqltqxrwxlx/sql/new**

2. Copy ALL the SQL from this file:
   `backend/src/config/schema.sql`

3. Paste it into the SQL Editor

4. Click **"Run"** or press `Ctrl+Enter`

5. You should see: ✅ Success message

### Step 3: Restart Your Server

1. In your terminal, press `Ctrl+C` to stop the current server

2. Run:
   ```bash
   npm run dev
   ```

3. You should see:
   ```
   ✅ Supabase Connected: https://qzhhekukwoqltqxrwxlx.supabase.co
   📊 Database: PostgreSQL (Supabase)
   🚀 Server running on port: 5000
   ```

### Step 4: Test It! (1 minute)

Open a new terminal and run:

```powershell
curl -X POST http://localhost:5000/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{\"name\":\"Test User\",\"email\":\"test@example.com\",\"password\":\"test123\"}'
```

You should get a success response with a token!

### Step 5: Verify in Supabase

1. Go to: **https://supabase.com/dashboard/project/qzhhekukwoqltqxrwxlx/editor**

2. Click on **"users"** table

3. You should see your test user!

---

## 🆘 Troubleshooting

**"Supabase credentials not found"**
→ Make sure you updated the SUPABASE_ANON_KEY in .env file

**"relation 'users' does not exist"**
→ Run the SQL schema (Step 2)

**Server won't start**
→ Make sure you saved the .env file after updating it

---

## 📞 Need the Anon Key?

See `GET_ANON_KEY.md` for detailed instructions with screenshots!

---

**Current Status:**
- ✅ Supabase URL configured
- ⏳ Waiting for anon key
- ⏳ Waiting for database schema

**Next:** Get your anon key and update .env file!
