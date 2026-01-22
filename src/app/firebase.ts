import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBieJCaCRDBD5azeu_LE58j_SNM_jDo2O8",
  authDomain: "bayr-mgmt-leads.firebaseapp.com",
  projectId: "bayr-mgmt-leads",
  storageBucket: "bayr-mgmt-leads.firebasestorage.app",
  messagingSenderId: "102431101337",
  appId: "1:102431101337:web:0a3345b5b0b81bf8938308"
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);