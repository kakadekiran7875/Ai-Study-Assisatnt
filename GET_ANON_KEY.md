# 🔑 Getting Your Supabase Anon Key

## Quick Steps:

1. **Go to your Supabase Dashboard**
   → https://supabase.com/dashboard/project/qzhhekukwoqltqxrwxlx

2. **Click Settings (⚙️ icon in sidebar)**

3. **Click "API" in the Settings menu**

4. **Find "Project API keys" section**

5. **Copy the "anon" "public" key**
   - It's labeled as: `anon` `public`
   - It's a LONG token starting with `eyJ...`
   - Example: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (much longer)

6. **Update your .env file**
   - Open: `backend/.env`
   - Replace: `YOUR_ANON_KEY_HERE_STARTS_WITH_eyJ`
   - With: Your actual anon key

## ⚠️ Important Notes:

- **DON'T use** the `service_role` key (that's for server-side only, very sensitive)
- **DON'T use** the `sb_publishable_...` key (that's for client-side apps)
- **DO use** the `anon` `public` key (starts with `eyJ...`)

## After updating .env:

1. Save the file
2. Restart your server (Ctrl+C, then `npm run dev`)
3. You should see: ✅ Supabase Connected

## Screenshot Guide:

In the Supabase dashboard, you'll see something like:

```
Project API keys
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

anon public
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6aGhla3Vrd29xbHRxeHJ3eGx4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDY4NjQwMDAsImV4cCI6MjAyMjQ0MDAwMH0...
[Copy button]

service_role secret
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... ⚠️ DON'T USE THIS ONE
[Copy button]
```

**Copy the first one** (anon public) ☝️

---

Need help? The key should be about 200-300 characters long!
