import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi, assessmentApi, questionApi, certificateApi } from "@/lib/api";
import {
  LoginRequest,
  RegisterRequest,
  CreateAssessmentRequest,
  SubmitAssessmentRequest,
  ProfileUpdateRequest,
} from "@/types/api";
import { toast } from "react-hot-toast";

// Query Keys
export const queryKeys = {
  auth: ["auth"] as const,
  profile: ["profile"] as const,
  assessments: ["assessments"] as const,
  assessment: (id: string) => ["assessment", id] as const,
  questions: (params?: any) => ["questions", params] as const,
  certificates: ["certificates"] as const,
};

// Auth Hooks
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (response) => {
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);
      queryClient.setQueryData(queryKeys.auth, response.user);
      queryClient.setQueryData(queryKeys.profile, response.user);
      toast.success("Login successful!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Login failed");
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
    onSuccess: () => {
      toast.success("Registration successful! Please login.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Registration failed");
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      queryClient.clear();
      toast.success("Logged out successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Logout failed");
    },
  });
};

// Profile Hooks
export const useProfile = () => {
  return useQuery({
    queryKey: queryKeys.profile,
    queryFn: () => authApi.getProfile(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!localStorage.getItem("accessToken"),
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProfileUpdateRequest) => authApi.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profile });
      toast.success("Profile updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Profile update failed");
    },
  });
};

// Assessment Hooks
export const useAssessments = () => {
  return useQuery({
    queryKey: queryKeys.assessments,
    queryFn: () => assessmentApi.getAssessments(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: !!localStorage.getItem("accessToken"),
  });
};

export const useAssessment = (id: string) => {
  return useQuery({
    queryKey: queryKeys.assessment(id),
    queryFn: () => assessmentApi.getAssessment(id),
    enabled: !!id && !!localStorage.getItem("accessToken"),
  });
};

export const useCreateAssessment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAssessmentRequest) =>
      assessmentApi.createAssessment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assessments });
      toast.success("Assessment created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create assessment");
    },
  });
};

export const useSubmitAssessment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: SubmitAssessmentRequest }) =>
      assessmentApi.submitAssessment(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assessments });
      queryClient.invalidateQueries({
        queryKey: queryKeys.assessment(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.certificates });
      toast.success("Assessment submitted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to submit assessment");
    },
  });
};

export const useStartAssessment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => assessmentApi.getAssessment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assessments });
      toast.success("Assessment started successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to start assessment");
    },
  });
};

// Question Hooks
export const useQuestions = (params?: any) => {
  return useQuery({
    queryKey: queryKeys.questions(params),
    queryFn: () => questionApi.getQuestions(params),
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!localStorage.getItem("accessToken"),
  });
};

// Certificate Hooks
export const useCertificates = () => {
  return useQuery({
    queryKey: queryKeys.certificates,
    queryFn: () => certificateApi.getCertificates(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!localStorage.getItem("accessToken"),
  });
};

// Utility Hooks
export const useAuth = () => {
  const queryClient = useQueryClient();

  const isAuthenticated = !!localStorage.getItem("accessToken");
  const user = queryClient.getQueryData(queryKeys.auth);

  return {
    isAuthenticated,
    user,
  };
};
