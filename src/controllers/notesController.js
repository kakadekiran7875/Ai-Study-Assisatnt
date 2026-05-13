const { supabase } = require('../config/supabase');

/**
 * @desc    Upload new study note (PDF)
 * @route   POST /api/notes
 * @access  Private (Teacher/Admin only via RLS)
 */
const uploadNote = async (req, res, next) => {
    try {
        const { title, subject, pdfUrl, fileSize } = req.body;

        if (!title || !subject || !pdfUrl) {
            return res.status(400).json({
                success: false,
                message: 'Please provide title, subject and PDF URL',
            });
        }

        const { data, error } = await supabase
            .from('notes')
            .insert([{
                title,
                subject,
                pdf_url: pdfUrl,
                file_size: fileSize,
                uploaded_by: req.user.id
            }])
            .select()
            .single();

        if (error) throw error;

        res.status(201).json({
            success: true,
            message: 'Note uploaded successfully',
            data,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get all notes with search and filtering
 * @route   GET /api/notes
 * @access  Private
 */
const getNotes = async (req, res, next) => {
    try {
        const { search, subject, page = 1, limit = 10 } = req.query;
        
        let query = supabase.from('notes').select('*', { count: 'exact' });

        if (search) {
            query = query.textSearch('title', search);
        }

        if (subject) {
            query = query.eq('subject', subject);
        }

        const from = (page - 1) * limit;
        const to = from + limit - 1;

        const { data, error, count } = await query
            .order('created_at', { ascending: false })
            .range(from, to);

        if (error) throw error;

        res.status(200).json({
            success: true,
            count,
            page: parseInt(page),
            totalPages: Math.ceil(count / limit),
            data,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete a note
 * @route   DELETE /api/notes/:id
 * @access  Private
 */
const deleteNote = async (req, res, next) => {
    try {
        const { id } = req.params;

        const { error } = await supabase
            .from('notes')
            .delete()
            .eq('id', id);

        if (error) throw error;

        res.status(200).json({
            success: true,
            message: 'Note deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    uploadNote,
    getNotes,
    deleteNote,
};
