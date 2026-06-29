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
  isLoading: true,

  login: async (email, password) => {
    const response = await authService.login({ email, password });
    set({ user: response.data.user, isAuthenticated: true, isLoading: false });
  },

  register: async (name, email, password, phone) => {
    const response = await authService.register({ name, email, password, phone });
    set({ user: response.data.user, isAuthenticated: true, isLoading: false });
  },

  logout: async () => {
    await authService.logout();
    set({ user: null, isAuthenticated: false, isLoading: false });
  },

  fetchCurrentUser: async () => {
    try {
      const response = await authService.getCurrentUser();
      set({ user: response.data, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
