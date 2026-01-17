// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "netflixgpt-5cc78.firebaseapp.com",
  projectId: "netflixgpt-5cc78",
  storageBucket: "netflixgpt-5cc78.firebasestorage.app",
  messagingSenderId: "263491679663",
  appId: "1:263491679663:web:a90660e827f774c7a76b5a",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


export const auth = getAuth();

