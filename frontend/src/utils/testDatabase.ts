import { supabase } from '@/integrations/supabase/client';

export const testDatabaseSetup = async () => {
  try {
    // Test if the table exists
    const { data: tableTest, error: tableError } = await supabase
      .from('user_api_tokens')
      .select('count')
      .limit(1);

    if (tableError) {
      console.error('❌ Table test failed:', tableError.message);
      return false;
    }

    // Test if the function exists
    const { data: functionTest, error: functionError } = await supabase
      .rpc('generate_api_token', { token_name: 'test' });

    if (functionError) {
      console.error('❌ Function test failed:', functionError.message);
      return false;
    }

    console.log('✅ Database setup is complete!');
    return true;
  } catch (error) {
    console.error('❌ Database test failed:', error);
    return false;
  }
};