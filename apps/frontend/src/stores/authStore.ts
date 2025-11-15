import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api, ApiResponse, ApiError } from '@/lib/api';

export interface Profile {
  id: string;
  displayName: string;
  profileType: string;
  isPrimary: boolean;
  avatarUrl?: string;
  bio?: string;
}

export interface User {
  id: string;
  email: string;
  createdAt: Date;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
  profiles: Profile[];
  isNewUser: boolean;
  firstLogin: boolean;
}

interface AuthState {
  user: User | null;
  profiles: Profile[];
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isNewUser: boolean;
  firstLogin: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  sendOtp: (email: string) => Promise<void>;
  verifyOtp: (email: string, code: string) => Promise<void>;
  logout: () => void;
  refreshAccessToken: () => Promise<void>;
  clearError: () => void;
  setIsNewUser: (isNewUser: boolean) => void;
  completeWizard: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      profiles: [],
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isNewUser: false,
      firstLogin: false,
      isLoading: false,
      error: null,

      sendOtp: async (email: string) => {
        set({ isLoading: true, error: null });
        try {
          await api.post<ApiResponse<{ message: string; expiresIn: number }>>(
            '/auth/send-otp',
            { email }
          );
          set({ isLoading: false });
        } catch (error) {
          const apiError = error as ApiError;
          set({ 
            isLoading: false, 
            error: apiError.message || 'Failed to send OTP' 
          });
          throw error;
        }
      },

      verifyOtp: async (email: string, code: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post<ApiResponse<AuthResponse>>(
            '/auth/verify-otp',
            { email, code }
          );

          const { accessToken, refreshToken, user, profiles, isNewUser, firstLogin } = response.data;

          set({
            user,
            profiles,
            accessToken,
            refreshToken,
            isAuthenticated: true,
            isNewUser,
            firstLogin,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          const apiError = error as ApiError;
          set({ 
            isLoading: false, 
            error: apiError.message || 'Failed to verify OTP' 
          });
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          profiles: [],
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isNewUser: false,
          firstLogin: false,
          error: null,
        });
      },

      refreshAccessToken: async () => {
        const { refreshToken } = get();
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        try {
          const response = await api.post<ApiResponse<{ accessToken: string }>>(
            '/auth/refresh-token',
            { refreshToken }
          );

          set({ accessToken: response.data.accessToken });
        } catch (error) {
          // If refresh fails, logout the user
          get().logout();
          throw error;
        }
      },

      clearError: () => {
        set({ error: null });
      },

      setIsNewUser: (isNewUser: boolean) => {
        set({ isNewUser });
      },

      completeWizard: async () => {
        const { accessToken } = get();
        if (!accessToken) {
          throw new Error('Not authenticated');
        }

        try {
          await api.post<ApiResponse<{ message: string }>>(
            '/auth/complete-wizard',
            {},
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          set({ firstLogin: false });
        } catch (error) {
          const apiError = error as ApiError;
          set({ error: apiError.message || 'Failed to complete wizard' });
          throw error;
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        profiles: state.profiles,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
        isNewUser: state.isNewUser,
        firstLogin: state.firstLogin,
      }),
    }
  )
);

