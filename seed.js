const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const bcrypt = require('bcryptjs');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Error: SUPABASE_URL or SUPABASE_ANON_KEY not found in .env file');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
    console.log('🚀 Starting database seeding...');

    try {
        // 1. Create a Demo User
        const demoEmail = 'test@test.com';
        const demoPassword = 'test123';
        const hashedPassword = await bcrypt.hash(demoPassword, 10);

        console.log(`👤 Creating demo user: ${demoEmail}`);

        const { data: existingUser, error: findError } = await supabase
            .from('users')
            .select('id')
            .eq('email', demoEmail)
            .single();

        if (existingUser) {
            console.log('✅ Demo user already exists.');
        } else {
            const { error: insertError } = await supabase
                .from('users')
                .insert([{
                    name: 'Demo Student',
                    email: demoEmail,
                    password: hashedPassword,
                    login_type: 'email',
                    role: 'user',
                    is_email_verified: true
                }]);

            if (insertError) {
                if (insertError.code === 'PGRST116' || insertError.message.includes('not found')) {
                    console.error('❌ Error: The "users" table does not exist in your Supabase database.');
                    console.log('📝 Please run the SQL in src/config/schema.sql in your Supabase SQL Editor first.');
                } else {
                    throw insertError;
                }
            } else {
                console.log('✅ Demo user created successfully!');
            }
        }

        console.log('\n✨ Seeding complete!');
        console.log('--------------------------------------------------');
        console.log('Credentials for testing:');
        console.log(`📧 Email: ${demoEmail}`);
        console.log(`🔑 Password: ${demoPassword}`);
        console.log('--------------------------------------------------');

    } catch (error) {
        console.error('❌ Seeding failed:', error.message);
    }
}

seed();
