import { create } from 'zustand';
import { authApi } from '../api/services.js';
import { tokenStore } from '../api/client.js';

export const useAuthStore = create((set) => ({
  user: null,
  isBootstrapping: true,
  sessionExpired: false,

  bootstrap: async () => {
    if (!tokenStore.get()) {
      set({ isBootstrapping: false });
      return;
    }
    try {
      const me = await authApi.me();
      set({ user: me, isBootstrapping: false, sessionExpired: false });
    } catch {
      tokenStore.clear();
      set({ user: null, isBootstrapping: false, sessionExpired: false });
    }
  },

  login: async (email, password) => {
    const res = await authApi.login({ email, password });
    tokenStore.set(res.access_token);
    set({ user: res.user, sessionExpired: false });
    return res.user;
  },

  register: async (name, email, password) => {
    const res = await authApi.register({ name, email, password });
    tokenStore.set(res.access_token);
    set({ user: res.user, sessionExpired: false });
    return res.user;
  },

  updateProfile: async (name) => {
    const updated = await authApi.updateProfile(name);
    set((state) => ({ user: { ...(state.user || {}), ...updated } }));
    return updated;
  },

  logout: () => {
    tokenStore.clear();
    set({ user: null, sessionExpired: false });
  },

  setSessionExpired: (value) => set({ sessionExpired: value }),
}));

/* Backwards-compatible hook for components still importing useAuth */
export const useAuth = () => useAuthStore();
