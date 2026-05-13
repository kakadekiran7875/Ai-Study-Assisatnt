const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Initialize Gemini 1.5 Flash (faster and cheaper for chat)
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

/**
 * Test Gemini connection
 */
const testGeminiConnection = async () => {
    try {
        if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your-gemini-key-here') {
            console.warn('⚠️  Gemini API Key not found in environment variables');
            return;
        }

        const result = await model.generateContent("Say 'Gemini Connected' in 2 words.");
        const response = await result.response;
        console.log(`✅ Gemini AI Connected: ${response.text().trim()}`);
    } catch (error) {
        console.warn(`❌ Gemini AI Connection Failed: ${error.message}`);
    }
};

module.exports = { genAI, model, testGeminiConnection };
