import { auth } from './firebase-config.js';
import { signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js';

// Login function
export async function login(email, password) {
  return await signInWithEmailAndPassword(auth, email, password);
}