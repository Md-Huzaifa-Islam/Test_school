import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  ApiResponse,
  Assessment,
  Question,
  AssessmentResult,
  AssessmentAnswer,
  CompetencyLevel,
  AssessmentStep,
  PaginatedResponse,
} from "@/types";
import { RootState } from "../store";

// Assessment API
export const assessmentApi = createApi({
  reducerPath: "assessmentApi",
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
  tagTypes: ["Assessment", "Question", "Result"],
  endpoints: (builder) => ({
    // Start a new assessment
    startAssessment: builder.mutation<
      ApiResponse<Assessment>,
      { step: AssessmentStep }
    >({
      query: (data) => ({
        url: "/assessments/start",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Assessment"],
    }),

    // Get current assessment
    getCurrentAssessment: builder.query<ApiResponse<Assessment>, void>({
      query: () => "/assessments/current",
      providesTags: ["Assessment"],
    }),

    // Submit an answer
    submitAnswer: builder.mutation<
      ApiResponse,
      {
        assessmentId: string;
        questionId: string;
        selectedAnswer: string;
        timeSpent: number;
      }
    >({
      query: (data) => ({
        url: "/assessments/answer",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Assessment"],
    }),

    // Submit complete assessment
    submitAssessment: builder.mutation<
      ApiResponse<AssessmentResult>,
      {
        assessmentId: string;
        answers: AssessmentAnswer[];
      }
    >({
      query: (data) => ({
        url: "/assessments/submit",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Assessment", "Result"],
    }),

    // Get assessment results
    getAssessmentResults: builder.query<
      ApiResponse<PaginatedResponse<AssessmentResult>>,
      {
        page?: number;
        limit?: number;
        step?: AssessmentStep;
      }
    >({
      query: (params) => ({
        url: "/assessments/results",
        params,
      }),
      providesTags: ["Result"],
    }),

    // Get specific assessment result
    getAssessmentResult: builder.query<ApiResponse<AssessmentResult>, string>({
      query: (resultId) => `/assessments/results/${resultId}`,
      providesTags: ["Result"],
    }),

    // Get questions for assessment step
    getQuestionsForStep: builder.query<
      ApiResponse<Question[]>,
      {
        step: AssessmentStep;
        competencyLevel?: CompetencyLevel[];
      }
    >({
      query: (params) => ({
        url: "/questions",
        params,
      }),
      providesTags: ["Question"],
    }),

    // Get user's assessment history
    getUserAssessmentHistory: builder.query<
      ApiResponse<PaginatedResponse<Assessment>>,
      {
        page?: number;
        limit?: number;
        status?: string;
      }
    >({
      query: (params) => ({
        url: "/assessments/history",
        params,
      }),
      providesTags: ["Assessment"],
    }),

    // Pause assessment
    pauseAssessment: builder.mutation<ApiResponse, string>({
      query: (assessmentId) => ({
        url: `/assessments/${assessmentId}/pause`,
        method: "PUT",
      }),
      invalidatesTags: ["Assessment"],
    }),

    // Resume assessment
    resumeAssessment: builder.mutation<ApiResponse, string>({
      query: (assessmentId) => ({
        url: `/assessments/${assessmentId}/resume`,
        method: "PUT",
      }),
      invalidatesTags: ["Assessment"],
    }),

    // Get assessment statistics
    getAssessmentStats: builder.query<
      ApiResponse<{
        totalAssessments: number;
        completedAssessments: number;
        averageScore: number;
        highestLevel: CompetencyLevel | null;
        recentResults: AssessmentResult[];
      }>,
      void
    >({
      query: () => "/assessments/stats",
      providesTags: ["Result"],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useStartAssessmentMutation,
  useGetCurrentAssessmentQuery,
  useSubmitAnswerMutation,
  useSubmitAssessmentMutation,
  useGetAssessmentResultsQuery,
  useGetAssessmentResultQuery,
  useGetQuestionsForStepQuery,
  useGetUserAssessmentHistoryQuery,
  usePauseAssessmentMutation,
  useResumeAssessmentMutation,
  useGetAssessmentStatsQuery,
} = assessmentApi;
