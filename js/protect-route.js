import { auth } from './firebase-config.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js';

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = '/admin/login.html';
  }
});
