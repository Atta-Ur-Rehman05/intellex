import React, { createContext, useContext, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, Sparkles, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

/**
 * Toast Provider for Knowva Design System
 */
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({
    title,
    description,
    type = 'info', // 'success' | 'error' | 'warning' | 'info' | 'ai-processing'
    duration = 4000,
    action
  }) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { id, title, description, type, duration, action };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0 && type !== 'ai-processing') {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast: addToast, dismiss: removeToast, toasts }}>
      {children}
      {typeof document !== 'undefined' && createPortal(
        <div 
          aria-live="polite" 
          className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
        >
          <AnimatePresence>
            {toasts.map((item) => (
              <ToastItem key={item.id} item={item} onDismiss={() => removeToast(item.id)} />
            ))}
          </AnimatePresence>
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
};

const ToastItem = ({ item, onDismiss }) => {
  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />,
    warning: <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />,
    info: <Info className="w-4 h-4 text-sky-500 shrink-0" />,
    'ai-processing': <Sparkles className="w-4 h-4 text-purple-400 animate-pulse shrink-0" />
  };

  const borders = {
    success: "border-emerald-500/30",
    error: "border-red-500/30",
    warning: "border-amber-500/30",
    info: "border-sky-500/30",
    'ai-processing': "border-purple-500/40 shadow-lg shadow-purple-500/10 ai-border-glow"
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "pointer-events-auto w-full p-4 rounded-xl bg-surface border shadow-xl flex items-start justify-between gap-3 relative overflow-hidden",
        borders[item.type] || "border-border-default"
      )}
    >
      {/* AI Processing Shimmer Progress Bar */}
      {item.type === 'ai-processing' && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-brand-500/20 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-brand-500 via-purple-500 to-pink-500 animate-pulse w-full" />
        </div>
      )}

      <div className="flex items-start gap-3">
        <div className="mt-0.5">{icons[item.type]}</div>
        <div className="space-y-1 pr-2">
          {item.title && (
            <h4 className="text-xs font-bold text-primary tracking-tight">
              {item.title}
            </h4>
          )}
          {item.description && (
            <p className="text-xs text-secondary leading-normal">
              {item.description}
            </p>
          )}
          {item.action && (
            <div className="pt-1.5">{item.action}</div>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={onDismiss}
        className="p-1 -mr-1 -mt-1 rounded-md text-secondary hover:text-primary hover:bg-surface-hover transition-colors cursor-pointer shrink-0"
        aria-label="Dismiss toast"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
};
