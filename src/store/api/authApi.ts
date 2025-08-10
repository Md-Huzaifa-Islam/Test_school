import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  ApiResponse,
  User,
  LoginCredentials,
  RegisterData,
  AuthResponse,
  OTPData,
  ResetPasswordData,
} from "@/types";
import { RootState } from "../store";

// Base API configuration
export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.accessToken;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["User", "Assessment", "Question", "Certificate", "Notification"],
  endpoints: () => ({}),
});

// Authentication API
export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // User registration
    register: builder.mutation<AuthResponse, RegisterData>({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["User"],
    }),

    // User login
    login: builder.mutation<AuthResponse, LoginCredentials>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User"],
    }),

    // Logout user
    logout: builder.mutation<ApiResponse, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),

    // Refresh access token
    refreshToken: builder.mutation<AuthResponse, { refreshToken: string }>({
      query: (data) => ({
        url: "/auth/refresh",
        method: "POST",
        body: data,
      }),
    }),

    // Send OTP for email verification
    sendOTP: builder.mutation<
      ApiResponse,
      { email: string; type: "verification" | "reset" }
    >({
      query: (data) => ({
        url: "/auth/send-otp",
        method: "POST",
        body: data,
      }),
    }),

    // Verify OTP
    verifyOTP: builder.mutation<ApiResponse, OTPData>({
      query: (data) => ({
        url: "/auth/verify-otp",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    // Forgot password
    forgotPassword: builder.mutation<ApiResponse, { email: string }>({
      query: (data) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: data,
      }),
    }),

    // Reset password
    resetPassword: builder.mutation<ApiResponse, ResetPasswordData>({
      query: (data) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: data,
      }),
    }),

    // Get current user profile
    getProfile: builder.query<ApiResponse<User>, void>({
      query: () => "/auth/profile",
      providesTags: ["User"],
    }),

    // Update user profile
    updateProfile: builder.mutation<ApiResponse<User>, Partial<User>>({
      query: (userData) => ({
        url: "/auth/profile",
        method: "PUT",
        body: userData,
      }),
      invalidatesTags: ["User"],
    }),

    // Change password
    changePassword: builder.mutation<
      ApiResponse,
      {
        currentPassword: string;
        newPassword: string;
        confirmPassword: string;
      }
    >({
      query: (data) => ({
        url: "/auth/change-password",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
  useSendOTPMutation,
  useVerifyOTPMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
} = authApi;
