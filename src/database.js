require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
//console.log({ supabaseKey, supabaseUrl });

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
