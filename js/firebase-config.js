// Firebase configuration for EduMúsic leaderboards.
// Replace the placeholder with your Firebase project settings.
// Keep this file with public client values only (apiKey, authDomain, etc.).

if (typeof window !== 'undefined') {
  window.EDUMUSIC_FIREBASE_CONFIG = window.EDUMUSIC_FIREBASE_CONFIG || null;
}

// Example configuration:
//
// window.EDUMUSIC_FIREBASE_CONFIG = {
//   apiKey: 'YOUR_API_KEY',
//   authDomain: 'your-project.firebaseapp.com',
//   projectId: 'your-project-id',
//   storageBucket: 'your-project.appspot.com',
//   messagingSenderId: 'YOUR_SENDER_ID',
//   appId: 'YOUR_APP_ID',
//   measurementId: 'G-XXXXXXXXXX',
// };

  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyCnYpyoXh1PkBYaRzVVorAarJ3lQmnce-M",
    authDomain: "edumusic-f67e0.firebaseapp.com",
    projectId: "edumusic-f67e0",
    storageBucket: "edumusic-f67e0.firebasestorage.app",
    messagingSenderId: "329520868355",
    appId: "1:329520868355:web:74f996ca040133d6fbb236"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  import { initializeAppCheck, ReCaptchaV3Provider } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app-check.js';

// después de initializeApp(app)
initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider('6Lc8s_MrAAAAAClCFaOQ2yFhDubEpZ3HoklSb_vq'),
  isTokenAutoRefreshEnabled: true,
});
