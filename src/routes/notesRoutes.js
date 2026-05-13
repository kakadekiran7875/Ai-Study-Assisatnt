const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    uploadNote,
    getNotes,
    deleteNote,
} = require('../controllers/notesController');

// All notes routes require authentication
router.use(protect);

router.post('/', uploadNote);
router.get('/', getNotes);
router.delete('/:id', deleteNote);

module.exports = router;
