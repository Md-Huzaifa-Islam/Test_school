"use client";

import React from "react";
import withAuth from "@/components/hoc/withAuth";
import Dashboard from "@/components/pages/Dashboard";

/**
 * Dashboard page component
 * Protected route that requires authentication
 */
function DashboardPage() {
  return <Dashboard />;
}

// Export the wrapped component
export default withAuth(DashboardPage);
