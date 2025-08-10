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

  // Check if this is an auth page
  const isAuthPage = pathname.startsWith("/auth");

  // For auth pages, render without navigation or sidebar spacing
  if (isAuthPage) {
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
