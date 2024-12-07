import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../config/constants';

export function useAuth() {
  const { user, signIn, signOut, signUp, loading } = useAuthStore();
  const navigate = useNavigate();

  const handleSignIn = async (email: string, password: string) => {
    await signIn(email, password);
    navigate(ROUTES.DASHBOARD);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate(ROUTES.LOGIN);
  };

  return {
    user,
    loading,
    signIn: handleSignIn,
    signOut: handleSignOut,
    signUp
  };
}