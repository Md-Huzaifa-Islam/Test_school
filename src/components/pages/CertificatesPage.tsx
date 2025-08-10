"use client";

import React from "react";
import { useProfile, useCertificates } from "@/hooks/api";
import { Certificate, User } from "@/types/api";
import withAuth from "@/components/hoc/withAuth";
import {
  Award,
  Download,
  Calendar,
  User as UserIcon,
  CheckCircle,
  Star,
  FileText,
  Mail,
  Loader2,
  XCircle,
  Zap,
} from "lucide-react";

/**
 * Certificates page component showing earned certificates
 * Displays certificates with download functionality
 * Protected route that requires authentication
 */
function CertificatesPage(): React.JSX.Element {
  const {
    data: profileData,
    isLoading: isProfileLoading,
    error: profileError,
  } = useProfile();
  const {
    data: certificatesData,
    isLoading: isCertificatesLoading,
    error: certificatesError,
  } = useCertificates();

  if (isProfileLoading || isCertificatesLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-yellow-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Loading certificates...
          </h1>
          <p className="text-gray-600">Gathering your achievements</p>
        </div>
      </main>
    );
  }

  if (profileError || certificatesError) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-8 w-8 text-red-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Error loading certificates
          </h1>
          <p className="text-gray-600">
            {profileError?.message ||
              certificatesError?.message ||
              "Something went wrong"}
          </p>
        </div>
      </main>
    );
  }

  const user: User = profileData?.data;
  const certificates: Certificate[] = certificatesData?.data || [];

  if (!user) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Please log in to view certificates
          </h1>
        </div>
      </main>
    );
  }

  const getCertificateColor = (level: string) => {
    switch (level) {
      case "A1":
        return {
          bg: "bg-green-100",
          text: "text-green-800",
          border: "border-green-200",
        };
      case "A2":
        return {
          bg: "bg-blue-100",
          text: "text-blue-800",
          border: "border-blue-200",
        };
      case "B1":
        return {
          bg: "bg-yellow-100",
          text: "text-yellow-800",
          border: "border-yellow-200",
        };
      case "B2":
        return {
          bg: "bg-orange-100",
          text: "text-orange-800",
          border: "border-orange-200",
        };
      case "C1":
        return {
          bg: "bg-purple-100",
          text: "text-purple-800",
          border: "border-purple-200",
        };
      case "C2":
        return {
          bg: "bg-red-100",
          text: "text-red-800",
          border: "border-red-200",
        };
      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-800",
          border: "border-gray-200",
        };
    }
  };

  const downloadCertificate = (certificateId: string) => {
    // TODO: Implement certificate download functionality
    console.log("Downloading certificate:", certificateId);
    alert("Certificate download functionality will be implemented here.");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                Certificates
              </h1>
              <p className="text-lg text-gray-600 mt-2">
                Your digital competency certifications
              </p>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 bg-yellow-50 px-4 py-2 rounded-full">
                <UserIcon className="h-5 w-5 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-900">
                  {user.firstName} {user.lastName}
                </span>
              </div>
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-green-400 to-green-600 text-white shadow-md">
                <Zap className="h-4 w-4 mr-2" />
                {certificates.length} Certificate
                {certificates.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Certificates Overview */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Certification Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {["A1", "A2", "B1", "B2", "C1", "C2"].map((level) => {
              const certificate = certificates.find((c) => c.level === level);
              const colors = getCertificateColor(level);

              return (
                <div
                  key={level}
                  className={`p-4 rounded-lg border-2 ${
                    certificate
                      ? `${colors.bg} ${colors.border}`
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        Level {level}
                      </h3>
                      {certificate ? (
                        <p className="text-sm text-gray-600">
                          Score: {certificate.score}%
                        </p>
                      ) : (
                        <p className="text-sm text-gray-500">Not earned</p>
                      )}
                    </div>
                    {certificate ? (
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    ) : (
                      <div className="h-6 w-6 rounded-full border-2 border-gray-300" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Certificates List */}
        <div className="space-y-6">
          {certificates.length > 0 ? (
            certificates
              .sort(
                (a, b) =>
                  new Date(b.issuedAt).getTime() -
                  new Date(a.issuedAt).getTime()
              )
              .map((certificate) => {
                const colors = getCertificateColor(certificate.level);

                return (
                  <div
                    key={certificate.id}
                    className={`bg-white rounded-lg shadow-lg overflow-hidden border-l-4 ${colors.border.replace(
                      "border-",
                      "border-l-"
                    )}`}
                  >
                    <div className="p-8">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-4">
                            <Award className="h-8 w-8 text-yellow-500" />
                            <div>
                              <h3 className="text-2xl font-bold text-gray-900">
                                Digital Competency Certificate
                              </h3>
                              <p className="text-lg text-gray-600">
                                Level {certificate.level}
                              </p>
                            </div>
                          </div>

                          <div className="mb-6">
                            <p className="text-gray-700 mb-2">
                              This certifies that{" "}
                              <strong>
                                {user.firstName} {user.lastName}
                              </strong>{" "}
                              has successfully demonstrated Level{" "}
                              {certificate.level} digital competency in:
                            </p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {certificate.competencies.map(
                                (competency, index) => (
                                  <span
                                    key={index}
                                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${colors.bg} ${colors.text}`}
                                  >
                                    {competency}
                                  </span>
                                )
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4" />
                              <span>
                                Issued:{" "}
                                {new Date(
                                  certificate.issuedAt
                                ).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Star className="h-4 w-4" />
                              <span>Score: {certificate.score}%</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <FileText className="h-4 w-4" />
                              <span>ID: {certificate.certificateNumber}</span>
                            </div>
                          </div>
                        </div>

                        <div className="ml-6 flex flex-col space-y-3">
                          <button
                            onClick={() =>
                              downloadCertificate(certificate.certificateNumber)
                            }
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </button>
                          <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            <Mail className="h-4 w-4 mr-2" />
                            Share
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
          ) : (
            <div className="text-center py-16">
              <Award className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                No certificates yet
              </h3>
              <p className="text-gray-500 mb-6">
                Complete assessments to earn your digital competency
                certificates.
              </p>
              <a
                href="/assessments"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Start Assessment
              </a>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default withAuth(CertificatesPage);
