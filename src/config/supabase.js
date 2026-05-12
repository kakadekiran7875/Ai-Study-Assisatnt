const { createClient } = require('@supabase/supabase-js');

/**
 * Initialize Supabase client
 */
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.warn('⚠️  Supabase credentials not found in environment variables');
    console.log('📝 To use Supabase:');
    console.log('   1. Create a project at https://supabase.com');
    console.log('   2. Get your URL and anon key from project settings');
    console.log('   3. Update SUPABASE_URL and SUPABASE_ANON_KEY in .env file');
}

const supabase = createClient(supabaseUrl || '', supabaseKey || '', {
    auth: {
        autoRefreshToken: true,
        persistSession: false,
    },
});

let isConnected = false;

/**
 * Test Supabase connection
 */
const connectDatabase = async () => {
    try {
        // Test connection by querying the users table
        const { data, error } = await supabase
            .from('users')
            .select('count')
            .limit(1);

        if (error && error.code !== 'PGRST116') { // PGRST116 = table doesn't exist yet
            throw error;
        }

        isConnected = true;
        console.log(`✅ Supabase Connected: ${supabaseUrl}`);
        console.log(`📊 Database: PostgreSQL (Supabase)`);
    } catch (error) {
        isConnected = false;
        console.warn(`⚠️  Supabase Connection Failed: ${error.message}`);
        console.log(`🔄 Running in DEMO MODE (no database persistence)`);
        console.log(`📝 To use real database:`);
        console.log(`   1. Create a Supabase project: https://supabase.com`);
        console.log(`   2. Update SUPABASE_URL and SUPABASE_ANON_KEY in .env file`);
        console.log(`   3. Run the SQL schema (see src/config/schema.sql)`);
    }
};

module.exports = { supabase, connectDatabase, getIsConnected: () => isConnected };
