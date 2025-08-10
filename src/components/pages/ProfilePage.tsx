"use client";

import React, { useState } from "react";
import { useProfile, useAssessments, useCertificates } from "@/hooks/api";
import { User as UserType, Assessment, Certificate } from "@/types/api";
import withAuth from "@/components/hoc/withAuth";
import {
  User,
  Mail,
  Calendar,
  Award,
  Edit3,
  Save,
  X,
  Shield,
  Bell,
  Settings,
  Activity,
  TrendingUp,
  CheckCircle,
  Loader2,
  XCircle,
  Zap,
} from "lucide-react";

/**
 * Profile page component showing user information and settings
 * Allows users to view and edit their profile information
 * Protected route that requires authentication
 */
function ProfilePage(): React.JSX.Element {
  const {
    data: profileData,
    isLoading: isProfileLoading,
    error: profileError,
  } = useProfile();
  const { data: assessmentsData, isLoading: isAssessmentsLoading } =
    useAssessments();
  const { data: certificatesData, isLoading: isCertificatesLoading } =
    useCertificates();

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const user: UserType | undefined = profileData?.data;
  const assessments: Assessment[] = assessmentsData?.data?.assessments || [];
  const certificates: Certificate[] = certificatesData?.data || [];

  // Update form data when user data loads
  React.useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
      });
    }
  }, [user]);

  if (isProfileLoading || isAssessmentsLoading || isCertificatesLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-green-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Loading profile...
          </h1>
          <p className="text-gray-600">Preparing your profile information</p>
        </div>
      </main>
    );
  }

  if (profileError) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-8 w-8 text-red-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Error loading profile
          </h1>
          <p className="text-gray-600">{profileError.message}</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Please log in to view profile
          </h1>
        </div>
      </main>
    );
  }

  const completedAssessments = assessments.filter(
    (a: Assessment) => a.status === "completed"
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

  const handleEditToggle = () => {
    if (isEditing) {
      // Reset form data when canceling
      setFormData({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        email: user?.email || "",
      });
    }
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    // TODO: Implement profile update with API call
    console.log("Updating profile:", formData);
    alert("Profile update functionality will be implemented here.");
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getHighestLevel = () => {
    if (certificates.length === 0) return "None";

    const levelOrder = ["A1", "A2", "B1", "B2", "C1", "C2"];
    return certificates.reduce((highest, current) => {
      const currentIndex = levelOrder.indexOf(current.level);
      const highestIndex = levelOrder.indexOf(highest);
      return currentIndex > highestIndex ? current.level : highest;
    }, certificates[0].level);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Profile
              </h1>
              <p className="text-lg text-gray-600 mt-2">
                Manage your account and assessment progress
              </p>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-full">
                <User className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-green-900">
                  {user.firstName} {user.lastName}
                </span>
              </div>
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-blue-400 to-blue-600 text-white shadow-md">
                <Zap className="h-4 w-4 mr-2" />
                {user.role}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">
                  Profile Information
                </h3>
                <button
                  onClick={isEditing ? handleSave : handleEditToggle}
                  className={`inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md ${
                    isEditing
                      ? "text-green-700 bg-green-100 hover:bg-green-200"
                      : "text-blue-700 bg-blue-100 hover:bg-blue-200"
                  } transition-colors`}
                >
                  {isEditing ? (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  ) : (
                    <>
                      <Edit3 className="h-4 w-4 mr-2" />
                      Edit Profile
                    </>
                  )}
                </button>
              </div>

              <div className="p-6">
                <div className="space-y-6">
                  {/* Avatar Section */}
                  <div className="flex items-center space-x-6">
                    <div className="h-24 w-24 rounded-full bg-gray-300 flex items-center justify-center">
                      <User className="h-12 w-12 text-gray-600" />
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </h4>
                      <p className="text-gray-600">{user.email}</p>
                      <p className="text-sm text-gray-500">
                        Member since{" "}
                        {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      ) : (
                        <p className="py-2 text-gray-900">{user.firstName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      ) : (
                        <p className="py-2 text-gray-900">{user.lastName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      {isEditing ? (
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      ) : (
                        <p className="py-2 text-gray-900">{user.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Role
                      </label>
                      <p className="py-2 text-gray-900 capitalize">
                        {user.role}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Member Since
                      </label>
                      <p className="py-2 text-gray-900">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                      <button
                        onClick={handleEditToggle}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Save Changes
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Account Settings */}
            <div className="mt-8 bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Account Settings
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                      <Shield className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">
                          Change Password
                        </p>
                        <p className="text-sm text-gray-500">
                          Update your account password
                        </p>
                      </div>
                    </div>
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      Change
                    </button>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                      <Bell className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">
                          Email Notifications
                        </p>
                        <p className="text-sm text-gray-500">
                          Manage your notification preferences
                        </p>
                      </div>
                    </div>
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      Configure
                    </button>
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center space-x-3">
                      <Settings className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">
                          Account Preferences
                        </p>
                        <p className="text-sm text-gray-500">
                          Language, timezone, and display settings
                        </p>
                      </div>
                    </div>
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      Manage
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Stats & Activity */}
          <div className="space-y-6">
            {/* Assessment Statistics */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Assessment Statistics
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Activity className="h-5 w-5 text-blue-500" />
                    <span className="text-sm text-gray-600">Completed</span>
                  </div>
                  <span className="font-medium text-gray-900">
                    {completedAssessments.length}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    <span className="text-sm text-gray-600">Average Score</span>
                  </div>
                  <span className="font-medium text-gray-900">
                    {averageScore}%
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Award className="h-5 w-5 text-yellow-500" />
                    <span className="text-sm text-gray-600">Highest Level</span>
                  </div>
                  <span className="font-medium text-gray-900">
                    {getHighestLevel()}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-purple-500" />
                    <span className="text-sm text-gray-600">Certificates</span>
                  </div>
                  <span className="font-medium text-gray-900">
                    {
                      completedAssessments.filter((a: any) => a.score >= 25)
                        .length
                    }
                  </span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Recent Activity
              </h3>
              <div className="space-y-3">
                {completedAssessments
                  .slice(0, 5)
                  .map((assessment: Assessment) => (
                    <div
                      key={assessment.id}
                      className="flex items-start space-x-3"
                    >
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">
                          Completed{" "}
                          <strong>Assessment Step {assessment.step}</strong>
                        </p>
                        <p className="text-xs text-gray-500">
                          Score: {assessment.score || 0}% •{" "}
                          {assessment.endTime
                            ? new Date(assessment.endTime).toLocaleDateString()
                            : assessment.updatedAt
                            ? new Date(
                                assessment.updatedAt
                              ).toLocaleDateString()
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                  ))}
                {completedAssessments.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No recent activity
                  </p>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Award className="h-5 w-5 text-blue-500" />
                    <span className="text-sm font-medium text-gray-900">
                      View Certificates
                    </span>
                  </div>
                </button>
                <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Activity className="h-5 w-5 text-green-500" />
                    <span className="text-sm font-medium text-gray-900">
                      Start Assessment
                    </span>
                  </div>
                </button>
                <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="h-5 w-5 text-purple-500" />
                    <span className="text-sm font-medium text-gray-900">
                      View Progress
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default withAuth(ProfilePage);
