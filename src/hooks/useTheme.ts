import { useEffect } from 'react';
import { useThemeStore } from '@/store/theme-store';

export function useTheme() {
  const { theme, setTheme, toggleTheme } = useThemeStore();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('runbook_agent_theme');
      if (savedTheme === 'light' || savedTheme === 'dark') {
        setTheme(savedTheme);
      } else {
        setTheme('dark');
      }
    }
  }, [setTheme]);

  return {
    theme,
    isDark: theme === 'dark',
    setTheme,
    toggleTheme,
  };
}
