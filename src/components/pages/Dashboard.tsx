"use client";

import React from "react";
import Link from "next/link";
import { useProfile, useAssessments, useCertificates } from "@/hooks/api";
import {
  CheckCircle,
  Clock,
  TrendingUp,
  Award,
  BookOpen,
  BarChart3,
  Calendar,
  UserIcon,
  Zap,
  Loader2,
  XCircle,
} from "lucide-react";
import { Assessment, Certificate } from "@/types/api";

/**
 * Dashboard component for authenticated users
 * Shows overview of assessments, progress, and certificates
 */
export default function Dashboard(): React.JSX.Element {
  const {
    data: profileData,
    isLoading: isProfileLoading,
    error: profileError,
  } = useProfile();
  const {
    data: assessmentsData,
    isLoading: isAssessmentsLoading,
    error: assessmentsError,
  } = useAssessments();
  const {
    data: certificatesData,
    isLoading: isCertificatesLoading,
    error: certificatesError,
  } = useCertificates();

  const user = profileData?.data;

  // Loading state
  if (isProfileLoading || isAssessmentsLoading || isCertificatesLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Loading your dashboard...
          </h1>
          <p className="text-gray-600">
            Preparing your personalized experience
          </p>
        </div>
      </main>
    );
  }

  // Error state
  if (profileError || assessmentsError || certificatesError) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Error loading dashboard
          </h1>
          <p className="text-gray-600 mb-6">
            {profileError?.message ||
              assessmentsError?.message ||
              certificatesError?.message ||
              "Something went wrong"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading user data...</p>
        </div>
      </main>
    );
  }

  // Ensure we have arrays to work with
  const assessments: Assessment[] = assessmentsData?.data?.assessments || [];
  const certificates: Certificate[] = Array.isArray(certificatesData?.data)
    ? certificatesData.data
    : certificatesData?.data?.certificates || [];

  const completedAssessments = assessments.filter(
    (a: Assessment) => a.status === "completed"
  );
  const inProgressAssessments = assessments.filter(
    (a: Assessment) => a.status === "in_progress"
  );
  const notStartedAssessments = assessments.filter(
    (a: Assessment) => a.status === "not_started"
  );

  const averageScore =
    completedAssessments.length > 0
      ? Math.round(
          completedAssessments.reduce(
            (sum: number, a: Assessment) => sum + (a.score || 0),
            0
          ) / completedAssessments.length
        )
      : 0;

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-lg text-gray-600 mt-2">
                Your Digital Competency Progress
              </p>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-full">
                <UserIcon className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">
                  {user.firstName} {user.lastName}
                </span>
              </div>
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-green-400 to-green-600 text-white shadow-md">
                <Zap className="h-4 w-4 mr-2" />
                {user.role}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8 text-center">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Welcome back, {user.firstName}! 🎉
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Continue your digital competency journey and unlock your potential
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-3xl font-bold text-gray-900">
                  {completedAssessments.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-full">
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-3xl font-bold text-gray-900">
                  {inProgressAssessments.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Average Score
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {averageScore}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <Award className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Certificates
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {certificates.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Assessments */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Your Assessments
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {assessments.length > 0 ? (
                    assessments.map((assessment: Assessment, index: number) => (
                      <div
                        key={
                          assessment.id ||
                          (assessment as any)._id ||
                          `assessment-${index}`
                        }
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            {assessment.status === "completed" && (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            )}
                            {assessment.status === "in_progress" && (
                              <Clock className="h-5 w-5 text-yellow-500" />
                            )}
                            {assessment.status === "not_started" && (
                              <BookOpen className="h-5 w-5 text-gray-400" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              Step {assessment.step} - Level{" "}
                              {assessment.level || "TBD"}
                            </p>
                            <p className="text-sm text-gray-500">
                              {assessment.questions.length} questions
                              {assessment.score &&
                                ` • Score: ${assessment.score}%`}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              assessment.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : assessment.status === "in_progress"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {assessment.status.replace("_", " ")}
                          </span>
                          <Link
                            href="/assessments"
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            {assessment.status === "not_started"
                              ? "Start"
                              : "Continue"}
                          </Link>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">
                        No assessments available yet.
                      </p>
                      <p className="text-sm text-gray-400">
                        Start your first assessment to track your progress!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Certificates Overview */}
          <div>
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Your Certificates
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {certificates.length > 0 ? (
                    certificates.map(
                      (certificate: Certificate, index: number) => (
                        <div
                          key={
                            certificate.id ||
                            (certificate as any)._id ||
                            `certificate-${index}`
                          }
                          className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-sm font-medium text-gray-900 mb-1">
                                Level {certificate.level} Certificate
                              </h4>
                              <p className="text-xs text-gray-500">
                                Score: {certificate.score}% • Issued:{" "}
                                {new Date(
                                  certificate.issuedAt
                                ).toLocaleDateString()}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                Certificate #{certificate.certificateNumber}
                              </p>
                            </div>
                            <Award className="h-8 w-8 text-yellow-500" />
                          </div>
                        </div>
                      )
                    )
                  ) : (
                    <div className="text-center py-8">
                      <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">
                        No certificates earned yet.
                      </p>
                      <p className="text-sm text-gray-400">
                        Complete assessments to earn certificates!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link
                href="/assessments"
                className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <BookOpen className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-sm font-medium text-gray-700">
                  Start New Assessment
                </span>
              </Link>
              <Link
                href="/profile"
                className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <BarChart3 className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-sm font-medium text-gray-700">
                  View Progress
                </span>
              </Link>
              <Link
                href="/certificates"
                className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Award className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-sm font-medium text-gray-700">
                  My Certificates
                </span>
              </Link>
              <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-sm font-medium text-gray-700">
                  Schedule Assessment
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
