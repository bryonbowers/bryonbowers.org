import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  // Replace with your actual Firebase config from the console
  apiKey: "your-actual-api-key",
  authDomain: "bryonbowersorg.firebaseapp.com",
  projectId: "bryonbowersorg",
  storageBucket: "bryonbowersorg.appspot.com",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

export default app;