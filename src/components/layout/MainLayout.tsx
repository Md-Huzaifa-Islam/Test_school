"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Navigation from "./Navigation";

interface MainLayoutProps {
  children: React.ReactNode;
}

/**
 * Main layout component that conditionally applies navigation and spacing
 * Only shows navigation and applies sidebar margin for authenticated pages
 */
export default function MainLayout({
  children,
}: MainLayoutProps): React.JSX.Element {
  const pathname = usePathname();

  // Check if this is an auth page or admin page
  const isAuthPage = pathname.startsWith("/auth");
  const isAdminPage = pathname.startsWith("/admin");

  // For auth pages or admin pages, render without regular navigation
  if (isAuthPage || isAdminPage) {
    return <main className="min-h-screen">{children}</main>;
  }

  // For authenticated pages, render with navigation and sidebar spacing
  return (
    <div className="flex min-h-screen">
      <Navigation />
      <main className="flex-1">{children}</main>
    </div>
  );
}
