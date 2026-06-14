import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Firebase configuration using Vite environment variables.
// Fallback dummy values are provided for local development/simulation mode.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "dummy-firebase-api-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "omma-auth.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "omma-auth",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "omma-auth.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "000000000000",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:000000000000:web:0000000000000000000000"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export Auth service
export const auth = getAuth(app);
export default app;
