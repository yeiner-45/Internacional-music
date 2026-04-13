import { auth } from './firebase-config.js';
import { signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/12.12.0/firebase-auth.js';

/**
 * Email and Password Login
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise} Firebase auth response
 */
export async function login(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw new Error(error.message);
  }
}