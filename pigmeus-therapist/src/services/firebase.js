import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyANk_t6li1hiWmUU4rp2dnCLw4tqkMs89g",
    authDomain: "pigmeus-therapist.firebaseapp.com",
    projectId: "pigmeus-therapist",
    storageBucket: "pigmeus-therapist.firebasestorage.app",
    messagingSenderId: "511097728792",
    appId: "1:511097728792:web:404bd6b9d1a7d9d9cbb86d",
    measurementId: "G-30GBBCGRRH"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);
export const auth = getAuth(app);