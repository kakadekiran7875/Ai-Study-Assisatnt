require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Error: SUPABASE_URL or SUPABASE_ANON_KEY missing in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
    console.log(`🔍 Testing connection to: ${supabaseUrl}`);
    
    try {
        // 1. Try to select from 'users' table
        console.log('📡 Fetching from "users" table...');
        const { data: selectData, error: selectError } = await supabase
            .from('users')
            .select('*')
            .limit(1);

        if (selectError) {
            console.error('❌ Select Error:', selectError.message);
            if (selectError.code === 'PGRST116') {
                console.log('💡 Note: Table "users" might not exist yet.');
            }
        } else {
            console.log('✅ Select Successful! Found:', selectData.length, 'users');
        }

        // 2. Try to add a test user
        const testEmail = `test_${Date.now()}@example.com`;
        console.log(`📝 Attempting to add test user: ${testEmail}`);
        
        const { data: insertData, error: insertError } = await supabase
            .from('users')
            .insert([
                { 
                    name: 'Test Connection User', 
                    email: testEmail,
                    login_type: 'email',
                    role: 'user'
                }
            ])
            .select();

        if (insertError) {
            console.error('❌ Insert Error:', insertError.message);
            console.error('Error details:', insertError);
        } else {
            console.log('✅ Insert Successful! Added user:', insertData[0].email);
            
            // 3. Clean up (Optional, but let's keep it for now so the user sees data was added)
            console.log('ℹ️ Test user remains in database for your verification.');
        }

    } catch (err) {
        console.error('💥 Unexpected Error:', err.message);
    }
}

testConnection();
