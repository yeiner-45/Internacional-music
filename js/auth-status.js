import { auth } from './firebase-config.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js';

onAuthStateChanged(auth, (user) => {
  const path = window.location.pathname;
  const isLoginPage = path.endsWith('/admin/login.html') || path.endsWith('/login.html');
  const isDashboardPage = path.endsWith('/admin/dashboard.html') || path.endsWith('/dashboard.html');

  if (user && isLoginPage) {
    window.location.href = '/admin/dashboard.html';
    return;
  }

  if (!user && isDashboardPage) {
    window.location.href = '/admin/login.html';
  }
});