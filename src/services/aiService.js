const { model } = require('../config/gemini');

/**
 * AI Service for Study Assistant
 * Handles all Gemini AI operations (Chat, Notes, Quiz, etc.)
 */
class AIService {
    /**
     * Generate notes from text content
     */
    static async generateNotes(content, subject = '') {
        try {
            const prompt = `You are an expert study assistant. Generate comprehensive, well-structured notes from the following content.
${subject ? `Subject: ${subject}\n` : ''}
Content:
${content}

Format the response as JSON with this structure:
{
  "title": "...",
  "keyPoints": ["...", "..."],
  "summary": "...",
  "terms": [{"term": "...", "definition": "..."}]
}`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text().replace(/```json|```/g, "").trim();

            try {
                return JSON.parse(text);
            } catch {
                return {
                    title: subject || 'Generated Notes',
                    keyPoints: [],
                    summary: response.text(),
                    terms: [],
                };
            }
        } catch (error) {
            console.error('❌ Gemini Notes Error:', error.message);
            throw new Error(`Failed to generate notes: ${error.message}`);
        }
    }

    /**
     * Generate quiz questions from content
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

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text().replace(/```json|```/g, "").trim();
            return JSON.parse(text);
        } catch (error) {
            console.error('❌ Gemini Quiz Error:', error.message);
            throw new Error(`Failed to generate quiz: ${error.message}`);
        }
    }

    /**
     * Summarize long text content
     */
    static async summarizeContent(content, maxLength = 200) {
        try {
            const prompt = `Summarize the following content in approximately ${maxLength} words. Make it clear and concise:
${content}`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error('❌ Gemini Summary Error:', error.message);
            throw new Error(`Failed to summarize content: ${error.message}`);
        }
    }

    /**
     * Chat with AI assistant (Gemini 1.5 Flash)
     */
    static async chat(message, conversationHistory = []) {
        try {
            // Convert history to Gemini format
            const history = conversationHistory.map(msg => ({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.content }],
            }));

            const chat = model.startChat({
                history: history,
                generationConfig: {
                    maxOutputTokens: 1000,
                },
            });

            const result = await chat.sendMessage(message);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error('❌ Gemini Chat Error:', error.message);
            throw new Error(`Failed to get AI response: ${error.message}`);
        }
    }

    /**
     * Extract text from image (OCR) and generate notes using Gemini Vision
     */
    static async extractTextFromImage(imageBuffer, mimeType) {
        try {
            const prompt = "Extract all text from this image and create study notes. Include any diagrams, formulas, or important information.";
            
            const imagePart = {
                inlineData: {
                    data: imageBuffer.toString("base64"),
                    mimeType
                },
            };

            const result = await model.generateContent([prompt, imagePart]);
            const response = await result.response;
            return {
                extractedText: response.text(),
            };
        } catch (error) {
            console.error('❌ Gemini Vision Error:', error.message);
            throw new Error(`Failed to extract text from image: ${error.message}`);
        }
    }

    /**
     * Generate flashcards from content
     */
    static async generateFlashcards(content, cardCount = 10) {
        try {
            const prompt = `Create ${cardCount} flashcards from this content.
Format as JSON:
{
  "flashcards": [
    {
      "front": "Question or term",
      "back": "Answer or definition"
    }
  ]
}

Content:
${content}`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text().replace(/```json|```/g, "").trim();
            return JSON.parse(text);
        } catch (error) {
            console.error('❌ Gemini Flashcards Error:', error.message);
            throw new Error(`Failed to generate flashcards: ${error.message}`);
        }
    }
}

module.exports = AIService;
