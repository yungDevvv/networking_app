// lib/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://arzprbxlhvfnbwpztmpo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFyenByYnhsaHZmbmJ3cHp0bXBvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjM0NzQzODAsImV4cCI6MjAzOTA1MDM4MH0.JiuoFQDa1VMgIQLQklWkkfMj9wsrMUP3cYQ-SWVbJ3g';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
