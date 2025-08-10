"use client";

import React from "react";
import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/layout/AdminSidebar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

/**
 * Admin layout component that provides admin-specific navigation and styling
 * Only applies to admin routes and includes admin sidebar
 */
export default function AdminLayout({
  children,
}: AdminLayoutProps): React.JSX.Element {
  const pathname = usePathname();

  // Check if this is an admin auth page (login)
  const isAdminAuthPage = pathname === "/admin/login";

  // For admin auth pages, render without sidebar
  if (isAdminAuthPage) {
    return <main className="min-h-screen bg-gray-50">{children}</main>;
  }

  // For admin dashboard pages, render with admin sidebar
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 overflow-x-hidden">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
