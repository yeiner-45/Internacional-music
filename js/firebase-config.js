import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-storage.js';

const firebaseConfig = {
  apiKey: "AIzaSyDHk7BWXVvOg6WynA7PITw8ERGXtvrlVZ8",
  authDomain: "internacional-music-web.firebaseapp.com",
  projectId: "internacional-music-web",
  storageBucket: "internacional-music-web.firebasestorage.app",
  messagingSenderId: "945485583026",
  appId: "1:945485583026:web:b415b652ad969e98c66fab",
  measurementId: "G-052JTKBR9S"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
