require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testGemini() {
    console.log("🔍 Testing Gemini AI Connection...");
    
    const apiKey = (process.env.GEMINI_API_KEY || "").trim();
    if (!apiKey || apiKey === 'your-gemini-key-here') {
        console.error("❌ Error: GEMINI_API_KEY is missing or is still a placeholder in .env");
        return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    try {
        const result = await model.generateContent("Hello Gemini, respond with 'Connected Successfully' if you can hear me.");
        const response = await result.response;
        const text = response.text();
        console.log("------------------------------------------");
        console.log("✅ GEMINI SUCCESS!");
        console.log("Response:", text.trim());
        console.log("------------------------------------------");
    } catch (error) {
        console.error("------------------------------------------");
        console.error("❌ GEMINI FAILED!");
        console.error("Error Message:", error.message);
        if (error.message.includes('404')) {
            console.error("💡 Tip: This usually means the 'Generative Language API' is not enabled in Google Cloud.");
        }
        console.error("------------------------------------------");
    }
}

testGemini();
