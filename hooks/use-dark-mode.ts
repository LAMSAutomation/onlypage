import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';

type Theme = 'light' | 'dark';

interface DarkModeContextType {
  theme: Theme;
  toggle: () => void;
  setTheme: (t: Theme) => void;
}

const DarkModeContext = createContext<DarkModeContextType>({
  theme: 'light',
  toggle: () => {},
  setTheme: () => {},
});

export function useDarkMode(): DarkModeContextType {
  return useContext(DarkModeContext);
}

export function DarkModeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'light';
    const stored = localStorage.getItem('onlypage_theme') as Theme | null;
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('onlypage_theme', theme);
  }, [theme]);

  const toggle = useCallback(() => {
    setThemeState(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
  }, []);

  return React.createElement(DarkModeContext.Provider, { value: { theme, toggle, setTheme } }, children);
}

// Inline dark mode toggle button component
export function DarkModeToggle() {
  const { theme, toggle } = useDarkMode();
  return React.createElement('button', {
    onClick: toggle,
    className: "p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer",
    title: `Switch to ${theme === 'light' ? 'dark' : 'light'} mode`
  }, theme === 'light' ? '🌙' : '☀️');
}
