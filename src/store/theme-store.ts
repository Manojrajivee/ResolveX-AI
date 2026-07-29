import { create } from 'zustand';
import { ThemeMode, THEME_CONFIG } from '@/constants/theme';

interface ThemeStore {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeStore>((set, get) => ({
  theme: THEME_CONFIG.defaultTheme,
  setTheme: (theme: ThemeMode) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(THEME_CONFIG.storageKey, theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    set({ theme });
  },
  toggleTheme: () => {
    const current = get().theme;
    const nextTheme = current === 'dark' ? 'light' : 'dark';
    get().setTheme(nextTheme);
  },
}));
