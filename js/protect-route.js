import { auth } from './firebase-config.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/12.12.0/firebase-auth.js';

/**
 * Protect routes from unauthorized access
 * Redirect unauthenticated users to login page
 */
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = '/admin/login.html';
  }
});
