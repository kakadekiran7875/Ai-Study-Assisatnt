const OpenAI = require('openai');

/**
 * Initialize OpenAI client
 */
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Test OpenAI connection
 */
const testOpenAIConnection = async () => {
    try {
        if (!process.env.OPENAI_API_KEY) {
            console.warn('⚠️  OpenAI API key not found in environment variables');
            console.log('📝 To use OpenAI features:');
            console.log('   1. Get your API key from https://platform.openai.com/api-keys');
            console.log('   2. Add OPENAI_API_KEY to your .env file');
            return false;
        }

        // Test with a simple completion
        await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: 'test' }],
            max_tokens: 5,
        });

        console.log('✅ OpenAI Connected Successfully');
        return true;
    } catch (error) {
        console.warn(`⚠️  OpenAI Connection Failed: ${error.message}`);
        console.log('📝 Please check your OPENAI_API_KEY in .env file');
        return false;
    }
};

module.exports = { openai, testOpenAIConnection };
