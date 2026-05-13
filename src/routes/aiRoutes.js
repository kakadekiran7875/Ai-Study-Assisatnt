const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    generateNotes,
    generateQuiz,
    summarizeContent,
    chat,
    getChatHistory,
    extractTextFromImage,
    generateFlashcards,
} = require('../controllers/aiController');

// All AI routes require authentication
router.use(protect);

/**
 * @route   POST /api/ai/generate-notes
 * @desc    Generate study notes from text content
 * @access  Private
 * @body    { content: string, subject?: string }
 */
router.post('/generate-notes', generateNotes);

/**
 * @route   POST /api/ai/generate-quiz
 * @desc    Generate quiz questions from content
 * @access  Private
 * @body    { content: string, questionCount?: number, difficulty?: string }
 */
router.post('/generate-quiz', generateQuiz);

/**
 * @route   POST /api/ai/summarize
 * @desc    Summarize long text content
 * @access  Private
 * @body    { content: string, maxLength?: number }
 */
router.post('/summarize', summarizeContent);

/**
 * @route   POST /api/ai/chat
 * @desc    Chat with AI study assistant
 * @access  Private
 * @body    { message: string, conversationHistory?: array }
 */
router.post('/chat', chat);

/**
 * @route   GET /api/ai/chat/history
 * @desc    Get chat history
 * @access  Private
 */
router.get('/chat/history', getChatHistory);

/**
 * @route   POST /api/ai/extract-text
 * @desc    Extract text from image (OCR)
 * @access  Private
 * @body    { imageUrl: string }
 */
router.post('/extract-text', extractTextFromImage);

/**
 * @route   POST /api/ai/generate-flashcards
 * @desc    Generate flashcards from content
 * @access  Private
 * @body    { content: string, cardCount?: number }
 */
router.post('/generate-flashcards', generateFlashcards);

module.exports = router;
