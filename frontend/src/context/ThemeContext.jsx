import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};

const resolveSystem = () =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    try { return localStorage.getItem('knowva_theme') || 'dark'; }
    catch { return 'dark'; }
  });

  // mode: 'light' | 'dark' | 'system' — resolved drives the actual .dark class
  const resolved = mode === 'system' ? resolveSystem() : mode;

  useEffect(() => {
    const root = document.documentElement;
    if (resolved === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    try { localStorage.setItem('knowva_theme', mode); } catch { /* noop */ }
  }, [mode, resolved]);

  // Follow OS changes while in system mode
  useEffect(() => {
    if (mode !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      const root = document.documentElement;
      if (resolveSystem() === 'dark') root.classList.add('dark');
      else root.classList.remove('dark');
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ mode, resolved, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
