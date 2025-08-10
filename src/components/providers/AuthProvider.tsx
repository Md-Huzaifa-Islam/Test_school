"use client";

import React, { useEffect } from "react";

/**
 * AuthProvider component that handles authentication state initialization
 * Manages JWT tokens and authentication state
 */
interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  useEffect(() => {
    // Check for stored tokens on mount
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (accessToken && refreshToken) {
      // Tokens exist in localStorage, they will be picked up by the API client
      console.log(
        "User tokens found, authentication state will be managed by API client"
      );
    }
  }, []);

  return <>{children}</>;
}
