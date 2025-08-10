import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User, UserState, UserProgress, Certificate } from "@/types";

// Initial state
const initialState: UserState = {
  profile: null,
  progress: null,
  certificates: [],
  isLoading: false,
  error: null,
};

// User slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
      if (action.payload) {
        state.error = null;
      }
    },

    // Set error
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Set user profile
    setProfile: (state, action: PayloadAction<User | null>) => {
      state.profile = action.payload;
    },

    // Update user profile
    updateProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload };
      }
    },

    // Set user progress
    setProgress: (state, action: PayloadAction<UserProgress | null>) => {
      state.progress = action.payload;
    },

    // Update user progress
    updateProgress: (state, action: PayloadAction<Partial<UserProgress>>) => {
      if (state.progress) {
        state.progress = { ...state.progress, ...action.payload };
      }
    },

    // Set certificates
    setCertificates: (state, action: PayloadAction<Certificate[]>) => {
      state.certificates = action.payload;
    },

    // Add certificate
    addCertificate: (state, action: PayloadAction<Certificate>) => {
      state.certificates.unshift(action.payload);
    },

    // Clear user data
    clearUserData: (state) => {
      state.profile = null;
      state.progress = null;
      state.certificates = [];
      state.error = null;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },
  },
});

// Export actions
export const {
  setLoading,
  setError,
  setProfile,
  updateProfile,
  setProgress,
  updateProgress,
  setCertificates,
  addCertificate,
  clearUserData,
  clearError,
} = userSlice.actions;

// Export reducer
export default userSlice.reducer;

// Selectors
export const selectUser = (state: { user: UserState }) => state.user;
export const selectUserProfile = (state: { user: UserState }) =>
  state.user.profile;
export const selectUserProgress = (state: { user: UserState }) =>
  state.user.progress;
export const selectUserCertificates = (state: { user: UserState }) =>
  state.user.certificates;
export const selectUserLoading = (state: { user: UserState }) =>
  state.user.isLoading;
export const selectUserError = (state: { user: UserState }) => state.user.error;
