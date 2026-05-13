const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    createReminder,
    getReminders,
    updateReminder,
    deleteReminder,
} = require('../controllers/reminderController');

// All reminder routes require authentication
router.use(protect);

router.post('/', createReminder);
router.get('/', getReminders);
router.put('/:id', updateReminder);
router.delete('/:id', deleteReminder);

module.exports = router;
