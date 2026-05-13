const { supabase, getIsConnected } = require('../config/supabase');
const bcrypt = require('bcryptjs');

// In-memory store for Demo Mode
const demoUsers = new Map();

/**
 * User Model - Supabase Implementation with Demo Mode Fallback
 */
class User {
    static get isDemoMode() { return !getIsConnected(); }

    /**
     * Create a new user
     */
    static async create(userData) {
        try {
            // Hash password if provided
            if (userData.password) {
                const salt = await bcrypt.genSalt(10);
                userData.password = await bcrypt.hash(userData.password, salt);
            }

            const dbData = {
                id: userData.id || Math.random().toString(36).substring(2, 11),
                name: userData.name,
                email: userData.email.toLowerCase().trim(),
                password: userData.password || null,
                login_type: userData.loginType || 'email',
                role: userData.role || 'user',
                google_id: userData.googleId || null,
                mobile_number: userData.mobileNumber || null,
                college: userData.college || null,
                profile_photo_url: userData.profilePhotoUrl || null,
                is_email_verified: userData.isEmailVerified || false,
                last_login: new Date().toISOString(),
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };

            // Try Supabase first
            if (!this.isDemoMode) {
                try {
                    const { data, error } = await supabase
                        .from('users')
                        .insert([{
                            name: dbData.name,
                            email: dbData.email,
                            password: dbData.password,
                            login_type: dbData.login_type,
                            role: dbData.role,
                            google_id: dbData.google_id,
                            mobile_number: dbData.mobile_number,
                            college: dbData.college,
                            profile_photo_url: dbData.profile_photo_url,
                            is_email_verified: dbData.is_email_verified,
                            last_login: dbData.last_login
                        }])
                        .select()
                        .single();

                    if (error) throw error;
                    return User._formatUser(data);
                } catch (error) {
                    console.log('🔄 Supabase failed, falling back to Demo Mode for this request');
                }
            }

            // Demo Mode Fallback
            demoUsers.set(dbData.email, dbData);
            return User._formatUser(dbData);

        } catch (error) {
            if (error.code === '23505') throw new Error('Email already registered');
            throw error;
        }
    }

    /**
     * Find user by email
     */
    static async findOne(query) {
        try {
            if (!this.isDemoMode) {
                try {
                    let supabaseQuery = supabase.from('users').select('*');
                    if (query.email) supabaseQuery = supabaseQuery.eq('email', query.email.toLowerCase().trim());
                    if (query.googleId) supabaseQuery = supabaseQuery.eq('google_id', query.googleId);

                    const { data, error } = await supabaseQuery.single();
                    if (!error && data) return User._formatUser(data);
                } catch (e) {}
            }

            // Demo Mode Fallback
            if (query.email) {
                const user = demoUsers.get(query.email.toLowerCase().trim());
                if (user) return User._formatUser(user);
                
                // Allow "test@test.com" as a default demo user
                if (query.email === 'test@test.com') {
                    const mockUser = {
                        id: 'demo-id-123',
                        name: 'Demo User',
                        email: 'test@test.com',
                        password: await bcrypt.hash('test123', 10),
                        login_type: 'email',
                        role: 'user'
                    };
                    demoUsers.set(mockUser.email, mockUser);
                    return User._formatUser(mockUser);
                }
            }
            return null;
        } catch (error) {
            return null;
        }
    }

    /**
     * Find user by ID
     */
    static async findById(id) {
        try {
            if (!this.isDemoMode) {
                try {
                    const { data, error } = await supabase.from('users').select('*').eq('id', id).single();
                    if (!error && data) return User._formatUser(data);
                } catch (e) {}
            }

            // Demo Mode Fallback
            for (const user of demoUsers.values()) {
                if (user.id === id) return User._formatUser(user);
            }
            return null;
        } catch (error) {
            return null;
        }
    }

    /**
     * Update user
     */
    static async update(id, updates) {
        try {
            if (!this.isDemoMode) {
                try {
                    const dbUpdates = {};
                    if (updates.name !== undefined) dbUpdates.name = updates.name;
                    if (updates.email !== undefined) dbUpdates.email = updates.email.toLowerCase().trim();
                    if (updates.password !== undefined) {
                        const salt = await bcrypt.genSalt(10);
                        dbUpdates.password = await bcrypt.hash(updates.password, salt);
                    }
                    if (updates.refreshToken !== undefined) dbUpdates.refresh_token = updates.refreshToken;
                    if (updates.mobile_number !== undefined) dbUpdates.mobile_number = updates.mobile_number;
                    if (updates.college !== undefined) dbUpdates.college = updates.college;
                    if (updates.profile_photo_url !== undefined) dbUpdates.profile_photo_url = updates.profile_photo_url;
                    if (updates.role !== undefined) dbUpdates.role = updates.role;

                    const { data, error } = await supabase.from('users').update(dbUpdates).eq('id', id).select().single();
                    if (!error && data) return User._formatUser(data);
                } catch (e) {}
            }

            // Demo Mode Fallback
            let user;
            for (const u of demoUsers.values()) {
                if (u.id === id) { user = u; break; }
            }
            if (user) {
                Object.assign(user, updates);
                user.updated_at = new Date().toISOString();
                return User._formatUser(user);
            }
            return null;
        } catch (error) {
            throw error;
        }
    }

    static async comparePassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }

    static _formatUser(dbUser) {
        if (!dbUser) return null;
        const user = {
            id: dbUser.id || dbUser._id,
            name: dbUser.name,
            email: dbUser.email,
            password: dbUser.password,
            loginType: dbUser.login_type || dbUser.loginType,
            role: dbUser.role,
            mobileNumber: dbUser.mobile_number,
            college: dbUser.college,
            profilePhotoUrl: dbUser.profile_photo_url,
            toJSON() {
                const u = { ...this };
                delete u.password;
                return u;
            },
            async comparePassword(candidatePassword) {
                return await User.comparePassword(candidatePassword, this.password);
            }
        };
        return user;
    }
}

module.exports = User;
