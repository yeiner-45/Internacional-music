import { auth } from './firebase-config.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/12.12.0/firebase-auth.js';

/**
 * Monitor authentication state changes
 * Redirect users based on their authentication status and routes
 */
onAuthStateChanged(auth, (user) => {
  const path = window.location.pathname;
  const hostname = window.location.hostname;

  // Detect different admin routes
  const isLoginPage = path.endsWith('/login.html') || path.endsWith('/login') ||
                     path === '/' + hostname + '/login' || path === '/login';
  const isDashboardPage = path.endsWith('/admin/dashboard.html') || path.endsWith('/dashboard.html') ||
                         path.includes('/admin/');
  const isAdminRoute = path.includes('/admin') || path === '/admin';

  // Handle legacy ?admin=true parameter - redirect to secure login
  const searchParams = new URLSearchParams(window.location.search);
  if (searchParams.has('admin') && searchParams.get('admin') === 'true' && !isLoginPage) {
    console.log('[Auth] Detected legacy ?admin=true - redirecting to secure login');
    // Clean URL and redirect
    const url = new URL(window.location);
    url.searchParams.delete('admin');
    window.history.replaceState({}, '', url.pathname);
    window.location.href = 'login.html';
    return;
  }

  // Redirect authenticated admin users away from login page
  if (user && user.email === 'mezayeiner66@gmail.com' && isLoginPage) {
    console.log('[Auth] Admin user authenticated - redirecting to dashboard');
    window.location.href = 'admin/dashboard.html';
    return;
  }

  // Redirect unauthenticated users trying to access admin area
  if (!user && (isDashboardPage || isAdminRoute)) {
    window.location.href = 'login.html';
    return;
  }

  // Handle direct access to /admin
  if (!user && path === '/admin') {
    console.log('[Auth] Direct access to /admin - redirecting to login');
    window.location.href = 'login.html';
    return;
  }

  // Log authentication state for debugging
  if (user) {
    console.log('[Auth] User authenticated:', user.email);
  } else {
    console.log('[Auth] User not authenticated');
  }
});