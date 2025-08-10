import axios, { AxiosResponse, AxiosError } from "axios";
import {
  ApiResponse,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  RefreshTokenRequest,
} from "@/types/api";

// Create axios instance
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          const response = await apiClient.post<AuthResponse>("/auth/refresh", {
            refreshToken,
          });

          const { accessToken } = response.data;
          localStorage.setItem("accessToken", accessToken);

          // Retry the original request
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/auth/login";
      }
    }

    return Promise.reject(error);
  }
);

// Generic API function
const apiRequest = async <T>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  url: string,
  data?: any,
  config?: any
): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await apiClient.request({
      method,
      url,
      data,
      ...config,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || error.message);
    }
    throw error;
  }
};

// Auth API functions
export const authApi = {
  login: (data: LoginRequest): Promise<AuthResponse> =>
    apiRequest("POST", "/auth/login", data),

  register: (data: RegisterRequest): Promise<AuthResponse> =>
    apiRequest("POST", "/auth/register", data),

  refreshToken: (data: RefreshTokenRequest): Promise<AuthResponse> =>
    apiRequest("POST", "/auth/refresh", data),

  logout: (): Promise<ApiResponse> => apiRequest("POST", "/auth/logout"),

  getProfile: (): Promise<ApiResponse> => apiRequest("GET", "/users/profile"),

  updateProfile: (data: any): Promise<ApiResponse> =>
    apiRequest("PUT", "/users/profile", data),
};

// Assessment API functions
export const assessmentApi = {
  getAssessments: (): Promise<ApiResponse> => apiRequest("GET", "/assessments"),

  getAssessment: (id: string): Promise<ApiResponse> =>
    apiRequest("GET", `/assessments/${id}`),

  createAssessment: (data: any): Promise<ApiResponse> =>
    apiRequest("POST", "/assessments", data),

  submitAssessment: (id: string, data: any): Promise<ApiResponse> =>
    apiRequest("POST", `/assessments/${id}/submit`, data),

  updateAssessment: (id: string, data: any): Promise<ApiResponse> =>
    apiRequest("PUT", `/assessments/${id}`, data),
};

// Question API functions
export const questionApi = {
  getQuestions: (params?: any): Promise<ApiResponse> =>
    apiRequest("GET", "/questions", undefined, { params }),
};

// Certificate API functions
export const certificateApi = {
  getCertificates: (): Promise<ApiResponse> =>
    apiRequest("GET", "/users/certificates"),
};

export default apiClient;
