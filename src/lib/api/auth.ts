import { auth } from '../config/firebase';
import { 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword
} from 'firebase/auth';

export const authApi = {
  signIn: async (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  },

  signUp: async (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password);
  },

  signOut: async () => {
    return firebaseSignOut(auth);
  }
};