// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDFRsVVTWS9E1LluwHI9RjVEBwjBIFxYBs",
  authDomain: "helden-ef55f.firebaseapp.com",
  projectId: "helden-ef55f",
  storageBucket: "helden-ef55f.appspot.com",
  messagingSenderId: "519211689980",
  appId: "1:519211689980:web:8bb700aeba8ecb6a597479",
  measurementId: "G-EFRGJF0H2X"
};

// Initialize Firebase
const app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

// Export the Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
