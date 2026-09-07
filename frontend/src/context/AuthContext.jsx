import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../api/services.js';
import { tokenStore } from '../api/client.js';

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);

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

  // Any API layer 401 mid-session broadcasts 'knowva:session-expired';
  // react by clearing the session so RequireAuth redirects to /login.
  useEffect(() => {
    const onExpired = () => {
      setUser(null);
      setSessionExpired(true);
    };
    window.addEventListener('knowva:session-expired', onExpired);
    return () => window.removeEventListener('knowva:session-expired', onExpired);
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await authApi.login({ email, password });
    tokenStore.set(res.access_token);
    setUser(res.user);
    setSessionExpired(false);
    return res.user;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const res = await authApi.register({ name, email, password });
    tokenStore.set(res.access_token);
    setUser(res.user);
    setSessionExpired(false);
    return res.user;
  }, []);

  const updateProfile = useCallback(async (name) => {
    const updated = await authApi.updateProfile(name);
    setUser((prev) => ({ ...(prev || {}), ...updated }));
    return updated;
  }, []);

  // Called by any consumer when an API request returns 401 mid-session
  const handleSessionExpired = useCallback(() => {
    tokenStore.clear();
    setUser(null);
    setSessionExpired(true);
  }, []);

  const logout = useCallback(() => {
    tokenStore.clear();
    setUser(null);
    setSessionExpired(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isBootstrapping,
        sessionExpired,
        login,
        register,
        updateProfile,
        logout,
        handleSessionExpired,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
