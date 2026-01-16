import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBBoEUS6PWYh3J2PDAYS45Z_Eh3McRl7VI",
  authDomain: "bryonbowersorg.firebaseapp.com",
  projectId: "bryonbowersorg",
  storageBucket: "bryonbowersorg.firebasestorage.app",
  messagingSenderId: "274423475827",
  appId: "1:274423475827:web:347893eb3c867b31b08406",
  measurementId: "G-LN981BVFG3"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export default app;