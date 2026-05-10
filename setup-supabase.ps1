# Supabase Setup Script for AI Study Assistant
# This script helps you set up your .env file with Supabase credentials

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "   AI Study Assistant - Supabase Setup" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env already exists
if (Test-Path ".env") {
    Write-Host "⚠️  .env file already exists!" -ForegroundColor Yellow
    $overwrite = Read-Host "Do you want to overwrite it? (y/N)"
    if ($overwrite -ne "y" -and $overwrite -ne "Y") {
        Write-Host "Setup cancelled. Existing .env file preserved." -ForegroundColor Green
        exit
    }
}

Write-Host ""
Write-Host "📝 Please provide your Supabase credentials:" -ForegroundColor Green
Write-Host "   (You can find these in your Supabase project settings → API)" -ForegroundColor Gray
Write-Host ""

# Get Supabase URL
$supabaseUrl = Read-Host "Enter your SUPABASE_URL (e.g., https://xxxxx.supabase.co)"
while ([string]::IsNullOrWhiteSpace($supabaseUrl)) {
    Write-Host "❌ SUPABASE_URL cannot be empty!" -ForegroundColor Red
    $supabaseUrl = Read-Host "Enter your SUPABASE_URL"
}

# Get Supabase Anon Key
$supabaseKey = Read-Host "Enter your SUPABASE_ANON_KEY (starts with eyJ...)"
while ([string]::IsNullOrWhiteSpace($supabaseKey)) {
    Write-Host "❌ SUPABASE_ANON_KEY cannot be empty!" -ForegroundColor Red
    $supabaseKey = Read-Host "Enter your SUPABASE_ANON_KEY"
}

Write-Host ""
Write-Host "🔐 JWT Configuration:" -ForegroundColor Green
Write-Host "   (Press Enter to use auto-generated secrets)" -ForegroundColor Gray
Write-Host ""

# Generate random secrets
function Generate-Secret {
    $bytes = New-Object byte[] 32
    [Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
    return [Convert]::ToBase64String($bytes)
}

$jwtSecret = Read-Host "Enter JWT_SECRET (or press Enter for auto-generated)"
if ([string]::IsNullOrWhiteSpace($jwtSecret)) {
    $jwtSecret = Generate-Secret
    Write-Host "   Generated: $jwtSecret" -ForegroundColor Gray
}

$refreshSecret = Read-Host "Enter REFRESH_TOKEN_SECRET (or press Enter for auto-generated)"
if ([string]::IsNullOrWhiteSpace($refreshSecret)) {
    $refreshSecret = Generate-Secret
    Write-Host "   Generated: $refreshSecret" -ForegroundColor Gray
}

Write-Host ""
Write-Host "🌐 Google OAuth (Optional):" -ForegroundColor Green
Write-Host "   (Press Enter to skip if not using Google login)" -ForegroundColor Gray
Write-Host ""

$googleClientId = Read-Host "Enter GOOGLE_CLIENT_ID (or press Enter to skip)"
$googleClientSecret = Read-Host "Enter GOOGLE_CLIENT_SECRET (or press Enter to skip)"

if ([string]::IsNullOrWhiteSpace($googleClientId)) {
    $googleClientId = "your-google-client-id-from-console"
}
if ([string]::IsNullOrWhiteSpace($googleClientSecret)) {
    $googleClientSecret = "your-google-client-secret"
}

# Create .env file
$envContent = @"
# Environment Configuration
NODE_ENV=development
PORT=5000

# Supabase Database
SUPABASE_URL=$supabaseUrl
SUPABASE_ANON_KEY=$supabaseKey

# JWT Configuration
JWT_SECRET=$jwtSecret
JWT_EXPIRE=1h
REFRESH_TOKEN_SECRET=$refreshSecret
REFRESH_TOKEN_EXPIRE=7d

# Google OAuth
GOOGLE_CLIENT_ID=$googleClientId
GOOGLE_CLIENT_SECRET=$googleClientSecret

# CORS
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
"@

# Write to .env file
$envContent | Out-File -FilePath ".env" -Encoding UTF8 -NoNewline

Write-Host ""
Write-Host "================================================" -ForegroundColor Green
Write-Host "✅ .env file created successfully!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host "   1. Go to your Supabase SQL Editor" -ForegroundColor White
Write-Host "   2. Run the SQL from: src/config/schema.sql" -ForegroundColor White
Write-Host "   3. Start the server: npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "📚 For detailed instructions, see: SUPABASE_MIGRATION.md" -ForegroundColor Gray
Write-Host ""
