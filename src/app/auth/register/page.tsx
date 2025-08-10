"use client";

import * as React from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import RegisterForm from "@/components/auth/RegisterForm";
import { useProfile } from "@/hooks/api";
import { Loader2 } from "lucide-react";

/**
 * Register page component
 */
export default function RegisterPage(): React.JSX.Element {
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

  return <RegisterForm />;
}
