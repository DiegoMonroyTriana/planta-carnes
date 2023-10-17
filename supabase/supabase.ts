import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

const supabaseUrl = 'https://oblcelozyhhyurjsoeai.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ibGNlbG96eWhoeXVyanNvZWFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTM1OTYwMjEsImV4cCI6MjAwOTE3MjAyMX0.yH3fUSeQxqvRZQ2Lni1uyiXJomjhd6-sz-DzU6jc0co';
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
