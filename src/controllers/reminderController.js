const { supabase } = require('../config/supabase');

/**
 * @desc    Create a new reminder
 * @route   POST /api/reminders
 * @access  Private
 */
const createReminder = async (req, res, next) => {
    try {
        const { title, message, reminderTime, type } = req.body;

        if (!title || !reminderTime) {
            return res.status(400).json({
                success: false,
                message: 'Please provide title and reminder time',
            });
        }

        const { data, error } = await supabase
            .from('reminders')
            .insert([{
                user_id: req.user.id,
                title,
                message,
                reminder_time: reminderTime,
                type: type || 'study'
            }])
            .select()
            .single();

        if (error) throw error;

        res.status(201).json({
            success: true,
            message: 'Reminder created successfully',
            data,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get all user reminders
 * @route   GET /api/reminders
 * @access  Private
 */
const getReminders = async (req, res, next) => {
    try {
        const { data, error } = await supabase
            .from('reminders')
            .select('*')
            .eq('user_id', req.user.id)
            .order('reminder_time', { ascending: true });

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
 * @desc    Update reminder (mark as completed, etc.)
 * @route   PUT /api/reminders/:id
 * @access  Private
 */
const updateReminder = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const { data, error } = await supabase
            .from('reminders')
            .update(updates)
            .eq('id', id)
            .eq('user_id', req.user.id) // Security check
            .select()
            .single();

        if (error) throw error;

        res.status(200).json({
            success: true,
            message: 'Reminder updated successfully',
            data,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete reminder
 * @route   DELETE /api/reminders/:id
 * @access  Private
 */
const deleteReminder = async (req, res, next) => {
    try {
        const { id } = req.params;

        const { error } = await supabase
            .from('reminders')
            .delete()
            .eq('id', id)
            .eq('user_id', req.user.id);

        if (error) throw error;

        res.status(200).json({
            success: true,
            message: 'Reminder deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createReminder,
    getReminders,
    updateReminder,
    deleteReminder,
};
