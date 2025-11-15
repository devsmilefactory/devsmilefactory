import { create } from 'zustand';
import { api, ApiResponse, ApiError } from '@/lib/api';
import { useAuthStore } from './authStore';

export interface ProfileData {
  id: string;
  userAccountId: string;
  displayName: string;
  username?: string;
  profileType: string;
  bio?: string;
  avatarUrl?: string;
  coverImageUrl?: string;
  location?: string;
  website?: string;
  phone?: string;
  isPrimary: boolean;
  isVerified: boolean;
  completionPercentage: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProfileData {
  displayName: string;
  profileType: string;
  bio?: string;
  location?: string;
  website?: string;
  draftData?: any;
  [key: string]: any; // Allow additional fields from form data
}

export interface UpdateProfileData {
  displayName?: string;
  profileType?: string;
  bio?: string;
  location?: string;
  website?: string;
  avatarUrl?: string;
  coverImageUrl?: string;
}

interface ProfilesState {
  profiles: ProfileData[];
  currentProfile: ProfileData | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchProfiles: () => Promise<void>;
  createProfile: (data: CreateProfileData) => Promise<ProfileData>;
  updateProfile: (profileId: string, data: UpdateProfileData) => Promise<ProfileData>;
  deleteProfile: (profileId: string) => Promise<void>;
  setPrimaryProfile: (profileId: string) => Promise<void>;
  setCurrentProfile: (profile: ProfileData) => void;
  clearError: () => void;
}

export const useProfilesStore = create<ProfilesState>((set, get) => ({
  profiles: [],
  currentProfile: null,
  isLoading: false,
  error: null,

  fetchProfiles: async () => {
    const { accessToken } = useAuthStore.getState();
    if (!accessToken) {
      set({ error: 'Not authenticated' });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const response = await api.get<ApiResponse<ProfileData[]>>(
        '/profiles',
        accessToken
      );

      const profiles = response.data;
      const primaryProfile = profiles.find(p => p.isPrimary) || profiles[0];

      set({
        profiles,
        currentProfile: primaryProfile,
        isLoading: false,
      });
    } catch (error) {
      const apiError = error as ApiError;
      set({
        isLoading: false,
        error: apiError.message || 'Failed to fetch profiles',
      });
    }
  },

  createProfile: async (data: CreateProfileData) => {
    const { accessToken } = useAuthStore.getState();
    if (!accessToken) {
      throw new Error('Not authenticated');
    }

    set({ isLoading: true, error: null });
    try {
      const response = await api.post<ApiResponse<ProfileData>>(
        '/profiles',
        data,
        accessToken
      );

      const newProfile = response.data;

      set((state) => ({
        profiles: [...state.profiles, newProfile],
        isLoading: false,
      }));

      return newProfile;
    } catch (error) {
      const apiError = error as ApiError;
      set({
        isLoading: false,
        error: apiError.message || 'Failed to create profile',
      });
      throw error;
    }
  },

  updateProfile: async (profileId: string, data: UpdateProfileData) => {
    const { accessToken } = useAuthStore.getState();
    if (!accessToken) {
      throw new Error('Not authenticated');
    }

    set({ isLoading: true, error: null });
    try {
      const response = await api.put<ApiResponse<ProfileData>>(
        `/profiles/${profileId}`,
        data,
        accessToken
      );

      const updatedProfile = response.data;

      set((state) => ({
        profiles: state.profiles.map(p =>
          p.id === profileId ? updatedProfile : p
        ),
        currentProfile:
          state.currentProfile?.id === profileId
            ? updatedProfile
            : state.currentProfile,
        isLoading: false,
      }));

      return updatedProfile;
    } catch (error) {
      const apiError = error as ApiError;
      set({
        isLoading: false,
        error: apiError.message || 'Failed to update profile',
      });
      throw error;
    }
  },

  deleteProfile: async (profileId: string) => {
    const { accessToken } = useAuthStore.getState();
    if (!accessToken) {
      throw new Error('Not authenticated');
    }

    set({ isLoading: true, error: null });
    try {
      await api.delete<ApiResponse<{ message: string }>>(
        `/profiles/${profileId}`,
        accessToken
      );

      set((state) => {
        const remainingProfiles = state.profiles.filter(p => p.id !== profileId);
        const newCurrentProfile =
          state.currentProfile?.id === profileId
            ? remainingProfiles.find(p => p.isPrimary) || remainingProfiles[0]
            : state.currentProfile;

        return {
          profiles: remainingProfiles,
          currentProfile: newCurrentProfile,
          isLoading: false,
        };
      });
    } catch (error) {
      const apiError = error as ApiError;
      set({
        isLoading: false,
        error: apiError.message || 'Failed to delete profile',
      });
      throw error;
    }
  },

  setPrimaryProfile: async (profileId: string) => {
    const { accessToken } = useAuthStore.getState();
    if (!accessToken) {
      throw new Error('Not authenticated');
    }

    set({ isLoading: true, error: null });
    try {
      const response = await api.patch<ApiResponse<ProfileData>>(
        `/profiles/${profileId}/set-primary`,
        {},
        accessToken
      );

      const updatedProfile = response.data;

      set((state) => ({
        profiles: state.profiles.map(p => ({
          ...p,
          isPrimary: p.id === profileId,
        })),
        currentProfile: updatedProfile,
        isLoading: false,
      }));
    } catch (error) {
      const apiError = error as ApiError;
      set({
        isLoading: false,
        error: apiError.message || 'Failed to set primary profile',
      });
      throw error;
    }
  },

  setCurrentProfile: (profile: ProfileData) => {
    set({ currentProfile: profile });
  },

  clearError: () => {
    set({ error: null });
  },
}));

