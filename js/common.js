/**
 * COMMON.JS - Shared functions across all pages
 * Contains: 
 * - Supabase initialization
 * - School/campus selection logic
 * - Any other utilities used on multiple pages
 */

// Initialize Supabase client
const supabaseUrl = 'https://ocxdhyyaicractrkpihm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jeGRoeXlhaWNyYWN0cmtwaWhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5MTQ1NjAsImV4cCI6MjA2NzQ5MDU2MH0.1Ki8gLSW2f3Y6Gecy3RgWid7H92rWPEOF8BvTHy6fKo';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);


