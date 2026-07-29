import { create } from 'zustand';
import { User } from '@/types/user';

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: {
    id: 'usr_01',
    name: 'Alex Mercer',
    email: 'alex.mercer@devops.enterprise.com',
    role: 'ADMIN',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
    department: 'Site Reliability Engineering',
    createdAt: new Date().toISOString(),
  },
  token: 'mock_jwt_token_12345',
  isAuthenticated: true,
  login: (user, token) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
    set({ user, token, isAuthenticated: true });
  },
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
