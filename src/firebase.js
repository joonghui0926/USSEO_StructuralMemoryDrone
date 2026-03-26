// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCef1Z3MVYhwQ7W5bdbmxLRqcY4yWFkU8o",
  authDomain: "structural-memory-drone.firebaseapp.com",
  projectId: "structural-memory-drone",
  storageBucket: "structural-memory-drone.firebasestorage.app",
  messagingSenderId: "235605357981",
  appId: "1:235605357981:web:8ef699e9893827e4792b74"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);