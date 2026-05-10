# ✅ Supabase Migration Checklist

Use this checklist to track your migration progress!

## 📦 Backend Migration (Completed ✅)

- [x] Updated `package.json` (removed mongoose, added @supabase/supabase-js)
- [x] Installed new dependencies
- [x] Created `src/config/supabase.js` (Supabase client)
- [x] Created `src/config/schema.sql` (PostgreSQL schema)
- [x] Removed `src/config/database.js` (old MongoDB config)
- [x] Updated `src/models/User.js` (Supabase implementation)
- [x] Updated `src/controllers/authController.js` (Supabase queries)
- [x] Updated `src/middleware/auth.js` (compatibility)
- [x] Updated `server.js` (import Supabase config)
- [x] Updated `.env.example` (Supabase credentials)
- [x] Updated `README.md` (Supabase documentation)
- [x] Created migration guides and scripts

## 🚀 Setup Tasks (Your Turn!)

### 1. Supabase Account Setup
- [ ] Created Supabase account at https://supabase.com
- [ ] Created new project
- [ ] Noted down project URL
- [ ] Noted down anon/public key
- [ ] Noted down database password (for future reference)

### 2. Database Schema
- [ ] Opened Supabase SQL Editor
- [ ] Copied SQL from `src/config/schema.sql`
- [ ] Ran the SQL successfully
- [ ] Verified `users` table exists in Table Editor

### 3. Environment Configuration
- [ ] Ran `.\setup-supabase.ps1` OR manually created `.env`
- [ ] Added `SUPABASE_URL` to `.env`
- [ ] Added `SUPABASE_ANON_KEY` to `.env`
- [ ] Generated/added `JWT_SECRET` to `.env`
- [ ] Generated/added `REFRESH_TOKEN_SECRET` to `.env`

### 4. Google OAuth (Optional)
- [ ] Created Google Cloud project
- [ ] Enabled Google+ API
- [ ] Created OAuth 2.0 credentials
- [ ] Added `GOOGLE_CLIENT_ID` to `.env`
- [ ] Added `GOOGLE_CLIENT_SECRET` to `.env`

### 5. Testing
- [ ] Ran `npm install` (dependencies installed)
- [ ] Started server with `npm run dev`
- [ ] Server connects to Supabase successfully
- [ ] Tested user registration
- [ ] Tested user login
- [ ] Tested Google OAuth (if configured)
- [ ] Tested guest login
- [ ] Tested token refresh
- [ ] Tested protected routes
- [ ] Verified users appear in Supabase Table Editor

### 6. Flutter App Integration
- [ ] Updated API base URL in Flutter app (if changed)
- [ ] Tested registration from Flutter app
- [ ] Tested login from Flutter app
- [ ] Tested Google OAuth from Flutter app
- [ ] Tested guest login from Flutter app
- [ ] Tested token persistence
- [ ] Tested logout

### 7. Deployment (Optional)
- [ ] Chose deployment platform (Railway/Render/Heroku)
- [ ] Added environment variables to platform
- [ ] Deployed backend
- [ ] Tested deployed API endpoints
- [ ] Updated Flutter app with production URL

## 📚 Documentation Reference

| File | Purpose |
|------|---------|
| `QUICKSTART.md` | 10-minute setup guide |
| `SUPABASE_MIGRATION.md` | Detailed migration guide |
| `MIGRATION_SUMMARY.md` | What changed and why |
| `README.md` | Full backend documentation |
| `setup-supabase.ps1` | Interactive setup script |

## 🐛 Troubleshooting

If you encounter issues, check:

1. **Connection errors**: Verify SUPABASE_URL and SUPABASE_ANON_KEY
2. **Table errors**: Ensure SQL schema was run
3. **Auth errors**: Check JWT secrets are set
4. **API errors**: Review server logs

## 📞 Getting Help

- Review `SUPABASE_MIGRATION.md` for detailed instructions
- Check Supabase docs: https://supabase.com/docs
- Review server logs for error messages
- Verify all environment variables are set

## 🎯 Current Status

**Migration**: ✅ Complete
**Setup**: ⏳ In Progress (follow checklist above)
**Testing**: ⏳ Pending
**Deployment**: ⏳ Optional

---

**Next Step**: Follow the `QUICKSTART.md` guide to set up your Supabase project!
