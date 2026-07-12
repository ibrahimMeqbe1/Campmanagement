import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// إعدادات Firebase الافتراضية
// يمكن للمستخدم استبدال هذه القيم ببيانات مشروعه الفعلية في Firebase Console
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "PLACEHOLDER_API_KEY",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "kareem-camp.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "kareem-camp",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "kareem-camp.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "1234567890",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:1234567890:web:1234567890"
};

// التحقق مما إذا كانت الإعدادات تجريبية أو حقيقية
export const isDemoMode = 
  !firebaseConfig.apiKey || 
  firebaseConfig.apiKey === "PLACEHOLDER_API_KEY" || 
  firebaseConfig.apiKey.includes("PLACEHOLDER") ||
  firebaseConfig.apiKey === "YOUR_API_KEY" ||
  firebaseConfig.apiKey.startsWith("YOUR_");

let app;
let auth = null;
let db = null;

if (!isDemoMode) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    console.log("Firebase initialized successfully.");
  } catch (error) {
    console.error("Firebase initialization failed, falling back to Demo Mode:", error);
    // Force demo mode on initialization error
    window.isDemoModeForced = true;
  }
} else {
  console.log("Running in Demo Mode (Local Storage). Set Firebase credentials to connect to live Firestore.");
}

export { auth, db };
