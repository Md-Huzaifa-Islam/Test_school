"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAssessments } from "@/hooks/api";
import withAuth from "@/components/hoc/withAuth";
import {
  Play,
  Clock,
  CheckCircle,
  XCircle,
  Trophy,
  BookOpen,
  Target,
  AlertCircle,
  Plus,
  Loader2,
  ArrowRight,
  Star,
} from "lucide-react";
import { toast } from "react-hot-toast";
import api from "@/lib/api";

/**
 * Assessment page component showing available assessments and step-by-step flow
 * Implements the 3-step progressive evaluation pathway (A1-A2 → B1-B2 → C1-C2)
 * Protected route that requires authentication
 */
function AssessmentPageFixed(): React.JSX.Element {
  const router = useRouter();
  const { data: assessmentData, isLoading, error, refetch } = useAssessments();
  const [creatingAssessment, setCreatingAssessment] = useState<number | null>(
    null
  );

  const createAssessment = async (step: number) => {
    try {
      setCreatingAssessment(step);
      const response = await api.post("/assessments", { step });

      console.log("Assessment response:", response.data);

      if (response.data.success) {
        const assessmentId = response.data.data.assessmentId;
        console.log("Assessment ID:", assessmentId);
        toast.success("Assessment created successfully!");
        router.push(`/exam/${assessmentId}`);
      }
    } catch (error: any) {
      console.error("Error creating assessment:", error);
      toast.error(
        error.response?.data?.message || "Failed to create assessment"
      );
    } finally {
      setCreatingAssessment(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Loading assessments...
          </h2>
          <p className="text-gray-600">Please wait a moment</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error loading assessments
          </h2>
          <p className="text-gray-600 mb-4">
            {error?.message || "Something went wrong"}
          </p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  const assessments = assessmentData?.data?.assessments || [];
  const userProgress = assessmentData?.data?.userProgress || {};

  // Step configurations
  const stepConfigs = [
    {
      step: 1,
      title: "Step 1: A1-A2 Assessment",
      description: "Basic to Elementary level evaluation",
      levels: "A1-A2",
      duration: "45 minutes",
      questions: "20 questions",
      color: "bg-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-700",
    },
    {
      step: 2,
      title: "Step 2: B1-B2 Assessment",
      description: "Intermediate level evaluation",
      levels: "B1-B2",
      duration: "60 minutes",
      questions: "25 questions",
      color: "bg-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      textColor: "text-green-700",
    },
    {
      step: 3,
      title: "Step 3: C1-C2 Assessment",
      description: "Advanced to Proficient level evaluation",
      levels: "C1-C2",
      duration: "75 minutes",
      questions: "30 questions",
      color: "bg-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      textColor: "text-purple-700",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Target className="h-12 w-12 text-blue-600 mr-4" />
            <h1 className="text-4xl font-bold text-gray-900">
              Competency Assessments
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Progressive 3-step evaluation pathway to assess your language
            competency from A1 to C2 level
          </p>
        </div>

        {/* Progress Overview */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <BookOpen className="h-6 w-6 mr-3 text-blue-600" />
            Your Progress
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stepConfigs.map((stepInfo) => {
              const existingAssessment = assessments.find(
                (a: any) => a.step === stepInfo.step
              );
              const isCompleted = existingAssessment?.status === "completed";
              const isInProgress = existingAssessment?.status === "in_progress";
              const isAvailable =
                stepInfo.step === 1 ||
                userProgress.completedSteps?.includes(stepInfo.step - 1);

              return (
                <div
                  key={stepInfo.step}
                  className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                  {/* Card Header */}
                  <div className={`${stepInfo.color} p-6 text-white relative`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold opacity-90">
                        {stepInfo.levels}
                      </span>
                      {isCompleted && (
                        <CheckCircle className="h-8 w-8 text-white" />
                      )}
                      {isInProgress && (
                        <Clock className="h-8 w-8 text-white animate-pulse" />
                      )}
                      {!isAvailable && (
                        <AlertCircle className="h-8 w-8 text-white/70" />
                      )}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{stepInfo.title}</h3>
                    <p className="text-white/90">{stepInfo.description}</p>
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    <div className="space-y-4 mb-6">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Levels:</span>
                        <span className="font-semibold text-gray-900">
                          {stepInfo.levels}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Duration:</span>
                        <span className="font-semibold text-gray-900">
                          {stepInfo.duration}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Questions:</span>
                        <span className="font-semibold text-gray-900">
                          {stepInfo.questions}
                        </span>
                      </div>
                    </div>

                    {/* Status and Actions */}
                    {isCompleted && (
                      <div
                        className={`${stepInfo.bgColor} ${stepInfo.borderColor} border rounded-lg p-4 mb-4`}
                      >
                        <div className="flex items-center">
                          <CheckCircle
                            className={`h-5 w-5 ${stepInfo.textColor} mr-3`}
                          />
                          <div>
                            <div
                              className={`font-semibold ${stepInfo.textColor}`}
                            >
                              Completed!
                            </div>
                            <div className="text-sm text-gray-600">
                              Score: {existingAssessment.score}%
                              {existingAssessment.level && (
                                <span className="ml-2">
                                  Level: {existingAssessment.level}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {isInProgress && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                        <div className="flex items-center">
                          <Clock className="h-5 w-5 text-yellow-700 mr-3" />
                          <div>
                            <div className="font-semibold text-yellow-700">
                              In Progress
                            </div>
                            <div className="text-sm text-gray-600">
                              Continue your assessment
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {!isAvailable && (
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                        <div className="flex items-center">
                          <AlertCircle className="h-5 w-5 text-gray-600 mr-3" />
                          <div>
                            <div className="font-semibold text-gray-600">
                              Not Available
                            </div>
                            <div className="text-sm text-gray-600">
                              Complete previous step to unlock
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Action Button */}
                    <div className="space-y-3">
                      {isInProgress && (
                        <button
                          onClick={() =>
                            router.push(`/exam/${existingAssessment._id}`)
                          }
                          className={`w-full ${stepInfo.color} text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center`}
                        >
                          <Play className="h-5 w-5 mr-2" />
                          Continue Assessment
                        </button>
                      )}

                      {isAvailable && !isInProgress && !isCompleted && (
                        <button
                          onClick={() => createAssessment(stepInfo.step)}
                          disabled={creatingAssessment === stepInfo.step}
                          className={`w-full ${stepInfo.color} text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center disabled:opacity-50`}
                        >
                          {creatingAssessment === stepInfo.step ? (
                            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          ) : (
                            <Plus className="h-5 w-5 mr-2" />
                          )}
                          Start Assessment
                        </button>
                      )}

                      {isCompleted && userProgress.canRetake && (
                        <button
                          onClick={() => createAssessment(stepInfo.step)}
                          disabled={creatingAssessment === stepInfo.step}
                          className={`w-full border-2 ${stepInfo.borderColor} ${stepInfo.textColor} px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center disabled:opacity-50`}
                        >
                          {creatingAssessment === stepInfo.step ? (
                            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          ) : (
                            <Plus className="h-5 w-5 mr-2" />
                          )}
                          Retake Assessment
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Assessments Table */}
        {assessments.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Recent Assessments
            </h2>
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        Step
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        Score
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        Level
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        Date
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {assessments.map((assessment: any) => (
                      <tr key={assessment._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">
                          Step {assessment.step}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              assessment.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : assessment.status === "in_progress"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {assessment.status.replace("_", " ")}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {assessment.score ? `${assessment.score}%` : "-"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {assessment.level || "-"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {new Date(assessment.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {assessment.status === "in_progress" && (
                            <button
                              onClick={() =>
                                router.push(`/exam/${assessment._id}`)
                              }
                              className="text-blue-600 hover:text-blue-900 font-semibold"
                            >
                              Continue
                            </button>
                          )}
                          {assessment.status === "completed" && (
                            <button
                              onClick={() =>
                                router.push(`/certificates/${assessment._id}`)
                              }
                              className="text-green-600 hover:text-green-900 font-semibold"
                            >
                              View Certificate
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default withAuth(AssessmentPageFixed);
