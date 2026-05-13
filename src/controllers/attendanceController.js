const { supabase } = require('../config/supabase');

/**
 * @desc    Mark attendance with face image
 * @route   POST /api/attendance
 * @access  Private (Student)
 */
const markAttendance = async (req, res, next) => {
    try {
        const { faceImageUrl, lat, lng } = req.body;

        if (!faceImageUrl) {
            return res.status(400).json({
                success: false,
                message: 'Face image URL is required',
            });
        }

        const { data, error } = await supabase
            .from('attendance')
            .insert([{
                student_id: req.user.id,
                face_image_url: faceImageUrl,
                location_lat: lat,
                location_lng: lng,
                status: 'present'
            }])
            .select()
            .single();

        if (error) throw error;

        res.status(201).json({
            success: true,
            message: 'Attendance marked successfully',
            data,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get attendance history
 * @route   GET /api/attendance
 * @access  Private
 */
const getAttendanceHistory = async (req, res, next) => {
    try {
        const { studentId, startDate, endDate } = req.query;
        
        let query = supabase.from('attendance').select('*, students(name)');

        // Filter by student (Teachers see all or specific, students see only own)
        if (req.user.role === 'student') {
            query = query.eq('student_id', req.user.id);
        } else if (studentId) {
            query = query.eq('student_id', studentId);
        }

        if (startDate) query = query.gte('date', startDate);
        if (endDate) query = query.lte('date', endDate);

        const { data, error } = await query.order('date', { ascending: false });

        if (error) throw error;

        res.status(200).json({
            success: true,
            data,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    markAttendance,
    getAttendanceHistory,
};
