import { create } from 'zustand';
import { authApi } from '../api/services.js';
import { tokenStore } from '../api/client.js';

export const useAuthStore = create((set, get) => ({
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
    const tokenResponse = await authApi.login({ email, password });
    tokenStore.set(tokenResponse.access_token);
    const user = await authApi.me();
    set({ user, sessionExpired: false });
    return user;
  },

  register: async (name, email, password) => {
    await authApi.register({ full_name: name, email, password });
    return get().login(email, password);
  },

  updateProfile: async (name) => {
    const updated = await authApi.updateProfile(name);
    set((state) => ({ user: { ...(state.user || {}), ...updated } }));
    return updated;
  },

  logout: async () => {
    try {
      if (tokenStore.get()) await authApi.logout();
    } finally {
      tokenStore.clear();
      set({ user: null, sessionExpired: false });
    }
  },

  setSessionExpired: (value) => set({ sessionExpired: value }),
}));

/* Backwards-compatible hook for components still importing useAuth */
export const useAuth = () => useAuthStore();
