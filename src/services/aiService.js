const { openai } = require('../config/openai');

/**
 * AI Service for Study Assistant
 * Handles all OpenAI-related operations
 */
class AIService {
    /**
     * Generate notes from text content
     * @param {string} content - The text content to generate notes from
     * @param {string} subject - Optional subject/topic
     * @returns {Promise<Object>} Generated notes
     */
    static async generateNotes(content, subject = '') {
        try {
            const prompt = `You are an expert study assistant. Generate comprehensive, well-structured notes from the following content.

${subject ? `Subject: ${subject}\n` : ''}
Content:
${content}

Please create:
1. A clear title
2. Key points (bullet points)
3. Detailed summary
4. Important terms/definitions (if any)

Format the response as JSON with this structure:
{
  "title": "...",
  "keyPoints": ["...", "..."],
  "summary": "...",
  "terms": [{"term": "...", "definition": "..."}]
}`;

            const completion = await openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful study assistant that creates clear, concise notes for students.',
                    },
                    {
                        role: 'user',
                        content: prompt,
                    },
                ],
                temperature: 0.7,
                max_tokens: 1500,
            });

            const responseText = completion.choices[0].message.content;

            // Try to parse JSON response
            try {
                return JSON.parse(responseText);
            } catch {
                // If not valid JSON, return as plain text
                return {
                    title: subject || 'Generated Notes',
                    keyPoints: [],
                    summary: responseText,
                    terms: [],
                };
            }
        } catch (error) {
            throw new Error(`Failed to generate notes: ${error.message}`);
        }
    }

    /**
     * Generate quiz questions from content
     * @param {string} content - The content to generate quiz from
     * @param {number} questionCount - Number of questions to generate
     * @param {string} difficulty - easy, medium, or hard
     * @returns {Promise<Object>} Generated quiz
     */
    static async generateQuiz(content, questionCount = 5, difficulty = 'medium') {
        try {
            const prompt = `Create a ${difficulty} difficulty quiz with ${questionCount} multiple-choice questions based on this content:

${content}

Format as JSON:
{
  "questions": [
    {
      "question": "...",
      "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
      "correctAnswer": "A",
      "explanation": "..."
    }
  ]
}`;

            const completion = await openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: 'You are an expert quiz creator for students. Create clear, educational questions.',
                    },
                    {
                        role: 'user',
                        content: prompt,
                    },
                ],
                temperature: 0.8,
                max_tokens: 2000,
            });

            const responseText = completion.choices[0].message.content;
            return JSON.parse(responseText);
        } catch (error) {
            throw new Error(`Failed to generate quiz: ${error.message}`);
        }
    }

    /**
     * Summarize long text content
     * @param {string} content - The content to summarize
     * @param {number} maxLength - Maximum length of summary (in words)
     * @returns {Promise<string>} Summary
     */
    static async summarizeContent(content, maxLength = 200) {
        try {
            const prompt = `Summarize the following content in approximately ${maxLength} words. Make it clear and concise:

${content}`;

            const completion = await openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful assistant that creates clear, concise summaries.',
                    },
                    {
                        role: 'user',
                        content: prompt,
                    },
                ],
                temperature: 0.5,
                max_tokens: Math.ceil(maxLength * 1.5),
            });

            return completion.choices[0].message.content;
        } catch (error) {
            throw new Error(`Failed to summarize content: ${error.message}`);
        }
    }

    /**
     * Chat with AI assistant
     * @param {string} message - User's message
     * @param {Array} conversationHistory - Previous messages
     * @returns {Promise<string>} AI response
     */
    static async chat(message, conversationHistory = []) {
        try {
            const messages = [
                {
                    role: 'system',
                    content: `You are Antigravity AI, a smart, friendly, and professional AI study assistant.

Your role:
- Help students learn, solve problems, and get clear explanations
- Answer in simple, easy-to-understand language
- Prefer step-by-step explanations
- Be polite, motivating, and supportive
- Give practical and real-world examples
- Help with homework, concepts, and study strategies

Keep answers concise but helpful. Use examples when useful.`,
                },
                ...conversationHistory,
                {
                    role: 'user',
                    content: message,
                },
            ];

            const completion = await openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: messages,
                temperature: 0.7,
                max_tokens: 1000,
            });

            return completion.choices[0].message.content;
        } catch (error) {
            throw new Error(`Failed to get AI response: ${error.message}`);
        }
    }

    /**
     * Extract text from image (OCR) and generate notes
     * @param {string} imageUrl - URL of the image
     * @returns {Promise<Object>} Extracted text and generated notes
     */
    static async extractTextFromImage(imageUrl) {
        try {
            const completion = await openai.chat.completions.create({
                model: 'gpt-4-vision-preview',
                messages: [
                    {
                        role: 'user',
                        content: [
                            {
                                type: 'text',
                                text: 'Extract all text from this image and create study notes. Include any diagrams, formulas, or important information.',
                            },
                            {
                                type: 'image_url',
                                image_url: {
                                    url: imageUrl,
                                },
                            },
                        ],
                    },
                ],
                max_tokens: 2000,
            });

            return {
                extractedText: completion.choices[0].message.content,
            };
        } catch (error) {
            throw new Error(`Failed to extract text from image: ${error.message}`);
        }
    }

    /**
     * Generate flashcards from content
     * @param {string} content - The content to create flashcards from
     * @param {number} cardCount - Number of flashcards to generate
     * @returns {Promise<Object>} Generated flashcards
     */
    static async generateFlashcards(content, cardCount = 10) {
        try {
            const prompt = `Create ${cardCount} flashcards from this content. Each flashcard should have a question/term on one side and answer/definition on the other.

Content:
${content}

Format as JSON:
{
  "flashcards": [
    {
      "front": "Question or term",
      "back": "Answer or definition"
    }
  ]
}`;

            const completion = await openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: 'You are an expert at creating educational flashcards for effective studying.',
                    },
                    {
                        role: 'user',
                        content: prompt,
                    },
                ],
                temperature: 0.7,
                max_tokens: 1500,
            });

            const responseText = completion.choices[0].message.content;
            return JSON.parse(responseText);
        } catch (error) {
            throw new Error(`Failed to generate flashcards: ${error.message}`);
        }
    }
}

module.exports = AIService;
