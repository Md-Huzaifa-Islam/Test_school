"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Award, Calendar, User, Download, ArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "@/lib/api";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface Certificate {
  _id: string;
  certificateNumber: string;
  userId: string;
  level: string;
  assessmentId: string;
  issuedDate: string;
  validUntil?: string;
  status: "active" | "revoked";
  user: {
    name: string;
    email: string;
  };
}

interface CertificateViewProps {
  certificateId: string;
}

export default function CertificateView({
  certificateId,
}: CertificateViewProps) {
  const router = useRouter();
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/users/certificates/${certificateId}`);
        setCertificate(response.data.data);
      } catch (error: any) {
        console.error("Error fetching certificate:", error);

        if (error.response?.status === 404) {
          // Certificate not found - might be an assessment ID instead
          toast.error(
            "Certificate not found. This may be pending supervisor approval or the assessment may not qualify for a certificate."
          );
        } else {
          toast.error("Certificate not found or access denied");
        }
        router.push("/certificates");
      } finally {
        setLoading(false);
      }
    };

    if (certificateId && certificateId !== "undefined") {
      fetchCertificate();
    } else {
      toast.error("Invalid certificate ID");
      router.push("/certificates");
    }
  }, [certificateId, router]);

  const handleDownload = async () => {
    try {
      const response = await api.get(
        `/users/certificates/${certificateId}/download`,
        {
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `certificate-${certificate?.certificateNumber}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading certificate:", error);
      toast.error("Failed to download certificate");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!certificate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => router.push("/certificates")}
            className="mb-6 flex items-center text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Certificates
          </button>
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Certificate Not Available
            </h1>
            <p className="text-gray-600 mb-4">
              The requested certificate could not be found. This could be
              because:
            </p>
            <ul className="text-left text-gray-600 mb-6 max-w-md mx-auto">
              <li className="mb-2">
                • The assessment hasn't been completed yet
              </li>
              <li className="mb-2">
                • The score didn't meet certification requirements (25% minimum)
              </li>
              <li className="mb-2">
                • The certificate is pending supervisor approval
              </li>
              <li className="mb-2">
                • You don't have access to this certificate
              </li>
            </ul>
            <p className="text-sm text-gray-500">
              If you believe this is an error, please contact your supervisor.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => router.push("/certificates")}
            className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Certificates
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </button>
        </div>

        {/* Certificate Display */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Certificate Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white text-center">
            <Award className="h-16 w-16 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">
              Certificate of Achievement
            </h1>
            <p className="text-blue-100">
              Test_School Competency Assessment Platform
            </p>
          </div>

          {/* Certificate Body */}
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                This certifies that
              </h2>
              <div className="text-4xl font-bold text-blue-600 mb-4 border-b-2 border-blue-200 pb-2 inline-block">
                {certificate.user.name}
              </div>
              <p className="text-lg text-gray-700 mb-6">
                has successfully completed the assessment and achieved
              </p>
              <div className="text-3xl font-bold text-purple-600 mb-6">
                {certificate.level} Level Certification
              </div>
            </div>

            {/* Certificate Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="font-semibold text-gray-700">
                    Issue Date
                  </span>
                </div>
                <p className="text-gray-900">
                  {new Date(certificate.issuedDate).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Award className="h-5 w-5 text-purple-600 mr-2" />
                  <span className="font-semibold text-gray-700">
                    Certificate Number
                  </span>
                </div>
                <p className="text-gray-900 font-mono">
                  {certificate.certificateNumber}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <User className="h-5 w-5 text-green-600 mr-2" />
                  <span className="font-semibold text-gray-700">
                    Recipient Email
                  </span>
                </div>
                <p className="text-gray-900">{certificate.user.email}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Award className="h-5 w-5 text-orange-600 mr-2" />
                  <span className="font-semibold text-gray-700">Status</span>
                </div>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    certificate.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {certificate.status.charAt(0).toUpperCase() +
                    certificate.status.slice(1)}
                </span>
              </div>
            </div>

            {/* Validation Note */}
            <div className="border-t border-gray-200 pt-6 text-center">
              <p className="text-sm text-gray-600">
                This certificate can be verified at{" "}
                <span className="font-semibold">testschool.com/verify</span>{" "}
                using certificate number{" "}
                <span className="font-mono font-semibold">
                  {certificate.certificateNumber}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
