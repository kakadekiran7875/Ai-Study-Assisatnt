const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    markAttendance,
    getAttendanceHistory,
} = require('../controllers/attendanceController');

// All attendance routes require authentication
router.use(protect);

router.post('/', markAttendance);
router.get('/', getAttendanceHistory);

module.exports = router;
