const AIService = require('../services/aiService');
const { supabase } = require('../config/supabase');

/**
 * @desc    Generate notes from text content
 * @route   POST /api/ai/generate-notes
 * @access  Private
 */
const generateNotes = async (req, res, next) => {
    try {
        const { content, subject } = req.body;

        if (!content) {
            return res.status(400).json({
                success: false,
                message: 'Content is required',
            });
        }

        const notes = await AIService.generateNotes(content, subject);

        res.status(200).json({
            success: true,
            message: 'Notes generated successfully',
            data: notes,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Generate quiz from content
 * @route   POST /api/ai/generate-quiz
 * @access  Private
 */
const generateQuiz = async (req, res, next) => {
    try {
        const { content, questionCount = 5, difficulty = 'medium' } = req.body;

        if (!content) {
            return res.status(400).json({
                success: false,
                message: 'Content is required',
            });
        }

        const quiz = await AIService.generateQuiz(content, questionCount, difficulty);

        res.status(200).json({
            success: true,
            message: 'Quiz generated successfully',
            data: quiz,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Summarize content
 * @route   POST /api/ai/summarize
 * @access  Private
 */
const summarizeContent = async (req, res, next) => {
    try {
        const { content, maxLength = 200 } = req.body;

        if (!content) {
            return res.status(400).json({
                success: false,
                message: 'Content is required',
            });
        }

        const summary = await AIService.summarizeContent(content, maxLength);

        res.status(200).json({
            success: true,
            message: 'Content summarized successfully',
            data: { summary },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Chat with AI assistant
 * @route   POST /api/ai/chat
 * @access  Private
 */
const chat = async (req, res, next) => {
    try {
        const { message, conversationHistory = [] } = req.body;

        if (!message) {
            return res.status(400).json({
                success: false,
                message: 'Message is required',
            });
        }

        const response = await AIService.chat(message, conversationHistory);

        // Save to database (asynchronously)
        supabase.from('ai_chats').insert([{
            user_id: req.user.id,
            question: message,
            answer: response,
            timestamp: new Date().toISOString()
        }]).then(({ error }) => {
            if (error) console.error('❌ Failed to save chat history:', error.message);
        });

        res.status(200).json({
            success: true,
            message: 'AI response generated',
            data: { response },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get chat history
 * @route   GET /api/ai/chat/history
 * @access  Private
 */
const getChatHistory = async (req, res, next) => {
    try {
        const { data, error } = await supabase
            .from('ai_chats')
            .select('*')
            .eq('user_id', req.user.id)
            .order('timestamp', { ascending: false });

        if (error) throw error;

        res.status(200).json({
            success: true,
            data,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Extract text from image
 * @route   POST /api/ai/extract-text
 * @access  Private
 */
const extractTextFromImage = async (req, res, next) => {
    try {
        const { imageUrl } = req.body;

        if (!imageUrl) {
            return res.status(400).json({
                success: false,
                message: 'Image URL is required',
            });
        }

        const result = await AIService.extractTextFromImage(imageUrl);

        res.status(200).json({
            success: true,
            message: 'Text extracted successfully',
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Generate flashcards from content
 * @route   POST /api/ai/generate-flashcards
 * @access  Private
 */
const generateFlashcards = async (req, res, next) => {
    try {
        const { content, cardCount = 10 } = req.body;

        if (!content) {
            return res.status(400).json({
                success: false,
                message: 'Content is required',
            });
        }

        const flashcards = await AIService.generateFlashcards(content, cardCount);

        res.status(200).json({
            success: true,
            message: 'Flashcards generated successfully',
            data: flashcards,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    generateNotes,
    generateQuiz,
    summarizeContent,
    chat,
    getChatHistory,
    extractTextFromImage,
    generateFlashcards,
};
