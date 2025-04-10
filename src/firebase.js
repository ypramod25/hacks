// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyC0W_JWHrBOX41kOFhaAdmPFAu8hAFA52Q",
    authDomain: "echoshieldapp.firebaseapp.com",
    projectId: "echoshieldapp",
    storageBucket: "echoshieldapp.firebasestorage.app",
    messagingSenderId: "731907378162",
    appId: "1:731907378162:web:2956f9724c9d3ba74a396b"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);