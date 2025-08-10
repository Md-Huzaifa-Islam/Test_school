"use client";

import LoginForm from "@/components/auth/LoginForm";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProfile } from "@/hooks/api";
import { Loader2 } from "lucide-react";

/**
 * Login page component
 */
export default function LoginPage(): React.JSX.Element {
  const router = useRouter();
  const { data: profileData, isLoading, error } = useProfile();

  useEffect(() => {
    // Only redirect if we have valid profile data (user is actually authenticated)
    if (profileData?.data && !error) {
      router.push("/dashboard");
    }
  }, [profileData, error, router]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return <LoginForm />;
}
