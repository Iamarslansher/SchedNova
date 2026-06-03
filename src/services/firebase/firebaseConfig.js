import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDwrEbmMC5JrJxA_XUSn_lKGc7JpR5RsUA",
  authDomain: "schednova-aa4f5.firebaseapp.com",
  projectId: "schednova-aa4f5",
  storageBucket: "schednova-aa4f5.firebasestorage.app",
  messagingSenderId: "279000356316",
  appId: "1:279000356316:web:630bb2c16a40985b52ab19",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
