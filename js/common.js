/**
 * COMMON.JS - Shared functions across all pages
 * Contains: 
 * - Supabase initialization
 * - School/campus selection logic
 * - Any other utilities used on multiple pages
 */

// Initialize Supabase client
const supabaseUrl = 'https://sdsssbkowuhxdcmjwtia.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkc3NzYmtvd3VoeGRjbWp3dGlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwMzU4ODksImV4cCI6MjA5MTYxMTg4OX0.3Nc6NDSnXw7M1uTgh_XnYbsuung2hF2BSWwXEWjflQo';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);


