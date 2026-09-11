import { useEffect } from 'react';
import { createContext } from 'react';
import { useAuthStore } from '../stores/authStore.js';

const AuthContext = createContext(null);

export const useAuth = () => {
  const store = useAuthStore();
  return store;
};

export const AuthProvider = ({ children }) => {
  const bootstrap = useAuthStore((s) => s.bootstrap);
  const setSessionExpired = useAuthStore((s) => s.setSessionExpired);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  useEffect(() => {
    const onExpired = () => {
      setSessionExpired(true);
    };
    window.addEventListener('knowva:session-expired', onExpired);
    return () => window.removeEventListener('knowva:session-expired', onExpired);
  }, [setSessionExpired]);

  return (
    <AuthContext.Provider value={{}}>
      {children}
    </AuthContext.Provider>
  );
};
