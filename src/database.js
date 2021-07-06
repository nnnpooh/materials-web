require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

//const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYyNTIwNzI1MiwiZXhwIjoxOTQwNzgzMjUyfQ.PtV3JxOK73xxZ41446OZU_2PWU613WMyrNHeMCJuWJE';
//const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseUrl = 'https://scneolfmptlydobuvlkh.supabase.co';
//console.log({ supabaseKey, supabaseUrl });

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
