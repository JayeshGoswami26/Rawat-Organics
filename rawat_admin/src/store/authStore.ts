import { create } from 'zustand';
import { authApi } from '@/lib/api';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: Array<{ _id: string; name: string; displayName: string }>;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchProfile: () => Promise<void>;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: !!localStorage.getItem('admin_token'),
  isLoading: false,

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const { data } = await authApi.login(email, password);
      const responseData = data.data || data;
      localStorage.setItem('admin_token', responseData.accessToken);
      localStorage.setItem('admin_refresh_token', responseData.refreshToken);
      set({ isAuthenticated: true, user: responseData.user, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      const refreshToken = localStorage.getItem('admin_refresh_token');
      if (refreshToken) {
        await authApi.logout(refreshToken);
      }
    } catch {
      // Ignore logout API errors
    } finally {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_refresh_token');
      set({ user: null, isAuthenticated: false });
    }
  },

  fetchProfile: async () => {
    try {
      const { data } = await authApi.getProfile();
      set({ user: data.data || data });
    } catch {
      set({ user: null, isAuthenticated: false });
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_refresh_token');
    }
  },

  checkAuth: () => {
    const token = localStorage.getItem('admin_token');
    set({ isAuthenticated: !!token });
  },
}));
