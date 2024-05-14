import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zwaikffsydhvwjxioewc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3YWlrZmZzeWRodndqeGlvZXdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTEzNzQ4NjUsImV4cCI6MjAyNjk1MDg2NX0.4I-MRGLIB6_q0B68QceirHxiKc3oU2sMg8PywH4hD80'
const supabase = createClient(supabaseUrl, supabaseKey);
export default supabase;
