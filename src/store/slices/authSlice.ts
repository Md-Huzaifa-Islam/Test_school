import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { demoAuthState, DemoUser } from "../../data/demoData";

export interface AuthState {
  user: DemoUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Initial state with demo data
const initialState: AuthState = {
  user: demoAuthState.user,
  accessToken: demoAuthState.accessToken,
  refreshToken: demoAuthState.refreshToken,
  isAuthenticated: demoAuthState.isAuthenticated,
  isLoading: false,
  error: null,
};

// Auth slice
const authSlice = createSlice({
  name: "auth",
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

    // Login success
    loginSuccess: (
      state,
      action: PayloadAction<{
        user: DemoUser;
        accessToken: string;
        refreshToken: string;
      }>
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
    },

    // Update user profile
    updateUser: (state, action: PayloadAction<DemoUser>) => {
      state.user = action.payload;
    },

    // Update profile fields
    updateProfile: (
      state,
      action: PayloadAction<{
        firstName?: string;
        lastName?: string;
        email?: string;
      }>
    ) => {
      if (state.user) {
        if (action.payload.firstName)
          state.user.firstName = action.payload.firstName;
        if (action.payload.lastName)
          state.user.lastName = action.payload.lastName;
        if (action.payload.email) state.user.email = action.payload.email;
      }
    },

    // Update tokens
    updateTokens: (
      state,
      action: PayloadAction<{
        accessToken: string;
        refreshToken: string;
      }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },

    // Logout
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    },

    // Email verification
    verifyEmailSuccess: (state) => {
      if (state.user) {
        state.user.isEmailVerified = true;
      }
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
  loginSuccess,
  updateUser,
  updateProfile,
  updateTokens,
  logout,
  verifyEmailSuccess,
  clearError,
} = authSlice.actions;

// Selectors
export const selectAuth = (state: any) => state.auth;
export const selectUser = (state: any) => state.auth.user;
export const selectIsAuthenticated = (state: any) => state.auth.isAuthenticated;
export const selectAccessToken = (state: any) => state.auth.accessToken;
export const selectRefreshToken = (state: any) => state.auth.refreshToken;
export const selectAuthLoading = (state: any) => state.auth.isLoading;
export const selectAuthError = (state: any) => state.auth.error;

export default authSlice.reducer;
