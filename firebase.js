import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBxI7XEPQVVfuBD0oiW1Zz47oc7z0-W64w",
  authDomain: "fir-config-9c0c3.firebaseapp.com",
  projectId: "fir-config-9c0c3",
  storageBucket: "fir-config-9c0c3.firebasestorage.app",
  messagingSenderId: "124670051359",
  appId: "1:124670051359:web:755de3cdcd38b5bda6012a"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
