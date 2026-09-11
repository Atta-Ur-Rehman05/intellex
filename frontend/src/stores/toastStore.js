import { create } from 'zustand';

const MAX_TOASTS = 5;

export const useToastStore = create((set, get) => ({
  toasts: [],

  addToast: ({ title, description, type = 'info', duration = 4000, action }) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { id, title, description, type, duration, action };

    set((state) => {
      const next = [...state.toasts, newToast];
      return { toasts: next.slice(-MAX_TOASTS) };
    });

    if (duration > 0 && type !== 'ai-processing') {
      setTimeout(() => {
        get().dismiss(id);
      }, duration);
    }

    return id;
  },

  dismiss: (id) => {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
  },
}));

export const useToast = () => useToastStore();
