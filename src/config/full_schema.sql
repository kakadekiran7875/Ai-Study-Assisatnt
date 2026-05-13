-- ==========================================
-- 🚀 Smart Study AI - Complete Database Schema
-- ==========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 1. USER MANAGEMENT & PROFILES
-- ==========================================

-- Create users table (Base Auth Data)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    mobile_number VARCHAR(20),
    college VARCHAR(200),
    profile_photo_url TEXT,
    role VARCHAR(20) NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin')),
    login_type VARCHAR(20) DEFAULT 'email',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Profiles for specific roles
CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    enrollment_no VARCHAR(50),
    department VARCHAR(100),
    semester INTEGER
);

CREATE TABLE IF NOT EXISTS teachers (
    id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    employee_id VARCHAR(50),
    department VARCHAR(100),
    designation VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS admins (
    id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    access_level INTEGER DEFAULT 1
);

-- ==========================================
-- 2. AI CHAT SYSTEM
-- ==========================================

CREATE TABLE IF NOT EXISTS ai_chats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    subject VARCHAR(100),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 3. PDF NOTES SYSTEM
-- ==========================================

CREATE TABLE IF NOT EXISTS notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    pdf_url TEXT NOT NULL,
    uploaded_by UUID REFERENCES users(id),
    file_size INTEGER, -- in bytes
    search_vector tsvector, -- for optimized search
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 4. SMART REMINDERS & NOTIFICATIONS
-- ==========================================

CREATE TABLE IF NOT EXISTS reminders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    message TEXT,
    reminder_time TIMESTAMP WITH TIME ZONE NOT NULL,
    type VARCHAR(20) DEFAULT 'study' CHECK (type IN ('study', 'exam', 'task')),
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 5. FACE ATTENDANCE SYSTEM
-- ==========================================

CREATE TABLE IF NOT EXISTS attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES users(id) ON DELETE CASCADE,
    face_image_url TEXT NOT NULL,
    date DATE DEFAULT CURRENT_DATE,
    time TIME DEFAULT CURRENT_TIME,
    status VARCHAR(20) DEFAULT 'present' CHECK (status IN ('present', 'absent', 'late')),
    location_lat DECIMAL(10, 8),
    location_lng DECIMAL(11, 8)
);

-- ==========================================
-- 6. ADMIN & ANALYTICS
-- ==========================================

CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 7. INDEXES & PERFORMANCE
-- ==========================================

-- Optimized search for notes
CREATE INDEX IF NOT EXISTS idx_notes_search ON notes USING GIN(to_tsvector('english', title || ' ' || subject));
CREATE INDEX IF NOT EXISTS idx_ai_chats_user ON ai_chats(user_id);
CREATE INDEX IF NOT EXISTS idx_attendance_student_date ON attendance(student_id, date);
CREATE INDEX IF NOT EXISTS idx_reminders_user_time ON reminders(user_id, reminder_time);

-- ==========================================
-- 8. ROW LEVEL SECURITY (RLS)
-- ==========================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

-- 🛡️ Users Policies
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- 🛡️ AI Chat Policies
CREATE POLICY "Users can manage own chats" ON ai_chats 
    FOR ALL USING (auth.uid() = user_id);

-- 🛡️ Notes Policies
CREATE POLICY "Everyone can view notes" ON notes FOR SELECT USING (true);
CREATE POLICY "Teachers/Admins can upload notes" ON notes 
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role IN ('teacher', 'admin')
        )
    );

-- 🛡️ Reminders Policies
CREATE POLICY "Users can manage own reminders" ON reminders 
    FOR ALL USING (auth.uid() = user_id);

-- 🛡️ Attendance Policies
CREATE POLICY "Students can view own attendance" ON attendance 
    FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Teachers can view all attendance" ON attendance 
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role IN ('teacher', 'admin')
        )
    );
CREATE POLICY "Public/Auth insert attendance" ON attendance 
    FOR INSERT WITH CHECK (true); -- Usually restricted by app logic/face verification

-- ==========================================
-- 9. TRIGGERS
-- ==========================================

-- Auto-update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- Success message
DO $$ BEGIN RAISE NOTICE 'Full Database Schema Created!'; END $$;

-- ==========================================
-- 10. ENABLE REALTIME
-- ==========================================

-- Enable realtime for specific tables
ALTER PUBLICATION supabase_realtime ADD TABLE ai_chats;
ALTER PUBLICATION supabase_realtime ADD TABLE reminders;
ALTER PUBLICATION supabase_realtime ADD TABLE attendance;
ALTER PUBLICATION supabase_realtime ADD TABLE notes;
