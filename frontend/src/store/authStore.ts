import { create } from 'zustand';
import { User } from '@/types';
import { authService } from '@/services/api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchCurrentUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false, // Start as false — don't block UI before fetch

  login: async (email, password) => {
    set({ isLoading: true });
    const response = await authService.login({ email, password });
    set({ user: response.data.user, isAuthenticated: true, isLoading: false });
  },

  register: async (name, email, password, phone) => {
    set({ isLoading: true });
    const response = await authService.register({ name, email, password, phone });
    set({ user: response.data.user, isAuthenticated: true, isLoading: false });
  },

  logout: async () => {
    try {
      await authService.logout();
    } catch {
      // ignore logout errors
    }
    set({ user: null, isAuthenticated: false, isLoading: false });
  },

  fetchCurrentUser: async () => {
    set({ isLoading: true });
    try {
      const response = await authService.getCurrentUser();
      set({ user: response.data, isAuthenticated: true, isLoading: false });
    } catch {
      // Not logged in — that's fine
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
