import { create } from 'zustand';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithPhoneNumber,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  ApplicationVerifier,
  updateProfile,
} from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import toast from 'react-hot-toast';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  checkUser: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithPhone: (phoneNumber: string, appVerifier: ApplicationVerifier) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  checkUser: async () => {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        set({ user, isAuthenticated: !!user, isLoading: false });
        unsubscribe();
        resolve();
      });
    });
  },
  login: async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      set({ user: userCredential.user, isAuthenticated: true });
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  },
  loginWithGoogle: async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      set({ user: result.user, isAuthenticated: true });
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  },
  loginWithPhone: async (phoneNumber: string, appVerifier: ApplicationVerifier) => {
    try {
      await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  },
  signup: async (email: string, password: string, name: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      set({ user: userCredential.user, isAuthenticated: true });
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  },
  logout: async () => {
    try {
      await signOut(auth);
      set({ user: null, isAuthenticated: false });
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  },
}));
