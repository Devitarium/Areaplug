/**
 * COMMON.JS - Shared functions across all pages
 * Contains: 
 * - Supabase initialization
 * - Any other utilities used on multiple pages
 */

// Initialize Supabase client
const supabaseUrl = 'https://sdsssbkowuhxdcmjwtia.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkc3NzYmtvd3VoeGRjbWp3dGlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwMzU4ODksImV4cCI6MjA5MTYxMTg4OX0.3Nc6NDSnXw7M1uTgh_XnYbsuung2hF2BSWwXEWjflQo';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);


//   // Back to Top Button
//   const backToTopBtn = document.getElementById('back-to-top');
//   if (backToTopBtn) {
//     window.addEventListener('scroll', function() {
//       backToTopBtn.classList.toggle('visible', window.pageYOffset > 300);
//     });
//     backToTopBtn.addEventListener('click', function(e) {
//       e.preventDefault();
//       window.scrollTo({ top: 0, behavior: 'smooth' });
//     });
//   }