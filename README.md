# AI Study Assistant - Backend API

Production-ready authentication backend for AI Study Assistant mobile app.

## 🚀 Features

- ✅ Email/Password Authentication
- ✅ Google OAuth 2.0 Integration
- ✅ Guest Login Support
- ✅ JWT Token Authentication
- ✅ Refresh Token System
- ✅ Password Hashing (bcrypt)
- ✅ Input Validation
- ✅ Rate Limiting
- ✅ CORS Configuration
- ✅ Security Headers (Helmet.js)
- ✅ **Supabase PostgreSQL Database**
- ✅ MVC Architecture
- ✅ Error Handling

## 📋 Prerequisites

- Node.js (v16 or higher)
- Supabase account (free at https://supabase.com)
- Google OAuth credentials (for Google login)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   **Option 1: Interactive Setup (Recommended)**
   ```bash
   # Run the setup script
   .\setup-supabase.ps1
   ```
   
   **Option 2: Manual Setup**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and update:
   - `SUPABASE_URL` - Your Supabase project URL
   - `SUPABASE_ANON_KEY` - Your Supabase anon/public key
   - `JWT_SECRET` - Strong random string (min 32 chars)
   - `REFRESH_TOKEN_SECRET` - Another strong random string
   - `GOOGLE_CLIENT_ID` - From Google Cloud Console
   - `GOOGLE_CLIENT_SECRET` - From Google Cloud Console

4. **Set up Supabase database**
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Copy and run the SQL from `src/config/schema.sql`

5. **Install dependencies**
   ```bash
   npm install
   ```

6. **Run the server**
   ```bash
   # Development
   npm run dev

   # Production
   npm start
   ```

Server will start on `http://localhost:5000`

> 📚 **For detailed migration guide, see [SUPABASE_MIGRATION.md](./SUPABASE_MIGRATION.md)**

## 📡 API Endpoints

### Authentication

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Google Login
```http
POST /api/auth/google
Content-Type: application/json

{
  "idToken": "google-id-token-here"
}
```

#### Guest Login
```http
POST /api/auth/guest
Content-Type: application/json

{
  "deviceId": "unique-device-id"
}
```

#### Get Profile (Protected)
```http
GET /api/auth/profile
Authorization: Bearer <access-token>
```

#### Logout (Protected)
```http
POST /api/auth/logout
Authorization: Bearer <access-token>
```

#### Refresh Token
```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "refresh-token-here"
}
```

## 🔐 Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs
6. Copy Client ID and Client Secret to `.env`

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── supabase.js          # Supabase client
│   │   ├── schema.sql           # Database schema
│   │   └── google-oauth.js      # Google OAuth config
│   ├── controllers/
│   │   └── authController.js    # Auth logic
│   ├── middleware/
│   │   ├── auth.js              # JWT verification
│   │   ├── validation.js        # Input validation
│   │   └── errorHandler.js      # Error handling
│   ├── models/
│   │   └── User.js              # User model (Supabase)
│   ├── routes/
│   │   └── authRoutes.js        # API routes
│   ├── utils/
│   │   └── tokenManager.js      # JWT utilities
│   └── app.js                   # Express app
├── .env                         # Environment variables
├── .env.example                 # Environment template
├── setup-supabase.ps1           # Setup script
├── SUPABASE_MIGRATION.md        # Migration guide
├── package.json                 # Dependencies
└── server.js                    # Entry point
```

## 🧪 Testing

Test endpoints using Postman or curl:

```bash
# Health check
curl http://localhost:5000/health

# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

## 🚀 Deployment

### Heroku
```bash
heroku create your-app-name
heroku config:set MONGODB_URI=your-mongodb-uri
heroku config:set JWT_SECRET=your-jwt-secret
git push heroku main
```

### Railway/Render
1. Connect GitHub repository
2. Add environment variables (SUPABASE_URL, SUPABASE_ANON_KEY, etc.)
3. Deploy

### Supabase Setup
1. Create project at [Supabase](https://supabase.com)
2. Run SQL schema from `src/config/schema.sql`
3. Get your project URL and anon key
4. Update environment variables

## 🔒 Security Best Practices

- ✅ Passwords hashed with bcrypt (10 rounds)
- ✅ JWT tokens with expiration
- ✅ Refresh token rotation
- ✅ Input validation and sanitization
- ✅ Rate limiting (100 requests/15 min)
- ✅ CORS configuration
- ✅ Helmet.js security headers
- ✅ Environment variables for secrets

## 📝 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment | `development` or `production` |
| `PORT` | Server port | `5000` |
| `SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` |
| `SUPABASE_ANON_KEY` | Supabase anon key | `eyJ...` |
| `JWT_SECRET` | JWT secret key | `your-secret-key-min-32-chars` |
| `JWT_EXPIRE` | JWT expiration | `1h` |
| `REFRESH_TOKEN_SECRET` | Refresh token secret | `your-refresh-secret` |
| `REFRESH_TOKEN_EXPIRE` | Refresh token expiry | `7d` |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | `your-client-id` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret | `your-client-secret` |
| `CORS_ORIGIN` | Allowed origins | `http://localhost:3000` |

## 🐛 Troubleshooting

**Supabase Connection Error**
- Verify SUPABASE_URL and SUPABASE_ANON_KEY are correct
- Check your Supabase project is active (not paused)
- Ensure you've run the SQL schema
- Verify internet connection

**"relation 'users' does not exist"**
- Run the SQL schema from `src/config/schema.sql` in Supabase SQL Editor

**Google Login Not Working**
- Verify Google OAuth credentials
- Check authorized redirect URIs
- Ensure Google+ API is enabled

**JWT Token Errors**
- Check JWT_SECRET is set
- Verify token format in Authorization header
- Check token expiration

## 📄 License

MIT

## 👨‍💻 Author

AI Study Assistant Team
