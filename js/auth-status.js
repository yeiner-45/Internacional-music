import { auth } from './firebase-config.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/12.12.0/firebase-auth.js';

/**
 * Monitor authentication state changes
 * Redirect users based on their authentication status
 */
onAuthStateChanged(auth, (user) => {
  const path = window.location.pathname;
  const isLoginPage = path.endsWith('/admin/login.html') || path.endsWith('/login.html');
  const isDashboardPage = path.endsWith('/admin/dashboard.html') || path.endsWith('/dashboard.html');

  // Redirect authenticated users away from login page
  if (user && isLoginPage) {
    window.location.href = '/admin/dashboard.html';
    return;
  }

  // Redirect unauthenticated users to login page
  if (!user && isDashboardPage) {
    window.location.href = '/admin/login.html';
  }
});