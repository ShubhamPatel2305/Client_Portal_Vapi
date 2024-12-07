import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, PhoneAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCYDkI90_NphgVFwl6DN2UMdqDFFTg0Y8w",
  authDomain: "moksh-23cc0.firebaseapp.com",
  projectId: "moksh-23cc0",
  storageBucket: "moksh-23cc0.appspot.com",
  messagingSenderId: "910818343041",
  appId: "1:910818343041:web:edcae570e5373cc135b580",
  measurementId: "G-39TPB86E7Q"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export const phoneProvider = new PhoneAuthProvider(auth);
