"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useProfile } from "@/hooks/api";
import {
  BookOpen,
  Award,
  Timer,
  Shield,
  Users,
  ChevronRight,
  Loader2,
} from "lucide-react";

interface Feature {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

/**
 * HomePage component
 * Landing page for unauthenticated users only
 * Redirects authenticated users to dashboard
 */
export default function HomePage(): React.JSX.Element {
  const router = useRouter();
  const { data: profileData, isLoading, error } = useProfile();

  useEffect(() => {
    // If user is authenticated (has valid profile data), redirect to dashboard
    if (profileData?.data && !error) {
      router.push("/dashboard");
    }
  }, [profileData, error, router]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is authenticated, don't show home page content (will be redirected)
  if (profileData?.data && !error) {
    return <div></div>;
  }
  const features: Feature[] = [
    {
      icon: BookOpen,
      title: "Progressive Assessment",
      description: "3-step evaluation pathway from A1 to C2 levels",
    },
    {
      icon: Award,
      title: "Digital Certification",
      description: "Automated certificate generation based on achievement",
    },
    {
      icon: Timer,
      title: "Timed Assessments",
      description: "Structured timing with auto-submit functionality",
    },
    {
      icon: Shield,
      title: "Secure Environment",
      description: "Protected assessment environment with integrity measures",
    },
    {
      icon: Users,
      title: "Role-Based Access",
      description:
        "Different access levels for admins, students, and supervisors",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center py-20">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Test_School Digital Competency Platform
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Assess and certify your digital skills through structured competency
            evaluations. Progress through A1 to C2 levels with our comprehensive
            3-step assessment system.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center px-8 py-3 text-lg font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 gap-2"
            >
              Get Started
              <ChevronRight className="w-5 h-5" />
            </Link>
            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center px-8 py-3 text-lg font-medium rounded-lg text-blue-600 bg-white border-2 border-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
            >
              Sign In
            </Link>
          </div>

          {/* Admin Access */}
          <div className="mt-6 text-center">
            <Link
              href="/admin/login"
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
              <Shield className="w-4 h-4 mr-1" />
              Admin Access
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Platform Features
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300"
              >
                <feature.icon className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Assessment Levels */}
        <div className="py-20 bg-gray-50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Assessment Levels
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
                <div className="text-center">
                  <div className="bg-blue-100 text-blue-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                    1
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Step 1: A1-A2
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Basic digital competency assessment. Score ≥75% to proceed
                    to Step 2.
                  </p>
                  <ul className="text-sm text-gray-500 space-y-1">
                    <li>• &lt;25%: Fail (no retake)</li>
                    <li>• 25-49.99%: A1 certified</li>
                    <li>• 50-74.99%: A2 certified</li>
                    <li>• ≥75%: A2 + proceed to Step 2</li>
                  </ul>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
                <div className="text-center">
                  <div className="bg-green-100 text-green-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                    2
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Step 2: B1-B2
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Intermediate digital competency assessment. Score ≥75% to
                    proceed to Step 3.
                  </p>
                  <ul className="text-sm text-gray-500 space-y-1">
                    <li>• &lt;25%: Remain at A2</li>
                    <li>• 25-49.99%: B1 certified</li>
                    <li>• 50-74.99%: B2 certified</li>
                    <li>• ≥75%: B2 + proceed to Step 3</li>
                  </ul>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
                <div className="text-center">
                  <div className="bg-yellow-100 text-yellow-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                    3
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Step 3: C1-C2
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Advanced digital competency assessment. Achieve the highest
                    certification levels.
                  </p>
                  <ul className="text-sm text-gray-500 space-y-1">
                    <li>• &lt;25%: Remain at B2</li>
                    <li>• 25-49.99%: C1 certified</li>
                    <li>• ≥50%: C2 certified</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-20 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to assess your digital competencies?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of users who have already certified their digital
            skills through our comprehensive assessment platform.
          </p>
          <Link
            href="/auth/register"
            className="inline-flex items-center justify-center px-8 py-3 text-lg font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 gap-2"
          >
            Start Your Assessment Journey
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
