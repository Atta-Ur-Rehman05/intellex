import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../api/services.js';
import { tokenStore, ApiError } from '../api/client.js';

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  // Restore session on mount: if a token exists, fetch /auth/me
  useEffect(() => {
    let cancelled = false;
    const bootstrap = async () => {
      if (!tokenStore.get()) {
        setIsBootstrapping(false);
        return;
      }
      try {
        const me = await authApi.me();
        if (!cancelled) setUser(me);
      } catch {
        tokenStore.clear();
      } finally {
        if (!cancelled) setIsBootstrapping(false);
      }
    };
    bootstrap();
    return () => { cancelled = true; };
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await authApi.login({ email, password });
    tokenStore.set(res.access_token);
    setUser(res.user);
    return res.user;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const res = await authApi.register({ name, email, password });
    tokenStore.set(res.access_token);
    setUser(res.user);
    return res.user;
  }, []);

  const logout = useCallback(() => {
    tokenStore.clear();
    setUser(null);
  }, []);

  const isAuthError = (e) => e instanceof ApiError && (e.status === 401 || e.status === 0);

  return (
    <AuthContext.Provider value={{ user, isBootstrapping, login, register, logout, isAuthError }}>
      {children}
    </AuthContext.Provider>
  );
};
