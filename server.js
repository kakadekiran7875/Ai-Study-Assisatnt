require('dotenv').config();
const app = require('./src/app');
const { connectDatabase } = require('./src/config/supabase');
const { testOpenAIConnection } = require('./src/config/openai');
const { testGeminiConnection } = require('./src/config/gemini');

// Connect to database
connectDatabase();

// Test AI connections
testOpenAIConnection();
testGeminiConnection();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   🚀 AI Study Assistant Backend Server                    ║
║                                                            ║
║   📡 Server running on port: ${PORT}                        ║
║   🌍 Environment: ${process.env.NODE_ENV || 'development'}                    ║
║   📅 Started at: ${new Date().toLocaleString()}            ║
║                                                            ║
║   Authentication Endpoints:                                ║
║   ├─ POST /api/auth/register                               ║
║   ├─ POST /api/auth/login                                  ║
║   ├─ POST /api/auth/google                                 ║
║   ├─ POST /api/auth/guest                                  ║
║   ├─ GET  /api/auth/profile (Protected)                    ║
║   ├─ POST /api/auth/logout (Protected)                     ║
║   └─ POST /api/auth/refresh                                ║
║                                                            ║
║   AI Features Endpoints:                                   ║
║   ├─ POST /api/ai/generate-notes (Protected)               ║
║   ├─ POST /api/ai/generate-quiz (Protected)                ║
║   ├─ POST /api/ai/summarize (Protected)                    ║
║   ├─ POST /api/ai/chat (Protected)                         ║
║   ├─ POST /api/ai/extract-text (Protected)                 ║
║   └─ POST /api/ai/generate-flashcards (Protected)          ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error(`❌ Unhandled Rejection: ${err.message}`);
    server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error(`❌ Uncaught Exception: ${err.message}`);
    process.exit(1);
});
