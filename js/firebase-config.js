import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/12.12.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/12.12.0/firebase-storage.js';

// Firebase configuration - NEW PROJECT
const firebaseConfig = {
  apiKey: "AIzaSyC1sb7sBjHBWDRqVDCLiTo9Yik8ZRqlLkc",
  authDomain: "internacionalmusic-web.firebaseapp.com",
  projectId: "internacionalmusic-web",
  storageBucket: "internacionalmusic-web.firebasestorage.app",
  messagingSenderId: "675305364253",
  appId: "1:675305364253:web:471fa04d638758dbd41ff4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
