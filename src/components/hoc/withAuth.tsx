"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

/**
 * Higher-order component that protects routes requiring authentication
 * Redirects to login page if user is not authenticated
 */
interface WithAuthProps {
  children?: React.ReactNode;
}

export default function withAuth<P extends object = {}>(
  WrappedComponent: React.ComponentType<P>
) {
  const AuthenticatedComponent = (props: P) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = React.useState(true);
    const [isAuthenticated, setIsAuthenticated] = React.useState(false);

    useEffect(() => {
      const checkAuth = async () => {
        try {
          const accessToken = localStorage.getItem("accessToken");
          const refreshToken = localStorage.getItem("refreshToken");

          if (!accessToken || !refreshToken) {
            console.log("No tokens found, redirecting to login");
            setIsAuthenticated(false);
            setIsLoading(false);
            router.push("/auth/login");
            return;
          }

          // Verify token by making a request to profile endpoint
          const response = await fetch("/api/users/profile", {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            const userData = await response.json();
            console.log("Token valid, user authenticated");

            // Check if email is verified
            if (!userData.data?.isEmailVerified) {
              console.log(
                "Email not verified, redirecting to verification page"
              );
              router.push("/auth/verify-email");
              return;
            }

            setIsAuthenticated(true);
          } else if (response.status === 401) {
            console.log("Token expired, attempting refresh");
            // Token might be expired, try to refresh
            const refreshResponse = await fetch("/api/auth/refresh", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ refreshToken }),
            });

            if (refreshResponse.ok) {
              const data = await refreshResponse.json();
              console.log("Token refreshed successfully");
              localStorage.setItem("accessToken", data.accessToken);
              if (data.refreshToken) {
                localStorage.setItem("refreshToken", data.refreshToken);
              }
              setIsAuthenticated(true);
            } else {
              console.log("Token refresh failed, redirecting to login");
              // Refresh failed, redirect to login
              localStorage.removeItem("accessToken");
              localStorage.removeItem("refreshToken");
              setIsAuthenticated(false);
              router.push("/auth/login");
            }
          } else {
            console.log("Unexpected response from profile endpoint");
            setIsAuthenticated(false);
            router.push("/auth/login");
          }
        } catch (error) {
          console.error("Auth check error:", error);
          setIsAuthenticated(false);
          router.push("/auth/login");
        } finally {
          setIsLoading(false);
        }
      };

      checkAuth();
    }, [router]);

    if (isLoading) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Verifying authentication...
            </h2>
            <p className="text-gray-600">Please wait a moment</p>
          </div>
        </div>
      );
    }

    if (!isAuthenticated) {
      return null; // Router will handle redirect
    }

    return <WrappedComponent {...props} />;
  };

  AuthenticatedComponent.displayName = `withAuth(${
    WrappedComponent.displayName || WrappedComponent.name
  })`;

  return AuthenticatedComponent;
}
