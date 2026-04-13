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

  // Redirect authenticated admin users away from login page
  if (user && isLoginPage) {
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
    window.location.href = 'login.html';
    return;
  }
});